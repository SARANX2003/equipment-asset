import dbConnect from "@/lib/mongodb";
import Borrow from "@/models/Borrow";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  let dateFilter = {};

  // =========================
  // เลือกช่วงวันที่
  // =========================
  if (from && to) {
    dateFilter.createdAt = {
      $gte: new Date(from),
      $lte: new Date(to),
    };
  }

  // =========================
  // เลือกเดือน + ปี
  // =========================
  if (month && year) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    dateFilter.createdAt = {
      $gte: start,
      $lte: end,
    };
  }

  // =========================
  // ดึงอุปกรณ์ทั้งหมด
  // =========================
  const equipments = await Equipment.find();

  // =========================
  // นับการยืม
  // =========================
  const borrows = await Borrow.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: "$equipment",
        total: { $sum: 1 },
      },
    },
  ]);

  // แปลงเป็น Map
  const borrowMap = {};
  borrows.forEach((b) => {
    borrowMap[b._id.toString()] = b.total;
  });

  // =========================
  // ส่งข้อมูลครบทุกอุปกรณ์
  // =========================
  const result = equipments.map((eq) => ({
    label: eq.name,
    total: borrowMap[eq._id.toString()] || 0,
  }));

  return NextResponse.json(result);
}