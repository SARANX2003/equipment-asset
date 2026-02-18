export default function AssetsPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">รายการครุภัณฑ์</h1>
          <a className="rounded-xl px-4 py-2 bg-black text-white dark:bg-white dark:text-black" href="/assets/new">
            + เพิ่มครุภัณฑ์
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <input className="border rounded-xl px-3 py-2 bg-transparent md:col-span-2" placeholder="ค้นหา รหัส/ชื่อ" />
          <select className="border rounded-xl px-3 py-2 bg-transparent">
            <option>หมวดหมู่</option>
          </select>
          <select className="border rounded-xl px-3 py-2 bg-transparent">
            <option>สถานะ</option>
          </select>
        </div>

        <div className="overflow-auto border rounded-2xl">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="text-left p-3">รหัส</th>
                <th className="text-left p-3">ชื่อครุภัณฑ์</th>
                <th className="text-left p-3">หมวดหมู่</th>
                <th className="text-left p-3">สถานที่</th>
                <th className="text-left p-3">สถานะ</th>
                <th className="text-left p-3">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3">A-0001</td>
                <td className="p-3">เครื่องพิมพ์</td>
                <td className="p-3">อุปกรณ์สำนักงาน</td>
                <td className="p-3">อาคาร A/ชั้น 2/ห้อง 201</td>
                <td className="p-3">ใช้งานอยู่</td>
                <td className="p-3"><span className="underline cursor-pointer">ดู</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
