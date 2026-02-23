"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [toast, setToast] = useState(null);
  const router = useRouter();

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!email) {
      showToast("error", "กรอกอีเมลก่อน");
      return;
    }

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      showToast("success", "ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว 📩");

      setTimeout(() => {
        router.push(data.resetUrl);
      }, 1200);
    } else {
      showToast("error", data.message);
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

      <div className="w-full max-w-md bg-white shadow-2xl rounded-3xl p-10 border border-gray-100">

        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          รีเซ็ตรหัสผ่าน
        </h2>

        <form onSubmit={submit} className="space-y-6">
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full border border-gray-300 rounded-xl px-4 pt-6 pb-2 focus:ring-2 focus:ring-green-500 focus:outline-none transition"
              placeholder=" "
            />
            <label className="absolute left-4 top-2 text-xs text-gray-400 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 transition-all">
              📧 อีเมลของคุณ
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 rounded-xl shadow-lg hover:scale-[1.02] transition-all"
          >
            ส่งลิงก์รีเซ็ต
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          กลับไป{" "}
          <a href="/login" className="text-green-600 font-medium hover:underline">
            เข้าสู่ระบบ
          </a>
        </p>

      </div>
    </div>
  );
}