"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูลอุปกรณ์
  const fetchEquipment = async () => {
    const res = await fetch(`/api/equipment/${id}`);
    const data = await res.json();
    setEquipment(data);
    setLoading(false);
  };

  // =========================
  // ยืมอุปกรณ์ (ใช้ API เดิมของคุณ)
  // =========================
  const handleBorrow = async () => {
    const res = await fetch("/api/borrow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        equipmentId: id,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("ยืมอุปกรณ์สำเร็จ");
      fetchEquipment();
    } else {
      alert(data.message || "เกิดข้อผิดพลาด");
    }
  };

  // =========================
  // คืนอุปกรณ์
  // =========================
  const handleReturn = async () => {
    const res = await fetch(`/api/borrow/${id}/return`, {
      method: "PUT",
    });

    const data = await res.json();

    if (res.ok) {
      alert("คืนอุปกรณ์สำเร็จ");
      fetchEquipment();
    } else {
      alert(data.message || "เกิดข้อผิดพลาด");
    }
  };

  useEffect(() => {
    if (id) fetchEquipment();
  }, [id]);

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (!equipment) return <p className="text-center p-6">ไม่พบข้อมูล</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-xl space-y-4">

        <h1 className="text-2xl font-bold">{equipment.name}</h1>

        <p><strong>รหัส:</strong> {equipment.code}</p>
        <p><strong>หมวดหมู่:</strong> {equipment.category}</p>
        <p>
          <strong>สถานะ:</strong>{" "}
          <span className={
            equipment.status === "Available"
              ? "text-green-600 font-semibold"
              : "text-red-600 font-semibold"
          }>
            {equipment.status}
          </span>
        </p>
        <p><strong>ที่ตั้ง:</strong> {equipment.location}</p>

        {/* ========================= */}
        {/* ปุ่มควบคุมสถานะ */}
        {/* ========================= */}

        {equipment.status === "Available" && (
          <button
            onClick={handleBorrow}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            ยืมอุปกรณ์
          </button>
        )}

        {equipment.status === "Borrowed" && (
          <button
            onClick={handleReturn}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            คืนอุปกรณ์
          </button>
        )}

      </div>
    </div>
  );
}
