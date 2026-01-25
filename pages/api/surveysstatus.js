import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const userId = decoded.userId;
    if (!userId) return res.status(401).json({ message: "Invalid token: no userId" });

    const { survey_id } = req.query;
    if (!survey_id) return res.status(400).json({ message: "survey_id is required" });

    const client = await clientPromise;
    const db = client.db("RowotSasak");
    const surveysAnswers = db.collection("surveys_answers");

    const answer = await surveysAnswers.findOne({
      survey_id: new ObjectId(survey_id),
      user_id: new ObjectId(userId)
    });

    if (answer) {
      return res.status(200).json({ answered: true, submittedAt: answer.submittedAt });
    } else {
      return res.status(200).json({ answered: false });
    }

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
