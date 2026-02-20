import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const id = params.id;

    const borrow = await Borrow.findById(id);

    if (!borrow) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูลคำขอยืม" },
        { status: 404 }
      );
    }

    borrow.status = "approved";
    await borrow.save();

    await Equipment.findByIdAndUpdate(
      borrow.equipment,
      { status: "Borrowed" }
    );

    return NextResponse.json({ message: "อนุมัติสำเร็จ" });

  } catch (error) {
    console.error("APPROVE ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}