"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginClient() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const login = async () => {
    if (!form.username || !form.password) {
      showToast("error", "กรอกข้อมูลให้ครบ");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message || "เข้าสู่ระบบไม่สำเร็จ");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      showToast("success", "เข้าสู่ระบบสำเร็จ 🎉");

      setTimeout(() => {
        router.push(redirect || "/dashboard");
      }, 1200);

    } catch {
      showToast("error", "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl text-white text-sm font-medium animate-slide
          ${toast.type === "success"
              ? "bg-gradient-to-r from-green-600 to-emerald-500"
              : "bg-gradient-to-r from-red-500 to-pink-500"}`}
        >
          {toast.message}
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-100 transition-all">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white p-4 rounded-2xl shadow-lg">
            🔐
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800">
          เข้าสู่ระบบ
        </h1>
        <p className="text-center text-gray-500 text-sm mt-2 mb-8">
          ระบบจัดการครุภัณฑ์ คณะวิทยาศาสตร์
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Username */}
          <div className="relative">
            <input
              type="text"
              required
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 transition-all">
              👤 ชื่อผู้ใช้
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-500 transition-all">
              🔒 รหัสผ่าน
            </label>

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:scale-[1.02] hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>

        </form>

        {/* Footer */}
        <div className="flex justify-between mt-6 text-sm">
          <a
            href="/forgot-password"
            className="text-gray-500 hover:text-green-600 transition"
          >
            ลืมรหัสผ่าน
          </a>
          <a
            href="/register"
            className="text-green-600 font-medium hover:underline"
          >
            สมัครสมาชิก
          </a>
        </div>

      </div>

      {/* Animation */}
      <style jsx>{`
        .animate-slide {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

    </div>
  );
}