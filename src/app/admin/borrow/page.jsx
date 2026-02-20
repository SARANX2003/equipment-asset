"use client";

import { useEffect, useState } from "react";

export default function AdminBorrowPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = async () => {
    try {
      console.log("🔵 Fetching borrow list...");

      const res = await fetch("/api/borrow-list");

      console.log("🟡 Response Status:", res.status);

      const data = await res.json();
      console.log("🟢 Response Data:", data);

      if (!res.ok) {
        throw new Error("โหลดข้อมูลล้มเหลว");
      }

      setBorrows(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("🔴 FETCH ERROR:", error);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

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
          <p><b>สถานะ:</b> {item.status}</p>
        </div>
      ))}
    </div>
  );
}