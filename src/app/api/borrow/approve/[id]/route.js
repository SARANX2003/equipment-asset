import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "ID ไม่ถูกต้อง" }, { status: 400 });
    }

    const borrow = await Borrow.findById(id).populate("equipment");

    if (!borrow) {
      return NextResponse.json({ message: "ไม่พบคำขอ" }, { status: 404 });
    }

    if (borrow.status !== "pending") {
      return NextResponse.json(
        { message: "คำขอนี้ถูกดำเนินการแล้ว" },
        { status: 400 }
      );
    }

    // เปลี่ยนสถานะ borrow
    borrow.status = "approved";
    await borrow.save();

    // เปลี่ยนสถานะ equipment
    const equipment = await Equipment.findById(borrow.equipment._id);
    equipment.status = "Borrowed";
    await equipment.save();

    return NextResponse.json({ message: "อนุมัติสำเร็จ" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}