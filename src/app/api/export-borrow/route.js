export const runtime = "nodejs";

import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import "@/models/Equipment";
import "@/models/User";
import * as XLSX from "xlsx";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const month = searchParams.get("month");
    const year = searchParams.get("year");

    let filter = {};

    // =========================
    // 📅 Filter ตามประเภท
    // =========================

    if (type === "range" && start && end) {
      filter.createdAt = {
        $gte: new Date(start),
        $lte: new Date(end + "T23:59:59"),
      };
    }

    if (type === "month" && month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (type === "year" && year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);

      filter.createdAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const borrows = await Borrow.find(filter)
      .populate("equipment")
      .populate("user");

    // =========================
    // 📊 Build Report
    // =========================

    const rows = [];

    rows.push(["รายงานการยืมอุปกรณ์"]);
    rows.push(["คณะวิทยาศาสตร์"]);
    rows.push([
      `วันที่ออกรายงาน: ${new Date().toLocaleDateString("th-TH")}`,
    ]);
    rows.push([]);

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
        b.equipment?.name ?? "-",
        b.user?.name ?? "-",
        b.user?.email ?? "-",
        b.status ?? "-",
        b.location ?? "-",
        dateObj.toLocaleDateString("th-TH"),
        dateObj.toLocaleTimeString("th-TH"),
      ]);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);

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

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "รายงานการยืม");

    const buffer = XLSX.write(workbook, {
      type: "buffer",
      bookType: "xlsx",
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Disposition":
          "attachment; filename=borrow-report.xlsx",
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("EXPORT ERROR:", error);

    return NextResponse.json(
      { message: "Export failed", error: error.message },
      { status: 500 }
    );
  }
}