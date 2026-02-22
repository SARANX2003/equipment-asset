"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast, confirmDialog } from "@/lib/alert";

export default function BorrowPage() {
  const { id } = useParams();
  const router = useRouter();

  const [equipment, setEquipment] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // โหลดข้อมูลอุปกรณ์
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`/api/equipment/${id}`);
        if (!res.ok) throw new Error("ไม่พบข้อมูล");

        const data = await res.json();
        setEquipment(data);
      } catch (err) {
        toast("error", "โหลดข้อมูลล้มเหลว");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEquipment();
  }, [id]);

  // กดยืนยันขอยืม
  const handleBorrow = async () => {
    if (!location.trim()) {
      toast("warning", "กรุณากรอกสถานที่ใช้งาน");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      toast("warning", "กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
      return;
    }

    const confirm = await confirmDialog("ต้องการส่งคำขอยืมหรือไม่?");
    if (!confirm.isConfirmed) return;

    try {
      setSubmitting(true);

      const res = await fetch("/api/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipmentId: id,
          userId: user._id,
          location,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาด");
      }

      toast("success", "ส่งคำขอยืมเรียบร้อย รอการอนุมัติ");
      router.push("/dashboard");

    } catch (err) {
      toast("error", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
      </div>
    );

  if (!equipment)
    return (
      <div className="p-6 text-center text-red-600">
        ไม่พบข้อมูลอุปกรณ์
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6">

        <h1 className="text-2xl font-bold text-green-700 text-center">
          📦 ยืม: {equipment.name}
        </h1>

        <div className="bg-gray-50 p-4 rounded-xl border space-y-2">
          <p><b>รหัส:</b> {equipment.code}</p>
          <p><b>สถานะ:</b> 
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              equipment.status === "Available"
                ? "bg-green-200 text-green-800"
                : "bg-red-200 text-red-800"
            }`}>
              {equipment.status}
            </span>
          </p>
          <p><b>ที่ตั้ง:</b> {equipment.location}</p>
        </div>

        <div>
          <label className="block font-medium mb-2">
            จะนำไปใช้ที่ไหน
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-400 outline-none"
            placeholder="เช่น ห้องประชุม A"
          />
        </div>

        <button
          onClick={handleBorrow}
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition disabled:opacity-50"
        >
          {submitting ? "กำลังส่งคำขอ..." : "ยืนยันขอยืม"}
        </button>

      </div>
    </div>
  );
}