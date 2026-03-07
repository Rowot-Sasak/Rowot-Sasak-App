import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const events = db.collection("event");
  const admins = db.collection("admins"); 

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const admin = await admins.findOne({ _id: new ObjectId(decoded.adminId) });
    if (!admin) return res.status(403).json({ message: "Forbidden: not an admin" });

    if (req.method === "POST") {
      const { judul,lokasi, isi, time,imagelink } = req.body;
      if (!judul|| !lokasi || !imagelink|| !isi || !time) return res.status(400).json({ message: "judul, lokasi, foto, isi, and time required" });

      const result = await events.insertOne({ judul,lokasi, isi, time, imagelink, createdAt: new Date() });
      return res.status(201).json({ message: "Event created", id: result.insertedId });
    } else if (req.method === "PUT") {
      const { id, judul, lokasi, isi, time, imagelink } = req.body;

      if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ message: "A valid ID is required for update" });
      }

      const updateData = {};
      if (judul) updateData.judul = judul;
      if (lokasi) updateData.lokasi = lokasi;
      if (isi) updateData.isi = isi;
      if (time) updateData.time = new Date(time);
      if (imagelink) updateData.imagelink = imagelink;
      
      updateData.updatedAt = new Date();

      const result = await events.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );


      return res.status(200).json({ 
        message: "Event updated successfully",
        modifiedCount: result.modifiedCount 
      });

    } else if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ message: "ID required" });

      const result = await events.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return res.status(404).json({ message: "Event not found" });

      return res.status(200).json({ message: "Event deleted" });

    } else {
      return res.status(405).json({ message: "Method not allowed" });
    }

  } catch (err) {
    console.error(err);
    return res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
  }
}
