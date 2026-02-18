"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

      // ✅ เก็บ token
      localStorage.setItem("token", data.token);

      // ✅ เก็บ user info
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: data.user._id,
          username: data.user.username,
          role: data.user.role,
        })
      );

      alert("เข้าสู่ระบบสำเร็จ");

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-2">
          เข้าสู่ระบบ
        </h1>

        <p className="text-center text-sm text-gray-600 mb-6">
          ระบบจัดการครุภัณฑ์ คณะวิทยาศาสตร์
        </p>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="ชื่อผู้ใช้"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </div>

        <div className="flex justify-between mt-4 text-sm">
          <a href="/forgot-password" className="text-blue-600 hover:underline">
            ลืมรหัสผ่าน
          </a>
          <a href="/register" className="text-purple-600 hover:underline">
            สมัครสมาชิก
          </a>
        </div>
      </div>
    </div>
  );
}
