"use client";

import { useEffect, useState } from "react";

export default function AdminBorrowPage() {
  const [borrows, setBorrows] = useState([]);

  const fetchBorrows = async () => {
    const res = await fetch("/api/borrow-list");
    const data = await res.json();
    setBorrows(data);
  };

  const approve = async (id) => {
    await fetch(`/api/borrow/approve/${id}`, { method: "POST" });
    fetchBorrows();
  };

  const reject = async (id) => {
    await fetch(`/api/borrow/reject/${id}`, { method: "POST" });
    fetchBorrows();
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">จัดการคำขอยืม</h1>

      {borrows.map((item) => (
        <div key={item._id} className="bg-white p-4 shadow mb-4 rounded">
          <p><strong>อุปกรณ์:</strong> {item.equipment?.name}</p>
          <p><strong>ผู้ยืม:</strong> {item.user?.username}</p>
          <p><strong>สถานะ:</strong> {item.status}</p>

          {item.status === "pending" && (
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => approve(item._id)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                อนุมัติ
              </button>

              <button
                onClick={() => reject(item._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                ปฏิเสธ
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}