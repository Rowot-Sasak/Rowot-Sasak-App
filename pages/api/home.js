import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("RowotSasak");

    const eventsCol = db.collection("event");
    const budayaCol = db.collection("budaya");

    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const todaysEvents = await eventsCol
      .find({ time: { $gte: startOfDay, $lt: endOfDay } })
      .sort({ time: 1 })
      .toArray();
    const randomBudaya = await budayaCol
      .aggregate([{ $sample: { size: 5 } }])
      .toArray();
    res.status(200).json({
      date: startOfDay.toISOString().split("T")[0],
      totalEvents: todaysEvents.length,
      events: todaysEvents,
      budaya: randomBudaya
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
