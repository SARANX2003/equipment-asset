import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context.params; 

  const body = await req.json();

  try {
    const borrow = await Borrow.findById(id);

    if (!borrow) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    }

    // =========================
    // อนุมัติ
    // =========================
    if (body.status === "approved") {
      borrow.status = "approved";

      await Equipment.findByIdAndUpdate(
        borrow.equipment,
        { status: "Unavailable" }
      );
    }

    // =========================
    // คืนอุปกรณ์
    // =========================
    if (body.status === "returned") {
      borrow.status = "returned";

      await Equipment.findByIdAndUpdate(
        borrow.equipment,
        { status: "Available" } // ✅ สำคัญมาก
      );
    }

    // =========================
    // ไม่อนุมัติ
    // =========================
    if (body.status === "rejected") {
      borrow.status = "rejected";
    }

    await borrow.save();

    return NextResponse.json({ message: "อัปเดตสำเร็จ" });

  } catch (error) {
    console.error("BORROW UPDATE ERROR:", error);

    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
