import clientPromise from "../../lib/mongodb";
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

    const client = await clientPromise;
    const db = client.db();
    const surveysAnswers = db.collection("surveys_answers");
    const users = db.collection("users");

    if (req.method === "POST") {
      const { survey_id, answers } = req.body;
      if (!survey_id || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "survey_id and answers are required" });
      }

      for (const ans of answers) {
        if (!ans.question_id || !ans.choice) {
          return res.status(400).json({ message: "Each answer must have question_id and choice" });
        }
      }

      const result = await surveysAnswers.insertOne({
        survey_id: new ObjectId(survey_id),
        user_id: new ObjectId(userId),
        answers: answers,
        submittedAt: new Date()
      });

      return res.status(201).json({ message: "Answers submitted", id: result.insertedId });
    }

    else if (req.method === "PUT") {
      const { survey_id, answers } = req.body;
      if (!survey_id || !Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({ message: "survey_id and answers are required" });
      }

      for (const ans of answers) {
        if (!ans.question_id || !ans.choice) {
          return res.status(400).json({ message: "Each answer must have question_id and choice" });
        }
      }

      const result = await surveysAnswers.updateOne(
        { survey_id: new ObjectId(survey_id), user_id: new ObjectId(userId) },
        { $set: { answers: answers, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "No existing answers found for this survey by this user" });
      }

      return res.status(200).json({ message: "Answers updated" });
    }

    else return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
