import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
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