import dbConnect from "@/lib/mongodb";
import Equipment from "@/models/Equipment";
import { NextResponse } from "next/server";
import QRCode from "qrcode";

export async function POST() {
  await dbConnect();

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseUrl) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_BASE_URL not defined" },
        { status: 500 }
      );
    }

    const equipments = await Equipment.find();

    let updatedCount = 0;

    for (const item of equipments) {
      const qrUrl = `${baseUrl}/equipment/${item._id}`;

      const qrImage = await QRCode.toDataURL(qrUrl, {
        width: 400,
        margin: 2,
      });

      item.qrCode = qrImage;
      await item.save();

      updatedCount++;
    }

    return NextResponse.json({
      message: "QR regenerated successfully",
      totalUpdated: updatedCount,
    });

  } catch (error) {
    console.error("REGENERATE ERROR:", error);

    return NextResponse.json(
      { message: "Regenerate failed" },
      { status: 500 }
    );
  }
}
