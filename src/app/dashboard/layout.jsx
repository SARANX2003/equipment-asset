"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  const [showRange, setShowRange] = useState(false);
  const [showMonthYear, setShowMonthYear] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  const fetchPending = async () => {
    try {
      const res = await fetch("/api/pending-count");
      const data = await res.json();
      setPendingCount(data.count);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const menuItem = (href, label, icon) => (
    <Link
      href={href}
      className={`flex justify-between items-center px-4 py-2 rounded-lg transition ${
        pathname === href
          ? "bg-green-600 text-white"
          : "hover:bg-green-600/70"
      }`}
    >
      <span>{icon} {label}</span>
      {href === "/admin/borrow" && pendingCount > 0 && (
        <span className="bg-red-500 text-xs px-2 py-1 rounded-full">
          {pendingCount}
        </span>
      )}
    </Link>
  );

  const exportMonthYear = () => {
    window.open(
      `/api/export-borrow?type=month&month=${selectedMonth}&year=${selectedYear}`
    );
    setShowMonthYear(false);
  };

  const exportRange = () => {
    if (!startDate || !endDate) {
      alert("เลือกช่วงวันที่ก่อน");
      return;
    }

    window.open(
      `/api/export-borrow?type=range&start=${startDate}&end=${endDate}`
    );

    setShowRange(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-green-800 to-green-700 text-white flex flex-col shadow-lg">

        <div className="px-6 py-5 text-xl font-bold border-b border-green-600">
          Equipment Asset
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3">

          <p className="text-xs uppercase text-green-300 px-2">ทั่วไป</p>
          {menuItem("/dashboard", "รายการครุภัณฑ์", "📋")}

          <p className="text-xs uppercase text-green-300 px-2 mt-6">ผู้ดูแลระบบ</p>
          {menuItem("/admin/borrow", "จัดการคำขอยืม", "📥")}
          {menuItem("/admin/dashboard", "Dashboard", "📊")}

          <div className="mt-6 space-y-2">

            <button
              onClick={() => setShowMonthYear(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
            >
              📅 เลือกเดือน / ปี
            </button>

            <button
              onClick={() => setShowRange(true)}
              className="w-full bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition"
            >
              🗓 เลือกช่วงวันที่
            </button>

          </div>

        </nav>

        <div className="px-4 py-4 border-t border-green-600">
          <Link
            href="/login"
            className="block bg-red-600 hover:bg-red-700 text-center py-2 rounded-lg transition"
          >
            ออกจากระบบ
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">
            ระบบจัดการครุภัณฑ์
          </h1>
          <span className="text-sm text-gray-500">
            คณะวิทยาศาสตร์
          </span>
        </header>

        <section className="flex-1 p-6">
          {children}
        </section>
      </main>

      {/* Month / Year Modal */}
      {showMonthYear && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              เลือกเดือนและปี
            </h2>

            <div className="space-y-3">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    เดือนที่ {i + 1}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full border p-2 rounded-lg"
                placeholder="ปี เช่น 2026"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowMonthYear(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={exportMonthYear}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Range Modal */}
      {showRange && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              เลือกช่วงวันที่
            </h2>

            <div className="space-y-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border p-2 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowRange(false)}
                className="px-4 py-2 rounded-lg bg-gray-200"
              >
                ยกเลิก
              </button>
              <button
                onClick={exportRange}
                className="px-4 py-2 rounded-lg bg-green-600 text-white"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}