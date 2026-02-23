"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showToast("error", "รหัสผ่านไม่ตรงกัน");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message || "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      showToast("success", "สมัครสมาชิกสำเร็จ 🎉");

      setTimeout(() => {
        router.push("/login");
      }, 1200);

    } catch {
      showToast("error", "ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-xl shadow-xl text-white text-sm
        ${toast.type === "success"
            ? "bg-gradient-to-r from-green-600 to-emerald-500"
            : "bg-gradient-to-r from-red-500 to-pink-500"}`}>
          {toast.message}
        </div>
      )}

      <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-10 border border-gray-100">

        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          สมัครสมาชิก
        </h1>

        <form onSubmit={submit} className="space-y-6">

          {["name", "username", "email"].map((field) => (
            <div key={field} className="relative">
              <input
                type={field === "email" ? "email" : "text"}
                required
                value={form[field]}
                onChange={(e) =>
                  setForm({ ...form, [field]: e.target.value })
                }
                className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
                placeholder=" "
              />
              <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 transition-all">
                {field === "name" && "👤 ชื่อ-นามสกุล"}
                {field === "username" && "🆔 ชื่อผู้ใช้"}
                {field === "email" && "📧 อีเมล"}
              </label>
            </div>
          ))}

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
            <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 transition-all">
              🔒 รหัสผ่าน
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4"
            >
              👁
            </button>
          </div>

          <div className="relative">
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) =>
                setForm({ ...form, confirmPassword: e.target.value })
              }
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 transition-all">
              🔁 ยืนยันรหัสผ่าน
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-all"
          >
            {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
          </button>

        </form>

        <p className="text-center mt-6 text-sm">
          มีบัญชีแล้ว?{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">
            เข้าสู่ระบบ
          </a>
        </p>

      </div>
    </div>
  );
}