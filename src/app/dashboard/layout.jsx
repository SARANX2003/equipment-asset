"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

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
    const interval = setInterval(fetchPending, 10000);
    return () => clearInterval(interval);
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
          {menuItem("/scan", "สแกน", "🔍")}

          <p className="text-xs uppercase text-green-300 px-2 mt-6">ผู้ดูแลระบบ</p>
          {menuItem("/admin/borrow", "จัดการคำขอยืม", "📥")}
          {menuItem("/admin/dashboard", "Dashboard", "📊")}
          {menuItem("/reports", "รายงาน", "📈")}

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

        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">

          <h1 className="text-lg font-semibold text-gray-800">
            ระบบจัดการครุภัณฑ์
          </h1>

          <div className="flex items-center gap-4">

            {/* Notification Bell */}
            <div className="relative">
              <Link href="/admin/borrow">
                <span className="text-2xl cursor-pointer">🔔</span>
              </Link>

              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>

            <span className="text-sm text-gray-500">
              คณะวิทยาศาสตร์
            </span>

          </div>

        </header>

        {/* Content */}
        <section className="flex-1 p-6">
          {children}
        </section>

      </main>
    </div>
  );
}