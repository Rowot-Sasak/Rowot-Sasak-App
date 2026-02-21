import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("RowotSasak");
  const questionsCol = db.collection("questions");
  const admins = db.collection("admins");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    let decoded;
    try { decoded = jwt.verify(token, process.env.JWT_SECRET); } 
    catch { return res.status(401).json({ message: "Invalid or expired token" }); }

    const admin = await admins.findOne({ _id: new ObjectId(decoded.adminId) });
    if (!admin) return res.status(403).json({ message: "Forbidden: not an admin" });

    if (req.method === "POST") {
      const { surveyId, question, choices } = req.body;
      if (!surveyId || !question) return res.status(400).json({ message: "surveyId dan question wajib diisi" });

      const data = await questionsCol.findOne({ survey_id: new ObjectId(surveyId) });
      const nextQuestionId = data?.questions?.length + 1 || 1;

      const questionObj = { question_id: nextQuestionId, question, choices: choices || [] };

      if (data) {
        await questionsCol.updateOne(
          { survey_id: new ObjectId(surveyId) },
          { $push: { questions: questionObj } }
        );
      } else {
        await questionsCol.insertOne({
          survey_id: new ObjectId(surveyId),
          questions: [questionObj]
        });
      }

      return res.status(201).json({ message: "Question berhasil ditambahkan" });
    }

    else if (req.method === "PUT") {
      const { surveyId, questionId, question, choices } = req.body;
      if (!surveyId || !questionId) return res.status(400).json({ message: "surveyId dan questionId wajib diisi" });
      console.log("tes", questionId);
      

      const updateObj = {};
      if (question) updateObj["questions.$.question"] = question;
      if (choices) updateObj["questions.$.choices"] = choices;

      const result = await questionsCol.updateOne(
        { survey_id: new ObjectId(surveyId), "questions.question_id": questionId },
        { $set: updateObj }
      );

      if (result.matchedCount === 0) return res.status(404).json({ message: "Question tidak ditemukan" });
      return res.status(200).json({ message: "Question berhasil diperbarui" });
    }

    else if (req.method === "DELETE") {
      const { surveyId, questionId } = req.body;
      if (!surveyId || !questionId) return res.status(400).json({ message: "surveyId dan questionId wajib diisi" });

      const result = await questionsCol.updateOne(
        { survey_id: new ObjectId(surveyId) },
        { $pull: { questions: { question_id: questionId } } }
      );

      if (result.modifiedCount === 0) return res.status(404).json({ message: "Question tidak ditemukan" });
      return res.status(200).json({ message: "Question berhasil dihapus" });
    }

    else return res.status(405).json({ message: "Method not allowed" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
