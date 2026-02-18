import dbConnect from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    // หาอุปกรณ์
    const equipment = await Equipment.findById(id);

    if (!equipment) {
      return NextResponse.json(
        { message: "ไม่พบอุปกรณ์" },
        { status: 404 }
      );
    }

    // ถ้าถูกยืมแล้ว
    if (equipment.status === "Borrowed") {
      return NextResponse.json(
        { message: "อุปกรณ์ถูกยืมแล้ว" },
        { status: 400 }
      );
    }

    // อัปเดตสถานะ
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
