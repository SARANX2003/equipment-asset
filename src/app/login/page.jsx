"use client";

export const dynamic = "force-dynamic"; // 🔥 เพิ่มบรรทัดนี้

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const login = async () => {
    if (!form.username || !form.password) {
      alert("กรอกข้อมูลให้ครบ");
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
        alert(data.message || "เข้าสู่ระบบไม่สำเร็จ");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      router.push(redirect || "/dashboard");

    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-700 via-green-600 to-green-500">
      <div className="w-full max-w-md bg-white/95 backdrop-blur shadow-2xl rounded-3xl p-8 animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-xs font-semibold">
            ระบบจัดการครุภัณฑ์
          </div>

          <h1 className="text-2xl font-bold text-green-700 mt-4">
            เข้าสู่ระบบ
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            คณะวิทยาศาสตร์
          </p>
        </div>

        <div className="space-y-5">
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">👤</span>
            <input
              type="text"
              placeholder="ชื่อผู้ใช้"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">🔒</span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="รหัสผ่าน"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </div>

        <div className="flex justify-between mt-6 text-sm">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            ลืมรหัสผ่าน
          </a>
          <a href="/register" className="text-purple-600 hover:underline">
            สมัครสมาชิก
          </a>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}