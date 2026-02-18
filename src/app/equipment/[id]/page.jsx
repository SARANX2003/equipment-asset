"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    const res = await fetch(`/api/equipment/${id}`);
    const data = await res.json();
    setEquipment(data);
    setLoading(false);
  };

  const borrowEquipment = async () => {
    const res = await fetch(`/api/borrow/${id}`, {
      method: "POST",
    });

    if (res.ok) {
      alert("ยืมอุปกรณ์สำเร็จ");
      fetchEquipment();
    } else {
      alert("เกิดข้อผิดพลาด");
    }
  };

  useEffect(() => {
    if (id) fetchEquipment();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!equipment) return <p>ไม่พบข้อมูล</p>;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="bg-white shadow rounded-xl p-6 space-y-3">
        <h1 className="text-2xl font-bold">{equipment.name}</h1>
        <p><strong>รหัส:</strong> {equipment.code}</p>
        <p><strong>หมวดหมู่:</strong> {equipment.category}</p>
        <p><strong>สถานะ:</strong> {equipment.status}</p>
        <p><strong>ที่ตั้ง:</strong> {equipment.location}</p>

        {equipment.status === "Available" && (
          <button
            onClick={borrowEquipment}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            ยืมอุปกรณ์
          </button>
        )}

        {equipment.status === "Borrowed" && (
          <div className="text-red-600 font-semibold">
            อุปกรณ์ถูกยืมแล้ว
          </div>
        )}
      </div>
    </div>
  );
}
