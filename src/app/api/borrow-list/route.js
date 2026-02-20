import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // 🔥 เอา populate ออกก่อนเพื่อ debug
    const borrows = await Borrow.find().sort({ createdAt: -1 });

    return NextResponse.json(borrows);

  } catch (error) {
    console.error("Borrow List Error:", error);

    return NextResponse.json(
      { message: error.message },   // 👈 แสดง error จริงออกมา
      { status: 500 }
    );
  }
}