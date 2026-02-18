import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  await dbConnect();

  const borrow = await Borrow.findById(params.id);

  if (!borrow) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  borrow.status = "returned";
  borrow.returnedAt = new Date();

  await Equipment.findByIdAndUpdate(borrow.equipment, {
    status: "Available",
  });

  await borrow.save();

  return NextResponse.json(borrow);
}
