import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userId } = req.query;
  if (!userId || userId === "null" || userId === "undefined") {
    return res.status(400).json({ message: "userId wajib diisi" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("RowotSasak");
    const usersCollection = db.collection("users");
    const adminsCollection = db.collection("admins");
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const admin = await adminsCollection.findOne({ _id: new ObjectId(decoded.adminId) });
    if (!admin) {
      return res.status(403).json({ message: "Forbidden: not an admin" });
    }

    let objectUserId;
    try {
      objectUserId = new ObjectId(userId);
    } catch (err) {
      return res.status(400).json({ message: "Format userId tidak valid" });
    }

    const user = await usersCollection.findOne(
      { _id: objectUserId },
      { projection: { _id: 0, name: 1 } }
    );

    if (!user) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    return res.status(200).json({
      name: user.name
    });

  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}