import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const budayaCol = db.collection("event");

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const data = await budayaCol.findOne({
      _id: new ObjectId(id)
    });

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    res.status(200).json({
      data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}