import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "กรุณากรอกอีเมล" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "ไม่พบผู้ใช้งานอีเมลนี้" },
        { status: 404 }
      );
    }

    // สร้าง token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 นาที
    await user.save();

    // สร้างลิงก์
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    // ตั้งค่า transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ส่งอีเมล
    await transporter.sendMail({
      from: `"ระบบจัดการครุภัณฑ์" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "รีเซ็ตรหัสผ่าน",
      html: `
        <h2>รีเซ็ตรหัสผ่าน</h2>
        <p>คลิกปุ่มด้านล่างเพื่อเปลี่ยนรหัสผ่าน:</p>
        <a href="${resetUrl}" 
           style="background:#16a34a;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
           เปลี่ยนรหัสผ่าน
        </a>
        <p>ลิงก์นี้มีอายุ 15 นาที</p>
      `,
    });

    return NextResponse.json(
      { message: "ส่งอีเมลเรียบร้อยแล้ว" },
      { status: 200 }
    );

  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
