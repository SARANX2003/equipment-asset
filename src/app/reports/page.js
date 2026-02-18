export default function ReportsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">รายงาน</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <select className="border rounded-xl px-3 py-2 bg-transparent">
            <option>ประเภทรายงาน</option>
            <option>รายงานครุภัณฑ์</option>
            <option>รายงานประวัติการใช้งาน</option>
          </select>
          <input className="border rounded-xl px-3 py-2 bg-transparent" placeholder="วันที่เริ่มต้น" />
          <input className="border rounded-xl px-3 py-2 bg-transparent" placeholder="วันที่สิ้นสุด" />
          <button className="rounded-xl px-4 py-2 bg-black text-white dark:bg-white dark:text-black">
            แสดงรายงาน
          </button>
        </div>

        <div className="flex gap-3 mb-4">
          <button className="rounded-xl px-4 py-2 border">Export PDF</button>
          <button className="rounded-xl px-4 py-2 border">Export Excel</button>
        </div>

        <div className="border rounded-2xl p-6 text-zinc-500">
          (พื้นที่แสดงตาราง/กราฟรายงาน)
        </div>
      </div>
    </main>
  );
}
