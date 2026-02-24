export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import "@/models/Equipment";
import "@/models/User";
import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const borrows = await Borrow.find()
    .populate("equipment")
    .populate("user", "name email");

  const rows = [];

  // =====================
  // 📌 หัวรายงาน
  // =====================
  rows.push(["รายงานการยืมอุปกรณ์"]);
  rows.push(["คณะวิทยาศาสตร์"]);
  rows.push([`วันที่ออกรายงาน: ${new Date().toLocaleDateString("th-TH")}`]);
  rows.push([]);

  // =====================
  // 📊 Header Table
  // =====================
  rows.push([
    "ลำดับ",
    "ชื่ออุปกรณ์",
    "ผู้ยืม",
    "อีเมล",
    "สถานะ",
    "สถานที่ใช้งาน",
    "วันที่",
    "เวลา",
  ]);

  borrows.forEach((b, index) => {
    const dateObj = new Date(b.createdAt);

    rows.push([
      index + 1,
      b.equipment?.name || "-",
      b.user?.name || "-",
      b.user?.email || "-",
      b.status,
      b.location || "-",
      dateObj.toLocaleDateString("th-TH"),
      dateObj.toLocaleTimeString("th-TH"),
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // =====================
  // 📏 Column Width
  // =====================
  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 20 },
    { wch: 28 },
    { wch: 14 },
    { wch: 25 },
    { wch: 14 },
    { wch: 12 },
  ];

  // =====================
  // 📌 Merge หัวรายงาน
  // =====================
  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "รายงานการยืม");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": "attachment; filename=borrow-report.xlsx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}