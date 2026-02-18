"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BorrowPage() {
  const { id } = useParams();
  const router = useRouter();

  const [equipment, setEquipment] = useState(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔹 โหลดข้อมูลอุปกรณ์
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`/api/equipment/${id}`);

        if (!res.ok) throw new Error("ไม่พบข้อมูล");

        const data = await res.json();
        setEquipment(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEquipment();
  }, [id]);

  // 🔹 กดขอยืม
  const handleBorrow = async () => {
    if (!location.trim()) {
      alert("กรุณากรอกสถานที่ใช้งาน");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      router.push("/login");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipmentId: id,
          userId: user._id,   // ✅ ส่ง userId ไป
          location,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "เกิดข้อผิดพลาด");
      }

      alert("ส่งคำขอยืมแล้ว รอการอนุมัติ");
      router.push("/dashboard");

    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!equipment) return <p className="p-6">ไม่พบข้อมูล</p>;

  return (
    <div className="p-8 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold text-green-700">
        ยืม: {equipment.name}
      </h1>

      <div className="border p-4 rounded bg-gray-50">
        <p><b>รหัส:</b> {equipment.code}</p>
        <p><b>สถานะ:</b> {equipment.status}</p>
        <p><b>ที่ตั้ง:</b> {equipment.location}</p>
      </div>

      <div className="space-y-2">
        <label className="block font-medium">จะนำไปใช้ที่ไหน</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="เช่น ห้องประชุม A"
        />
      </div>

      <button
        onClick={handleBorrow}
        disabled={submitting}
        className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {submitting ? "กำลังส่ง..." : "ยืนยันขอยืม"}
      </button>
    </div>
  );
}
