import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    const { id } = await request.json();

    const borrow = await Borrow.findById(id);

    if (!borrow) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลคำขอยืม" },
        { status: 404 }
      );
    }

    borrow.status = "returned";
    await borrow.save();

    await Equipment.findByIdAndUpdate(
      borrow.equipment,
      { status: "Available" }
    );

    return NextResponse.json({ message: "คืนอุปกรณ์สำเร็จ" });

  } catch (error) {
    console.error("RETURN ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}