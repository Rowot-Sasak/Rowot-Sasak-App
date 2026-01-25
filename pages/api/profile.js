import clientPromise from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

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
    const db = client.db("RowotSasak");
    const users = db.collection("users");

    if (req.method === "GET") {
      const user = await users.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { name: 1, profileImage: 1 } }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({
        name: user.name,
        profileImage: user.profileImage || null
      });
    }

    if (req.method === "PUT") {
      const { name, profileImage } = req.body;

      if (!name && !profileImage) {
        return res.status(400).json({
          message: "At least name or profileImage is required"
        });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (profileImage) updateData.profileImage = profileImage;

      await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: updateData }
      );

      return res.status(200).json({
        message: "Profile updated",
        ...updateData
      });
    }

  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
