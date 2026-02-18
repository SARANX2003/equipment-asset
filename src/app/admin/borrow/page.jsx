"use client";

import { useEffect, useState } from "react";

export default function AdminBorrowPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = async () => {
    try {
      const res = await fetch("/api/borrow");

      if (!res.ok) {
        throw new Error("โหลดข้อมูลล้มเหลว");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setBorrows(data);
      } else {
        setBorrows([]);
      }
    } catch (err) {
      console.error(err);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    await fetch(`/api/borrow/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    fetchBorrows();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">จัดการคำขอยืม</h1>

      {borrows.length === 0 && (
        <p className="text-gray-500">ยังไม่มีคำขอยืม</p>
      )}

      {borrows.map((item) => (
        <div
          key={item._id}
          className="border rounded p-4 mb-4 bg-gray-50"
        >
          <p><b>อุปกรณ์:</b> {item.equipment?.name}</p>
          <p><b>ผู้ยืม:</b> {item.user?.username}</p>
          <p><b>สถานที่ใช้:</b> {item.location}</p>
          <p><b>สถานะ:</b> {item.status}</p>

          {/* 🔵 ถ้ายังรออนุมัติ */}
          {item.status === "pending" && (
            <div className="mt-3 space-x-2">
              <button
                onClick={() => handleUpdateStatus(item._id, "approved")}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                อนุมัติ
              </button>

              <button
                onClick={() => handleUpdateStatus(item._id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                ไม่อนุมัติ
              </button>
            </div>
          )}

          {/* 🟢 ถ้าอนุมัติแล้ว แสดงปุ่มคืน */}
          {item.status === "approved" && (
            <div className="mt-3">
              <button
                onClick={() => handleUpdateStatus(item._id, "returned")}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                คืนอุปกรณ์
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
