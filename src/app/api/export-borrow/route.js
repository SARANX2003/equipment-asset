export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import XLSX from "xlsx-style";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const borrows = await Borrow.find()
    .populate("equipment")
    .populate("user", "name email");

  const data = borrows.map((b, index) => {
    const dateObj = new Date(b.createdAt);

    return {
      ลำดับ: index + 1,
      ชื่ออุปกรณ์: b.equipment?.name || "-",
      ผู้ยืม: b.user?.name || "-",
      อีเมล: b.user?.email || "-",
      สถานะ: b.status,
      สถานที่ใช้งาน: b.location || "-",
      วันที่: dateObj.toLocaleDateString("th-TH"),
      เวลา: dateObj.toLocaleTimeString("th-TH"),
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);

  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        fill: {
          fgColor: { rgb: "16A34A" }, // สีเขียว
        },
        font: {
          bold: true,
          color: { rgb: "FFFFFF" },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
      };
    }
  }

  worksheet["!cols"] = [
    { wch: 6 },   // ลำดับ
    { wch: 20 },  // ชื่ออุปกรณ์
    { wch: 20 },  // ผู้ยืม
    { wch: 25 },  // อีเมล
    { wch: 15 },  // สถานะ
    { wch: 25 },  // สถานที่
    { wch: 15 },  // วันที่
    { wch: 12 },  // เวลา
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "รายงานการยืมอุปกรณ์");

  const buffer = XLSX.write(workbook, {
    type: "buffer",
    bookType: "xlsx",
  });

  return new NextResponse(buffer, {
    headers: {
      "Content-Disposition": "attachment; filename=borrow-report-pro.xlsx",
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}