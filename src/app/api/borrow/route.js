import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import User from "@/models/User"; // ✅ ต้อง import ตัวนี้
import { NextResponse } from "next/server";


// =========================
// GET - สำหรับ Admin ดูรายการ
// =========================
export async function GET() {
  await dbConnect();

  try {
    const borrows = await Borrow.find()
      .populate("equipment")
      .populate("user") // ตอนนี้จะไม่ error แล้ว
      .sort({ createdAt: -1 });

    return NextResponse.json(borrows);
  } catch (error) {
    console.error("GET BORROW ERROR:", error);
    return NextResponse.json(
      { message: "โหลดข้อมูลล้มเหลว" },
      { status: 500 }
    );
  }
}


// =========================
// POST - สร้างคำขอยืม
// =========================
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const borrow = await Borrow.create({
      equipment: body.equipmentId,
      user: body.userId,
      location: body.location,
      status: "pending",
    });

    return NextResponse.json(borrow);
  } catch (error) {
    console.error("POST BORROW ERROR:", error);
    return NextResponse.json(
      { message: "บันทึกไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
