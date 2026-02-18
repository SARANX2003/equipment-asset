import dbConnect from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await dbConnect();

  try {
    const equipment = await Equipment.findById(params.id);

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
    });

  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
