"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/lib/alert";

export default function EquipmentDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("");
  const [submitting, setSubmitting] = useState(false);

 useEffect(() => {
  const user = localStorage.getItem("user");

  if (!user) {
    router.push(`/login?redirect=/equipment/${id}`);
  }
}, [id]);

  // โหลดข้อมูลอุปกรณ์
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`/api/equipment/${id}`);
        if (!res.ok) throw new Error("ไม่พบข้อมูล");
        const data = await res.json();
        setEquipment(data);
      } catch (err) {
        toast("error", "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEquipment();
  }, [id]);

  const handleBorrow = async () => {
    if (!location.trim()) {
      toast("warning", "กรุณากรอกสถานที่ใช้งาน");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    try {
      setSubmitting(true);

      const res = await fetch("/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: id,
          userId: user._id,
          location,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast("success", "ส่งคำขอยืมแล้ว รอการอนุมัติ");
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
    return <p className="text-center mt-10">ไม่พบข้อมูล</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">

        {/* Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 border">

          <h1 className="text-2xl font-bold text-green-700 mb-4">
            📦 {equipment.name}
          </h1>

          <div className="space-y-2 text-gray-700">
            <p><b>รหัส:</b> {equipment.code}</p>
            <p><b>หมวดหมู่:</b> {equipment.category}</p>
            <p>
              <b>สถานะ:</b>{" "}
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                equipment.status === "Available"
                  ? "bg-green-200 text-green-800"
                  : "bg-red-200 text-red-800"
              }`}>
                {equipment.status}
              </span>
            </p>
            <p><b>ที่ตั้ง:</b> {equipment.location}</p>
          </div>

          {/* ช่องกรอกสถานที่ */}
          {equipment.status === "Available" && (
            <div className="mt-6 space-y-3">

              <div>
                <label className="block font-medium mb-1">
                  จะนำไปใช้ที่ไหน
                </label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
                  placeholder="เช่น ห้องประชุม A"
                />
              </div>

              <button
                onClick={handleBorrow}
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition font-semibold"
              >
                {submitting ? "กำลังส่ง..." : "ยืนยันขอยืม"}
              </button>

            </div>
          )}

          {equipment.status === "Borrowed" && (
            <div className="mt-4 text-red-600 font-semibold">
              อุปกรณ์ถูกยืมแล้ว
            </div>
          )}
        </div>

        {/* QR */}
        {equipment.qrCode && (
          <div className="bg-white shadow-xl rounded-2xl p-6 border text-center">
            <h2 className="text-lg font-semibold mb-4">
              QR Code ครุภัณฑ์
            </h2>
            <img
              src={equipment.qrCode}
              alt="QR Code"
              className="mx-auto w-52"
            />
          </div>
        )}

      </div>
    </div>
  );
}