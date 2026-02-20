import dbConnect from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // 🔥 เช็ค ObjectId ก่อน
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID ไม่ถูกต้อง" },
        { status: 400 }
      );
    }

    const equipment = await Equipment.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });

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

    equipment.status = "Borrowed";
    await equipment.save();

    return NextResponse.json({
      message: "ยืมสำเร็จ",
      equipment,
    });

  } catch (error) {
    console.error("BORROW ERROR:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในระบบ" },
      { status: 500 }
    );
  }
}