import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const { survey_id } = req.query;

  if (!survey_id) {
    return res.status(400).json({ message: "survey_id is required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("RowotSasak");
    const questionsCollection = db.collection("questions");

    const data = await questionsCollection.findOne(
      { survey_id: Number(survey_id) }
    );

    if (!data) {
      return res.status(404).json({ message: "Questions not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
