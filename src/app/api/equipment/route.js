import dbConnect from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";
import QRCode from "qrcode";


// ===============================
// GET: ดึงข้อมูลครุภัณฑ์ (รองรับ Pagination + Summary)
// ===============================
export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 10;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";

    const query = {};

    // 🔎 ค้นหาชื่อ
    if (search) {
  query.$or = [
    { name: { $regex: search, $options: "i" } },
    { code: { $regex: search, $options: "i" } },
  ];
}

    // 📌 กรองสถานะ
    if (status !== "all") {
      query.status = status;
    }

    // 🔢 นับจำนวนทั้งหมด (ตาม filter ปัจจุบัน)
    const totalItems = await Equipment.countDocuments(query);

    // 🔢 นับแยกสถานะ (เพื่อ Summary)
    const available = await Equipment.countDocuments({
      ...query,
      status: "Available",
    });

    const borrowed = await Equipment.countDocuments({
      ...query,
      status: "Borrowed",
    });

    // 📦 ดึงข้อมูลเฉพาะหน้านั้น
    const data = await Equipment.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      data,
      totalItems, // ✅ สำคัญมาก
      totalPages: Math.ceil(totalItems / limit),
      available,
      borrowed,
    });

  } catch (error) {
    console.error("GET EQUIPMENT ERROR:", error);

    return NextResponse.json(
      { message: "Fetch equipment failed" },
      { status: 500 }
    );
  }
}


// ===============================
// POST: เพิ่มครุภัณฑ์ + สร้าง QR
// ===============================
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_BASE_URL is not defined" },
        { status: 500 }
      );
    }

    // 1️⃣ สร้างอุปกรณ์ก่อน
    const newEquipment = await Equipment.create(body);

    // 2️⃣ สร้าง URL สำหรับ QR
    const qrUrl = `${baseUrl}/equipment/${newEquipment._id}`;

    // 3️⃣ สร้าง QR Code
    const qrImage = await QRCode.toDataURL(qrUrl, {
      width: 400,
      margin: 2,
    });

    // 4️⃣ บันทึก QR ลง DB
    newEquipment.qrCode = qrImage;
    await newEquipment.save();

    return NextResponse.json(newEquipment);

  } catch (error) {
    console.error("CREATE EQUIPMENT ERROR:", error);

    return NextResponse.json(
      { message: "Create equipment failed" },
      { status: 500 }
    );
  }
}