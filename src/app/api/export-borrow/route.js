export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const borrows = await Borrow.find()
    .populate("equipment")
    .populate("user");

  const data = borrows.map((b) => ({
    Equipment: b.equipment?.name,
    User: b.user?.username,
    Status: b.status,
    Date: b.createdAt,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Borrows");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": "attachment; filename=borrow-report.xlsx",
    },
  });
}