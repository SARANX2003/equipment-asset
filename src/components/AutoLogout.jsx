"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoLogout() {
  const router = useRouter();
  let timeout;

  const resetTimer = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("หมดเวลาใช้งาน ระบบจะออกจากระบบอัตโนมัติ");
      router.push("/login");
    }, 3 * 60 * 1000); // 3 นาที
  };

  useEffect(() => {
    const events = ["mousemove", "keydown", "click"];

    events.forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, []);

  return null;
}
