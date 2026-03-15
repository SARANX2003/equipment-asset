import dbConnect from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";

export async function GET() {

  await dbConnect();

  const equipments = await Equipment.find().sort({ createdAt:-1 });

  let csv =
    "ชื่อ,รหัส,หมวดหมู่,สถานะ,ที่ตั้ง\n";

  equipments.forEach(item => {

    csv += `"${item.name}","${item.code}","${item.category}","${item.status}","${item.location}"\n`

  })

  return new Response(csv,{
    headers:{
      "Content-Type":"text/csv",
      "Content-Disposition":"attachment; filename=equipment.csv"
    }
  })

}