import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const count = await Borrow.countDocuments({ status: "pending" });

  return NextResponse.json({ count });
}