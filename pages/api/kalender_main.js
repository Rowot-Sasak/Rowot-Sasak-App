import { GetKalender } from "../../lib/kalender/former";

export default async function handler(req, res) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "date is required (YYYY-MM-DD)" });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate)) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    const bulan = targetDate.getMonth() + 1; 
    const tahun = targetDate.getFullYear();
    
    const result = GetKalender(bulan,tahun);

    return res.status(200).json({result});

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
