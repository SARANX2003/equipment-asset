"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function EquipmentDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    if (!id) return;

    try {
      const res = await fetch(`/api/equipment/${id}`);
      const data = await res.json();

      setEquipment(data);
      setLoading(false);
    } catch (error) {
      console.error("FETCH ERROR:", error);
      setLoading(false);
    }
  };

  const borrowEquipment = async () => {
    if (!id) return;

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนยืม");
      return;
    }

    try {
      const res = await fetch("/api/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          equipmentId: id,
          userId: user._id,
          location: equipment.location,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("ส่งคำขอยืมสำเร็จ รอการอนุมัติ");
      } else {
        alert(data.message || "เกิดข้อผิดพลาด");
      }

    } catch (error) {
      console.error("BORROW ERROR:", error);
      alert("เกิดข้อผิดพลาดในระบบ");
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!equipment) return <p className="text-center mt-10">ไม่พบข้อมูล</p>;

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

      {equipment.qrCode && (
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">
            QR Code ครุภัณฑ์
          </h2>
          <img
            src={equipment.qrCode}
            alt="QR Code"
            className="mx-auto w-48"
          />
        </div>
      )}
    </div>
  );
}