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

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const client = await clientPromise;
    const db = client.db("DatabaseRowotSasak");
    const users = db.collection("users");

    if (req.method === "GET") {
      const user = await users.findOne(
        { _id: new ObjectId(decoded.userId) },
        { projection: { name: 1 } } 
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ name: user.name });
    }

    if (req.method === "PUT") {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: "Name is required" });
      }

      const result = await users.updateOne(
        { _id: new ObjectId(decoded.userId) },
        { $set: { name } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ message: "Name updated successfully", name });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
