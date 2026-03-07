import clientPromise from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import ImageKit from "imagekit";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: { bodyParser: false }
};

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
export default async function handler(req, res) {
  if (!["GET", "PUT"].includes(req.method)) {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    if (req.method === "GET") {
      const user = await users.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { name: 1, profileImage: 1, email: 1 } }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        name: user.name,
        email: user.email,
        profileImage: user.profileImage || null
      });
    }

    if (req.method === "PUT") {
      const user = await users.findOne({
        _id: new ObjectId(decoded.userId)
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tempOldImage = user.profileImage;
      const form = formidable({ multiples: false });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          return res.status(500).json({ message: "Form parse error" });
        }

        const updateData = {};

        if (fields.name) {
          updateData.name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
        }
        if (files.file) {
          const file = files.file[0];
          const buffer = fs.readFileSync(file.filepath);

          const upload = await imagekit.upload({
            file: buffer,
            fileName: file.originalFilename,
            folder: "foto_profil"
          });

          updateData.profileImage = upload.url;
        }
        if (Object.keys(updateData).length === 0) {
          return res.status(400).json({
            message: "Nothing to update"
          });
        }

        await users.updateOne(
          { _id: user._id },
          { $set: updateData }
        );
        if (updateData.profileImage && tempOldImage && tempOldImage !== updateData.profileImage) {
          try {
            const cleanUrl = tempOldImage.split("?")[0];
            const endpoint = process.env.IMAGEKIT_URL_ENDPOINT;

            const filePath = cleanUrl.replace(endpoint, "");
            const folderPath = filePath.substring(0, filePath.lastIndexOf("/"));

            const files = await imagekit.listFiles({ path: folderPath });

            const target = files.find(f => f.filePath === filePath);

            if (target) {
              await imagekit.deleteFile(target.fileId);
            } else {
              console.warn("No matching image found:", filePath);
            }
          } catch (err) {
            console.error("Failed deleting old image:", err.message);
          }
        }

        return res.status(200).json({
          message: "Profile updated",
          ...updateData
        });
      });
    }

  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
