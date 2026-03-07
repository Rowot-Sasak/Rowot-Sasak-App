import clientPromise from "../../../lib/mongodb";
import { ObjectId } from "mongodb";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const surveyAnswers = db.collection("surveys_answers");
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

    if (req.method === "GET") {
     const { surveyId } = req.query;
        if (!surveyId)
            return res.status(400).json({ message: "surveyId wajib diisi" });

        let objectSurveyId;
        try {
            objectSurveyId = new ObjectId(surveyId);
        } catch {
            return res.status(400).json({ message: "surveyId tidak valid" });
        }

        const answers = await surveyAnswers
            .find({ survey_id: objectSurveyId })
            .sort({ submittedAt: -1 })
            .toArray();

        return res.status(200).json({
            total: answers.length,
            data: answers
        });
    }

    else return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
}
