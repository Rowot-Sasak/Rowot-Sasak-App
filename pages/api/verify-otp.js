import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const client = await clientPromise;
    const db = client.db("DatabaseRowotSasak");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });

    if (new Date(user.otpExpires) < new Date()) return res.status(400).json({ message: "OTP expired" });

    await users.updateOne({ email }, { $set: { isVerified: true }, $unset: { otp: "", otpExpires: "" } });

    res.status(200).json({ message: "User verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
