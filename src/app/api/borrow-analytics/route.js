import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import { NextResponse } from "next/server";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "month";
  const equipmentId = searchParams.get("equipment");

  let match = {};
  if (equipmentId && equipmentId !== "all") {
    match.equipment = equipmentId;
  }

  const borrows = await Borrow.find(match);

  const grouped = {};

  borrows.forEach((b) => {
    const date = new Date(b.createdAt);
    let key;

    if (type === "day") {
      key = date.toISOString().split("T")[0];
    } else if (type === "year") {
      key = date.getFullYear().toString();
    } else {
      key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    }

    grouped[key] = (grouped[key] || 0) + 1;
  });

  const result = Object.keys(grouped).map((k) => ({
    label: k,
    total: grouped[k],
  }));

  return NextResponse.json(result);
}