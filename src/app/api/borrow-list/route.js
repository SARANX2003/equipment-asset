import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const borrows = await Borrow.find()
    .populate("equipment")
    .populate("user")
    .sort({ createdAt: -1 });

  return NextResponse.json(borrows);
}