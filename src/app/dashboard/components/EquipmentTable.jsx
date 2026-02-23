"use client";

import Link from "next/link";

export default function EquipmentTable({ items, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-xs">
            <th className="px-4 py-3">ชื่อ</th>
            <th className="px-4 py-3">รหัส</th>
            <th className="px-4 py-3">หมวดหมู่</th>
            <th className="px-4 py-3">สถานะ</th>
            <th className="px-4 py-3">ที่ตั้ง</th>
            <th className="px-4 py-3 text-center">จัดการ</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item._id}
              className="border-b hover:bg-green-50 transition duration-150"
            >
              {/* ✅ ชื่อคลิกได้เหมือนเดิม */}
              <td className="px-4 py-3 font-medium">
                <Link
                  href={`/equipment/${item._id}`}
                  className="text-blue-600 hover:underline hover:text-blue-800 transition"
                >
                  {item.name}
                </Link>
              </td>

              <td className="px-4 py-3">{item.code}</td>
              <td className="px-4 py-3">{item.category}</td>

              <td className="px-4 py-3">
                <StatusBadge status={item.status} />
              </td>

              <td className="px-4 py-3">{item.location}</td>

              <td className="px-4 py-3 text-center space-x-3">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600 hover:underline"
                >
                  แก้ไข
                </button>

                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-600 hover:underline"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Available: "bg-green-100 text-green-700",
    Borrowed: "bg-red-100 text-red-700",
    Repair: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}