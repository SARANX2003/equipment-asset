"use client";

import { useEffect, useState } from "react";

export default function AdminBorrowPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

const fetchBorrows = async () => {
  try {
    const res = await fetch("/api/borrow-list");

    if (!res.ok) {
      throw new Error("โหลดข้อมูลล้มเหลว");
    }

    const data = await res.json();
    setBorrows(data);

  } catch (error) {
    console.error("FETCH ERROR:", error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchBorrows();
  }, []);

  const approve = async (id) => {
    await fetch("/api/borrow/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchBorrows();
  };

  const reject = async (id) => {
    await fetch("/api/borrow/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchBorrows();
  };

  const returnItem = async (id) => {
    await fetch("/api/borrow/return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchBorrows();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">จัดการคำขอยืม</h1>

      {borrows.map((item) => (
        <div key={item._id} className="bg-white shadow p-4 mb-4 rounded">
          <p><b>อุปกรณ์:</b> {item.equipment?.name}</p>
          <p><b>ผู้ยืม:</b> {item.user?.username}</p>
          <p><b>สถานะ:</b> {item.status}</p>

          {item.status === "pending" && (
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => approve(item._id)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                อนุมัติ
              </button>

              <button
                onClick={() => reject(item._id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                ปฏิเสธ
              </button>
            </div>
          )}

          {item.status === "approved" && (
            <button
              onClick={() => returnItem(item._id)}
              className="bg-blue-600 text-white px-3 py-1 rounded mt-3"
            >
              คืนอุปกรณ์
            </button>
          )}
        </div>
      ))}
    </div>
  );
}