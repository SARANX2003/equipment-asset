"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าใช้งานหน้านี้");
      router.push("/dashboard");
    }
  }, []);

  return <>{children}</>;
}
