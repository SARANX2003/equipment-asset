import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import "@/models/User";
import "@/models/Equipment";
import { NextResponse } from "next/server";

export async function GET() {

  await dbConnect();

  const borrows = await Borrow.find()
    .populate("equipment")
    .populate("user")
    .sort({ createdAt: -1 });

  const result = borrows.map(item => ({
    _id: item._id,
    borrowerName: item.user?.name || "-",
    equipmentName: item.equipment?.name || "-",
    equipmentCode: item.equipment?.code || "-",
    location: item.location || item.equipment?.location || "-",
    status: item.status,
    borrowDate: item.createdAt
  }));

  return NextResponse.json(result);
}