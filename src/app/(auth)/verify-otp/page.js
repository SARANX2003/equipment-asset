export default function VerifyOtpPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-2">ยืนยันรหัส OTP</h1>
        <p className="text-sm text-zinc-500 mb-6">
          กรุณากรอกรหัส OTP และตั้งรหัสผ่านใหม่
        </p>

        <label className="block text-sm mb-2">รหัส OTP</label>
        <input
          className="w-full border rounded-xl px-3 py-2 mb-4 bg-transparent"
          placeholder="กรอกรหัส OTP"
        />

        <label className="block text-sm mb-2">รหัสผ่านใหม่</label>
        <input
          type="password"
          className="w-full border rounded-xl px-3 py-2 mb-4 bg-transparent"
          placeholder="รหัสผ่านใหม่"
        />

        <label className="block text-sm mb-2">ยืนยันรหัสผ่านใหม่</label>
        <input
          type="password"
          className="w-full border rounded-xl px-3 py-2 mb-6 bg-transparent"
          placeholder="ยืนยันรหัสผ่าน"
        />

        <button className="w-full rounded-xl px-4 py-2 bg-green-600 text-white hover:bg-green-700">
          ยืนยันและเปลี่ยนรหัสผ่าน
        </button>

        <div className="mt-4 text-sm text-center">
          <a href="/login" className="underline">กลับหน้าเข้าสู่ระบบ</a>
        </div>
      </div>
    </main>
  );
}
