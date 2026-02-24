import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function POST() {
  await dbConnect();

  try {
    // ลบเฉพาะ returned และ rejected
    const oldBorrows = await Borrow.find({
      status: { $in: ["returned", "rejected"] }
    });

    await Borrow.deleteMany({
      status: { $in: ["returned", "rejected"] }
    });

    return NextResponse.json(
      { message: `ลบ ${oldBorrows.length} รายการเรียบร้อย` },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}