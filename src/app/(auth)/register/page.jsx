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
  const router = useRouter();

  const submit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
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
        alert(data.message || "สมัครสมาชิกไม่สำเร็จ");
        return;
      }

      alert("สมัครสมาชิกสำเร็จ");
      router.push("/login");
    } catch (err) {
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-2xl font-bold text-green-700 mb-6">
          สมัครใช้งาน
        </h1>

        <div className="space-y-4">
          {[
            ["name", "ชื่อ-นามสกุล"],
            ["username", "ชื่อผู้ใช้"],
            ["email", "อีเมล"],
          ].map(([key, label]) => (
            <input
              key={key}
              placeholder={label}
              className="w-full px-4 py-3 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              required
            />
          ))}

          <input
            type="password"
            placeholder="รหัสผ่าน"
            className="w-full px-4 py-3 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="ยืนยันรหัสผ่าน"
            className="w-full px-4 py-3 border rounded-lg"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            required
          />
        </div>

        <button
          disabled={loading}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
        </button>

        <p className="mt-4 text-center text-sm">
          มีบัญชีแล้ว?{" "}
          <a href="/login" className="text-green-700 underline">
            เข้าสู่ระบบ
          </a>
        </p>
      </form>
    </div>
  );
}
