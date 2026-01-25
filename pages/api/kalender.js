import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("RowotSasak");
    const kalender = db.collection("kalender");

    const { bulan, tahun } = req.query;

    const filter = {};
    if (bulan) filter.bulan = bulan;
    if (tahun) filter.tahun = Number(tahun);

    const data = await kalender
      .find(filter)
      .sort({ tahun: 1, bulan: 1 }) 
      .toArray();

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}