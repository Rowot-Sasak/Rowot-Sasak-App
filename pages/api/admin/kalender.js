import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("RowotSasak");
  const kalender = db.collection("kalender");
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
    if (!admin) {
      return res.status(403).json({ message: "Forbidden: not an admin" });
    }

    if (req.method === "POST") {
      const {
        bulan,
        tahun,
        wuku,
        engkal,
        pasebulan,
        hari_nasional,
        hari_sasak,
        kale_bulan,
        mangse,
        wukutabel,
        angkatgawe,
        pegawéan_bangket,
        penganjeng_bale,
        bekelampan
      } = req.body;

      if (!bulan || !tahun) {
        return res.status(400).json({ message: "bulan dan tahun wajib diisi" });
      }

      const result = await kalender.insertOne({
        bulan,
        tahun,
        wuku: wuku || [],
        engkal: engkal || [],
        pasebulan: pasebulan || [],     
        hari_nasional: hari_nasional || [],
        hari_sasak: hari_sasak || [],
        kale_bulan: kale_bulan || [],
        mangse: mangse || [],
        wukutabel: wukutabel || [],
        angkatgawe: angkatgawe || [],
        pegawéan_bangket: pegawéan_bangket || [],
        penganjeng_bale: penganjeng_bale || [],
        bekelampan: bekelampan || [],
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
    );

      return res.status(201).json({
        message: "Kalender berhasil dibuat",
        id: result.insertedId
      });
    }

    else if (req.method === "PUT") {
      const { id, ...updateData } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID kalender wajib diisi" });
      }

      updateData.updatedAt = new Date();

      const result = await kalender.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Kalender tidak ditemukan" });
      }

      return res.status(200).json({ message: "Kalender berhasil diperbarui" });
    }
    else if (req.method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: "ID kalender wajib diisi" });
      }

      const result = await kalender.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Kalender tidak ditemukan" });
      }

      return res.status(200).json({ message: "Kalender berhasil dihapus" });
    }
    else {
      return res.status(405).json({ message: "Method not allowed" });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: err.message || "Internal Server Error"
    });
  }
}
