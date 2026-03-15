import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import "@/models/User";
import "@/models/Equipment";
import { NextResponse } from "next/server";

export async function GET() {

  await dbConnect();

  try {

    const borrows = await Borrow.find()
      .populate({
        path: "equipment",
        select: "name code location"
      })
      .populate({
        path: "user",
        select: "name"
      })
      .sort({ createdAt: -1 })
      .lean();


    const result = borrows.map(item => ({

      _id: item._id,

      borrowerName:
        item.user?.name ?? "-",

      equipmentName:
        item.equipment?.name ?? "-",

      equipmentCode:
        item.equipment?.code ?? "-",

      location:
        item.location ??
        item.equipment?.location ??
        "-",

      status:
        item.status ?? "pending",

      borrowDate:
        item.createdAt

    }));


    return NextResponse.json(result);

  } catch (error) {

    console.error("BORROW LIST ERROR:", error);

    return NextResponse.json(
      { message: "โหลดข้อมูลล้มเหลว" },
      { status: 500 }
    );

  }

}