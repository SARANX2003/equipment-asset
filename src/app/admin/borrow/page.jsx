"use client";

import { useEffect, useState } from "react";
import { toast, confirmDialog } from "@/lib/alert";

export default function AdminBorrowPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = async () => {
    try {
      const res = await fetch("/api/borrow-list");
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setBorrows(data);
    } catch (err) {
      toast("error", err.message || "โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    const result = await confirmDialog("ต้องการอนุมัติคำขอนี้?");
    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/borrow/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast("success", "อนุมัติสำเร็จ");
      fetchBorrows();
    } catch (err) {
      toast("error", err.message);
    }
  };

  const reject = async (id) => {
    const result = await confirmDialog("ต้องการปฏิเสธคำขอนี้?");
    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/borrow/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast("success", "ปฏิเสธเรียบร้อย");
      fetchBorrows();
    } catch (err) {
      toast("error", err.message);
    }
  };

  const returnItem = async (id) => {
    const result = await confirmDialog("ยืนยันการคืนอุปกรณ์?");
    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/borrow/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast("success", "คืนอุปกรณ์เรียบร้อย");
      fetchBorrows();
    } catch (err) {
      toast("error", err.message);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-green-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">📋 จัดการคำขอยืม</h1>

      {borrows.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-lg rounded-xl p-5 mb-4 border"
        >
          <p><b>อุปกรณ์:</b> {item.equipment?.name}</p>
          <p><b>ผู้ยืม:</b> {item.user?.name}</p>
          <p><b>ใช้ที่:</b> {item.location}</p>

          <StatusBadge status={item.status} />

          <div className="mt-3 flex gap-3 flex-wrap">
            {item.status === "pending" && (
              <>
                <button
                  onClick={() => approve(item._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  อนุมัติ
                </button>

                <button
                  onClick={() => reject(item._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                >
                  ปฏิเสธ
                </button>
              </>
            )}

            {item.status === "approved" && (
              <button
                onClick={() => returnItem(item._id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                คืนอุปกรณ์
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-yellow-200 text-yellow-800",
    approved: "bg-green-200 text-green-800",
    rejected: "bg-red-200 text-red-800",
    returned: "bg-gray-200 text-gray-800",
  };

  return (
    <span
      className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}