import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context.params;

  try {
    const borrow = await Borrow.findById(id);

    if (!borrow) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูล" },
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
    return NextResponse.json(
      { message: "คืนไม่สำเร็จ" },
      { status: 500 }
    );
  }
}
