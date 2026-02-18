"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password || !confirm) {
      alert("กรอกข้อมูลไม่ครบ");
      return;
    }

    if (password !== confirm) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    if (!token) {
      alert("Token ไม่ถูกต้อง");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        password,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("เปลี่ยนรหัสผ่านสำเร็จ");
      router.push("/login");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-green-600 mb-6">
          ตั้งรหัสผ่านใหม่
        </h2>

        <input
          type="password"
          placeholder="รหัสผ่านใหม่"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <input
          type="password"
          placeholder="ยืนยันรหัสผ่าน"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border p-3 rounded-lg mb-6"
        />

        <button
          onClick={submit}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-lg"
        >
          {loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
        </button>
      </div>
    </div>
  );
}
