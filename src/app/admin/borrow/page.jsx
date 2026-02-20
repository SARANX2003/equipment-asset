"use client";

import { useEffect, useState } from "react";

export default function AdminBorrowPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = async () => {
    try {
      const res = await fetch("/api/borrow-list");
      const data = await res.json();
      setBorrows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ERROR:", err);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const approve = async (id) => {
    await fetch(`/api/borrow/approve/${id}`, {
      method: "POST",
    });
    fetchBorrows();
  };

  const reject = async (id) => {
    await fetch(`/api/borrow/reject/${id}`, {
      method: "POST",
    });
    fetchBorrows();
  };

  const returnItem = async (id) => {
    await fetch(`/api/borrow/return/${id}`, {
      method: "POST",
    });
    fetchBorrows();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">จัดการคำขอยืม</h1>

      {borrows.length === 0 && (
        <p className="text-gray-500">ยังไม่มีคำขอยืม</p>
      )}

      {borrows.map((item) => (
        <div
          key={item._id}
          className="border rounded-lg p-4 mb-4 bg-white shadow"
        >
          <p><strong>อุปกรณ์:</strong> {item.equipment?.name}</p>
          <p><strong>ผู้ยืม:</strong> {item.user?.username}</p>
          <p><strong>สถานะ:</strong> {item.status}</p>

          {/* pending */}
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

          {/* approved */}
          {item.status === "approved" && (
            <div className="mt-3">
              <button
                onClick={() => returnItem(item._id)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                คืนอุปกรณ์
              </button>
            </div>
          )}

          {/* rejected */}
          {item.status === "rejected" && (
            <p className="text-red-600 mt-2">คำขอนี้ถูกปฏิเสธ</p>
          )}

          {/* returned */}
          {item.status === "returned" && (
            <p className="text-green-600 mt-2">คืนอุปกรณ์แล้ว</p>
          )}
        </div>
      ))}
    </div>
  );
}