import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "ไม่มีรายการที่เลือก" },
        { status: 400 }
      );
    }

    const borrows = await Borrow.find({ _id: { $in: ids } });

    // 🔥 คืนสถานะอุปกรณ์ถ้าจำเป็น
    for (const borrow of borrows) {
      if (borrow.status === "approved") {
        await Equipment.findByIdAndUpdate(
          borrow.equipment,
          { status: "Available" }
        );
      }
    }

    await Borrow.deleteMany({ _id: { $in: ids } });

    return NextResponse.json(
      { message: "ลบหลายรายการสำเร็จ" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE MANY ERROR:", error);
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}