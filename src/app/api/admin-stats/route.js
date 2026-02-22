import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const totalEquipment = await Equipment.countDocuments();
  const borrowed = await Borrow.countDocuments({ status: "approved" });
  const pending = await Borrow.countDocuments({ status: "pending" });
  const returned = await Borrow.countDocuments({ status: "returned" });

  return NextResponse.json({
    totalEquipment,
    borrowed,
    pending,
    returned,
  });
}