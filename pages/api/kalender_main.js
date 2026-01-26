import { GetKalender } from "../../lib/kalender/former";

export default async function handler(req, res) {
  try {
    const { bulan,tahun,hari } = req.query;
    if (!bulan||!tahun||!hari) {
      return res.status(400).json({ message: "hari, bulan atau tahun kosong" });
    }
    
    const result = GetKalender(bulan,tahun,hari);

    return res.status(200).json({result});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
