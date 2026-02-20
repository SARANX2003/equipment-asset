import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  await dbConnect();

  const { id } = params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: "ID ไม่ถูกต้อง" }, { status: 400 });
  }

  const borrow = await Borrow.findById(id).populate("equipment");

  if (!borrow) {
    return NextResponse.json({ message: "ไม่พบรายการ" }, { status: 404 });
  }

  borrow.status = "returned";
  await borrow.save();

  const equipment = await Equipment.findById(borrow.equipment._id);
  equipment.status = "Available";
  await equipment.save();

  return NextResponse.json({ message: "คืนสำเร็จ" });
}