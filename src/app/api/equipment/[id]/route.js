import dbConnect from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

/* =========================
   GET - ดูข้อมูล 1 รายการ
========================= */
export async function GET(req, context) {
  await dbConnect();

  const { id } = await context.params; // ✅ ต้อง await

  try {
    const item = await Equipment.findById(id);

    if (!item) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}


/* =========================
   PUT - แก้ไขข้อมูล
========================= */
export async function PUT(req, context) {
  await dbConnect();

  const { id } = await context.params; // ✅ ต้อง await
  const body = await req.json();

  try {
    const updated = await Equipment.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}


/* =========================
   DELETE - ลบข้อมูล
========================= */
export async function DELETE(req, context) {
  await dbConnect();

  const { id } = await context.params; // ✅ ต้อง await

  try {
    const deleted = await Equipment.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "ไม่พบข้อมูล" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "ลบสำเร็จ" });
  } catch (error) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาด" },
      { status: 500 }
    );
  }
}
