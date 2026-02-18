"use client";

import Link from "next/link";

export default function EquipmentTable({ items, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-green-100">
          <tr>
            <th className="p-3 text-left">ชื่อ</th>
            <th className="p-3">รหัส</th>
            <th className="p-3">หมวดหมู่</th>
            <th className="p-3">สถานะ</th>
            <th className="p-3">ที่ตั้ง</th>
            <th className="p-3">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-t">
              <td className="p-3 text-blue-600 underline">
                <Link href={`/equipment/${item._id}`}>
                  {item.name}
                </Link>
              </td>

              <td className="p-3 text-center">{item.code}</td>
              <td className="p-3 text-center">{item.category}</td>
              <td className="p-3 text-center">{item.status}</td>
              <td className="p-3 text-center">{item.location}</td>

              <td className="p-3 text-center space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="text-blue-600"
                >
                  แก้ไข
                </button>

                <button
                  onClick={() => onDelete(item._id)}
                  className="text-red-600"
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
