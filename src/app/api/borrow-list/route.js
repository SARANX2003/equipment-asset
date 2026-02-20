import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
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
    console.error("Borrow List Error:", error);
    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}