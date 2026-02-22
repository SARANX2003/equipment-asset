"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/admin-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  if (!stats) return <div className="p-6">กำลังโหลด...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card title="อุปกรณ์ทั้งหมด" value={stats.totalEquipment} />
        <Card title="กำลังถูกยืม" value={stats.borrowed} />
        <Card title="รออนุมัติ" value={stats.pending} />
        <Card title="คืนแล้ว" value={stats.returned} />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}