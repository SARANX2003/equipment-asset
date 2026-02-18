"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const submit = async () => {
    if (!email) {
      alert("กรอกอีเมลก่อน");
      return;
    }

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว");
      router.push(data.resetUrl); // 🔥 ใช้ resetUrl ตาม backend ใหม่
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          ขอรีเซ็ตรหัสผ่าน
        </h2>

        <input
          type="email"
          placeholder="กรอกอีเมลของคุณ"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={submit}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
        >
          ส่งลิงก์รีเซ็ต
        </button>
      </div>
    </div>
  );
}
