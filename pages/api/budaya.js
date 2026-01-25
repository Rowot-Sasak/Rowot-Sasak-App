import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("RowotSasak");
    const budayaCol = db.collection("budaya");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const total = await budayaCol.countDocuments();

    const sampledDocs = await budayaCol
      .aggregate([
        { $sample: { size: total } },
        { $skip: (page - 1) * limit }, 
        { $limit: limit }
      ])
      .toArray();

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: sampledDocs
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
