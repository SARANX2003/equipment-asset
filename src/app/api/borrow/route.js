import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {

  await dbConnect();

  const borrows = await Borrow.find()
    .populate("equipment")   // ดึงข้อมูลอุปกรณ์
    .populate("user")        // ดึงข้อมูลผู้ยืม
    .sort({ createdAt: -1 });

  return NextResponse.json(borrows);

}

export async function POST(request) {
  try {

    await dbConnect();

    const { equipmentId, userId, location } = await request.json();

    if (
      !mongoose.Types.ObjectId.isValid(equipmentId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return NextResponse.json(
        { message: "ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return NextResponse.json(
        { message: "ไม่พบอุปกรณ์" },
        { status: 404 }
      );
    }

    if (equipment.status === "Borrowed") {
      return NextResponse.json(
        { message: "อุปกรณ์ถูกยืมแล้ว" },
        { status: 400 }
      );
    }

    const newBorrow = await Borrow.create({
      equipment: equipmentId,
      user: userId,
      location,
      status: "pending",
    });

    return NextResponse.json({
      message: "ส่งคำขอยืมสำเร็จ",
      borrow: newBorrow,
    });

  } catch (error) {

    console.error("BORROW ERROR:", error);

    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );

  }
}