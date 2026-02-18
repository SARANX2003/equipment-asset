export default function ScanPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">สแกน QR Code</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-2xl h-64 flex items-center justify-center text-zinc-500">
            (พื้นที่กล้องสำหรับสแกน)
          </div>
          <div className="border rounded-2xl p-4">
            <div className="text-sm text-zinc-500 mb-2">ข้อมูลครุภัณฑ์ (ตัวอย่าง)</div>
            <div className="font-semibold">A-0001 เครื่องพิมพ์</div>
            <div className="text-sm mt-2">สถานที่: อาคาร A/ชั้น 2/ห้อง 201</div>
            <div className="text-sm">สถานะ: ใช้งานอยู่</div>
            <button className="mt-4 rounded-xl px-4 py-2 bg-black text-white dark:bg-white dark:text-black">
              บันทึกการใช้งาน
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
