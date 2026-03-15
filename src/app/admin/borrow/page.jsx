"use client";

import { useEffect, useState } from "react";
import { toast, confirmDialog } from "@/lib/alert";

export default function AdminBorrowPage() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

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

  // ===========================
  // ลบรายการเดียว
  // ===========================
  const deleteBorrow = async (id) => {
    const result = await confirmDialog("ต้องการลบรายการนี้หรือไม่?");
    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/borrow/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast("success", "ลบสำเร็จ");
      fetchBorrows();
    } catch (err) {
      toast("error", err.message);
    }
  };

  // ===========================
  // ลบหลายรายการ
  // ===========================
  const deleteMany = async () => {
    if (selectedIds.length === 0) {
      toast("error", "ยังไม่ได้เลือกรายการ");
      return;
    }

    const result = await confirmDialog(
      `ต้องการลบ ${selectedIds.length} รายการหรือไม่?`
    );
    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/borrow/delete-many", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast("success", data.message);
      setSelectedIds([]);
      fetchBorrows();
    } catch (err) {
      toast("error", err.message);
    }
  };

  // ===========================
  // ล้างข้อมูลเก่า
  // ===========================
  const cleanOld = async () => {
    const result = await confirmDialog(
      "ต้องการล้าง returned และ rejected ทั้งหมด?"
    );
    if (!result.isConfirmed) return;

    try {
      const res = await fetch("/api/borrow/clean-old", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast("success", data.message);
      fetchBorrows();
    } catch (err) {
      toast("error", err.message);
    }
  };

  // ===========================
  // อนุมัติ
  // ===========================
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

  // ===========================
  // ปฏิเสธ
  // ===========================
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

  // ===========================
  // คืนอุปกรณ์
  // ===========================
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
      <h1 className="text-3xl font-bold mb-4">📋 จัดการคำขอยืม</h1>

      {/* ปุ่มด้านบน */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={deleteMany}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
        >
          🗑 ลบที่เลือก
        </button>

        <button
          onClick={cleanOld}
          className="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded-lg"
        >
          🧹 ล้างข้อมูลเก่า
        </button>
      </div>

      {borrows.map((item) => (
        <div
          key={item._id}
          className="bg-white shadow-lg rounded-xl p-5 mb-4 border hover:shadow-xl transition"
        >
          <div className="flex justify-between items-start">
            <div>
              <p><b>อุปกรณ์:</b> {item.equipmentName}</p>
              <p><b>ผู้ยืม:</b> {item.borrowerName}</p>
              <p><b>ใช้ที่:</b> {item.location}</p>
              <StatusBadge status={item.status} />
            </div>

            {/* Checkbox */}
            <input
              type="checkbox"
              checked={selectedIds.includes(item._id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIds([...selectedIds, item._id]);
                } else {
                  setSelectedIds(
                    selectedIds.filter((id) => id !== item._id)
                  );
                }
              }}
              className="w-5 h-5"
            />
          </div>

          <div className="mt-4 flex gap-3 flex-wrap">
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

            <button
              onClick={() => deleteBorrow(item._id)}
              className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-lg"
            >
              🗑 ลบ
            </button>
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