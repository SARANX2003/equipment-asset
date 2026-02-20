import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const borrows = await Borrow.find()
      .populate({
        path: "equipment",
        model: Equipment,
      })
      .populate({
        path: "user",
        model: User,
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(borrows);

  } catch (error) {
    console.error("🔥 BORROW LIST ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}