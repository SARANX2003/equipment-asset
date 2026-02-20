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
      setBorrows(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("FETCH ERROR:", error);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    try {
      const res = await fetch(`/api/borrow/approve/${id}`, {
        method: "POST",
      });

      const data = await res.json();
      console.log("APPROVE RESULT:", data);

      if (!res.ok) {
        alert(data.message || "อนุมัติไม่สำเร็จ");
        return;
      }

      alert("อนุมัติสำเร็จ");
      await fetchBorrows();

    } catch (error) {
      console.error("APPROVE ERROR:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const reject = async (id) => {
    try {
      const res = await fetch(`/api/borrow/reject/${id}`, {
        method: "POST",
      });

      const data = await res.json();
      console.log("REJECT RESULT:", data);

      if (!res.ok) {
        alert(data.message || "ปฏิเสธไม่สำเร็จ");
        return;
      }

      alert("ปฏิเสธสำเร็จ");
      await fetchBorrows();

    } catch (error) {
      console.error("REJECT ERROR:", error);
      alert("เกิดข้อผิดพลาด");
    }
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
          <p><b>สถานะ:</b> {item.status}</p>

          {item.status === "pending" && (
            <div className="mt-3 space-x-2">
              <button
                onClick={() => approve(item._id)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                อนุมัติ
              </button>

              <button
                onClick={() => reject(item._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                ปฏิเสธ
              </button>
            </div>
          )}

          {item.status === "approved" && (
            <div className="mt-3 text-green-600 font-semibold">
              ✔ อนุมัติแล้ว
            </div>
          )}

          {item.status === "rejected" && (
            <div className="mt-3 text-red-600 font-semibold">
              ✖ ถูกปฏิเสธ
            </div>
          )}

          {item.status === "returned" && (
            <div className="mt-3 text-blue-600 font-semibold">
              ↺ คืนแล้ว
            </div>
          )}
        </div>
      ))}
    </div>
  );
}