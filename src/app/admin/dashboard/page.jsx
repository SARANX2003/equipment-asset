"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [type, setType] = useState("month");
  const [equipment, setEquipment] = useState("all");
  const [equipmentList, setEquipmentList] = useState([]);

  // =========================
  // โหลดสถิติ
  // =========================
  useEffect(() => {
    fetch("/api/admin-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  // =========================
  // โหลดรายการอุปกรณ์
  // =========================
  useEffect(() => {
    fetch("/api/equipment")
      .then((res) => res.json())
      .then((data) => setEquipmentList(data.data || []))
      .catch((err) => console.error(err));
  }, []);

  // =========================
  // โหลดข้อมูลกราฟ
  // =========================
  useEffect(() => {
    fetch(
      `/api/borrow-analytics?type=${type}&equipment=${equipment}`
    )
      .then((res) => res.json())
      .then((data) => setChartData(data))
      .catch((err) => console.error(err));
  }, [type, equipment]);

  if (!stats) return <div className="p-6">กำลังโหลด...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">📊 Dashboard</h1>

      {/* ===================== */}
      {/* Summary Cards */}
      {/* ===================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card title="อุปกรณ์ทั้งหมด" value={stats.totalEquipment} />
        <Card title="กำลังถูกยืม" value={stats.borrowed} />
        <Card title="รออนุมัติ" value={stats.pending} />
        <Card title="คืนแล้ว" value={stats.returned} />
      </div>

      {/* ===================== */}
      {/* Filter Section */}
      {/* ===================== */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-4">

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="day">รายวัน</option>
          <option value="month">รายเดือน</option>
          <option value="year">รายปี</option>
        </select>

        <select
          value={equipment}
          onChange={(e) => setEquipment(e.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="all">อุปกรณ์ทั้งหมด</option>
          {equipmentList.map((eq) => (
            <option key={eq._id} value={eq._id}>
              {eq.name}
            </option>
          ))}
        </select>

      </div>

      {/* ===================== */}
      {/* Chart */}
      {/* ===================== */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="total"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 text-center hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}