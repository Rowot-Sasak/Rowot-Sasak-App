import clientPromise from "../../lib/mongodb";
import nodemailer from "nodemailer";
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ message: "Method not allowed" });

  try {
    const { email } = req.body;
    if (!email) 
      return res.status(400).json({ message: "Email required" });

    const client = await clientPromise;
    const db = client.db();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) 
      return res.status(404).json({ message: "User not found" });

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await users.updateOne(
      { email },
      { $set: { otp, otpExpires } }
    );

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
      subject: "Reset Password OTP",
      text: `This OTP for resetting password is ${otp}. If this is not you, please do not share it. Valid for 10 minutes.`,
    });

    res.status(200).json({ message: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}