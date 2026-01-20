import clientPromise from "../../../lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { email, password } = req.body;
  const client = await clientPromise;
  const db = client.db("DatabaseRowotSasak");
  const admins = db.collection("admins");

  const admin = await admins.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Admin not found" });

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

  return res.status(200).json({ message: "Login successful", token });
}
