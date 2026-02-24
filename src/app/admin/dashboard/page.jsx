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
  Cell,
  LabelList,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // 🎨 สีสำหรับแต่ละอุปกรณ์
  const COLORS = [
    "#16a34a",
    "#2563eb",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#14b8a6",
    "#f97316",
    "#ec4899",
  ];

  // =========================
  // โหลดสถิติ
  // =========================
  useEffect(() => {
    fetch("/api/admin-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  // โหลดกราฟครั้งแรก
  useEffect(() => {
    fetchChart();
  }, []);

  const fetchChart = async () => {
    let url = "/api/borrow-analytics?";

    if (from && to) {
      url += `from=${from}&to=${to}`;
    } else if (month && year) {
      url += `month=${month}&year=${year}`;
    }

    try {
      const res = await fetch(url);
      const data = await res.json();
      setChartData(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <div className="p-6">กำลังโหลด...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        📊 Dashboard วิเคราะห์การยืม
      </h1>

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
      <div className="bg-white p-6 rounded-xl shadow mb-6 flex flex-wrap gap-6 items-end">

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            จากวันที่
          </label>
          <input
            type="date"
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              setMonth("");
              setYear("");
            }}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            ถึงวันที่
          </label>
          <input
            type="date"
            value={to}
            onChange={(e) => {
              setTo(e.target.value);
              setMonth("");
              setYear("");
            }}
            className="border px-3 py-2 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            เดือน
          </label>
          <select
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
              setFrom("");
              setTo("");
            }}
            className="border px-3 py-2 rounded-lg"
          >
            <option value="">เลือกเดือน</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-1">
            ปี
          </label>
          <input
            type="number"
            placeholder="2026"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              setFrom("");
              setTo("");
            }}
            className="border px-3 py-2 rounded-lg w-28"
          />
        </div>

        <button
          onClick={fetchChart}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow"
        >
          แสดงกราฟ
        </button>

      </div>

      {/* ===================== */}
      {/* Chart */}
      {/* ===================== */}
      <div className="bg-white p-6 rounded-2xl shadow">

        <h2 className="text-lg font-semibold mb-4">
          📊 จำนวนการยืมแยกตามอุปกรณ์
        </h2>

        <ResponsiveContainer width="100%" height={450}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value) => [`${value} ครั้ง`, "จำนวนการยืม"]}
            />
            <Bar dataKey="total" radius={[8, 8, 0, 0]}>
              <LabelList
                dataKey="total"
                position="top"
                style={{ fontWeight: "bold" }}
              />
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
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