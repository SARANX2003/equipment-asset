import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import "@/models/User";        // 🔥 บังคับโหลด model
import "@/models/Equipment";   // 🔥 บังคับโหลด model
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const borrows = await Borrow.find()
      .populate("equipment")
      .populate("user")
      .sort({ createdAt: -1 });

    return NextResponse.json(borrows);
  } catch (error) {
    console.error("BORROW LIST ERROR:", error);
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    );
  }
}