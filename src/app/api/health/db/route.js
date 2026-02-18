import { dbConnect } from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect();
    return Response.json({
      ok: true,
      message: "MongoDB connected ✅",
    });
  } catch (err) {
    return Response.json(
      {
        ok: false,
        message: "MongoDB connection failed ❌",
        error: String(err),
      },
      { status: 500 }
    );
  }
}
