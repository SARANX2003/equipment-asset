import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    await dbConnect();

    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID ไม่ถูกต้อง" },
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

    borrow.status = "rejected";
    await borrow.save();

    return NextResponse.json({ message: "ปฏิเสธสำเร็จ" });

  } catch (error) {
    console.error("REJECT ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}