import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const { username, password } = await req.json();
  console.log("INPUT PASSWORD:", password);
  console.log("PASSWORD LENGTH:", password?.length);

  const user = await User.findOne({ username }).select("+password");
  console.log("FOUND USER:", user);
  console.log("DB HASH:", user?.password);

  if (!user) {
    return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 401 });
  }

  const isMatch = await bcrypt.compare(password, user?.password || "");
  console.log("COMPARE RESULT:", isMatch);

  if (!isMatch) {
    return NextResponse.json(
      { message: "รหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return NextResponse.json({
    token,
    user: {
      _id: user._id,
      username: user.username,
      role: user.role,
    },
  });
}
