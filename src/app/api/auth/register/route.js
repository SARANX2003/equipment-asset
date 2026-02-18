import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();

    const { name, username, email, password } = await req.json();

    // 1. validate
    if (!name || !username || !email || !password) {
      return NextResponse.json(
        { message: "กรอกข้อมูลไม่ครบ" },
        { status: 400 }
      );
    }

    // 2. check duplicate
    const existUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existUser) {
      return NextResponse.json(
        { message: "Username หรือ Email ถูกใช้แล้ว" },
        { status: 409 }
      );
    }

    // 3. hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. create user
    await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ" },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
