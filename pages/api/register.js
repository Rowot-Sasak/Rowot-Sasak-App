import clientPromise from "../../lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

    const client = await clientPromise;
    const db = client.db("DatabaseRowotSasak");
    const users = db.collection("users");

    const existingUser = await users.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = crypto.randomInt(100000, 999999).toString(); 
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

    await users.insertOne({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Hello ${name}, your OTP code is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(201).json({ message: "User registered. Check your email for OTP." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
