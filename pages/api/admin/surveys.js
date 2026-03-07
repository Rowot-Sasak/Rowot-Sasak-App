import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const surveys = db.collection("surveys");
  const admins = db.collection("admins");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    let decoded;
    try { decoded = jwt.verify(token, process.env.JWT_SECRET); } 
    catch { return res.status(401).json({ message: "Invalid or expired token" }); }

    const admin = await admins.findOne({ _id: new ObjectId(decoded.adminId) });
    if (!admin) return res.status(403).json({ message: "Forbidden: not an admin" });

    if (req.method === "POST") {
      const { nama, waktu, deskripsi } = req.body;
      if (!nama || !waktu) return res.status(400).json({ message: "nama dan waktu wajib diisi" });

      const result = await surveys.insertOne({
        nama,
        waktu: new Date(waktu),
        deskripsi: deskripsi || "",
        createdAt: new Date(),
        updatedAt: new Date()
      });

      return res.status(201).json({ message: "Survey berhasil dibuat", id: result.insertedId });
    }

    else if (req.method === "PUT") {
      const { surveyId, nama, waktu, deskripsi } = req.body;
      if (!surveyId) return res.status(400).json({ message: "surveyId wajib diisi" });

      const updateData = {};
      if (nama) updateData.nama = nama;
      if (waktu) updateData.waktu = new Date(waktu);
      if (deskripsi) updateData.deskripsi = deskripsi;
      updateData.updatedAt = new Date();

      const result = await surveys.updateOne({ _id: new ObjectId(surveyId) }, { $set: updateData });
      if (result.matchedCount === 0) return res.status(404).json({ message: "Survey tidak ditemukan" });

      return res.status(200).json({ message: "Survey berhasil diperbarui" });
    }

    else if (req.method === "DELETE") {
      const { surveyId } = req.body;
      if (!surveyId) return res.status(400).json({ message: "surveyId wajib diisi" });

      await surveys.deleteOne({ _id: new ObjectId(surveyId) });
      return res.status(200).json({ message: "Survey berhasil dihapus" });
    }

    else return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
