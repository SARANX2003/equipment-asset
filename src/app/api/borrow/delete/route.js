import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { message: "ไม่พบ id" },
        { status: 400 }
      );
    }

    const borrow = await Borrow.findById(id);

    if (!borrow) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลคำขอยืม" },
        { status: 404 }
      );
    }

    // 🔥 ถ้ายังเป็น approved ให้คืนสถานะอุปกรณ์ก่อนลบ
    if (borrow.status === "approved") {
      await Equipment.findByIdAndUpdate(
        borrow.equipment,
        { status: "Available" }
      );
    }

    await Borrow.findByIdAndDelete(id);

    return NextResponse.json(
      { message: "ลบสำเร็จ" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}