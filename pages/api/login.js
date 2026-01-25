import clientPromise from "../../lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const client = await clientPromise;
    
    const db = client.db("RowotSasak");
    const users = db.collection("users");

    const user = await users.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
