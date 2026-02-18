export default function AddAssetPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">เพิ่มครุภัณฑ์</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded-xl px-3 py-2 bg-transparent" placeholder="รหัสครุภัณฑ์ (asset_id)" />
          <input className="border rounded-xl px-3 py-2 bg-transparent" placeholder="ชื่อครุภัณฑ์" />
          <select className="border rounded-xl px-3 py-2 bg-transparent">
            <option>หมวดหมู่</option>
          </select>
          <select className="border rounded-xl px-3 py-2 bg-transparent">
            <option>สถานะ</option>
          </select>
          <select className="border rounded-xl px-3 py-2 bg-transparent">
            <option>อาคาร</option>
          </select>
          <select className="border rounded-xl px-3 py-2 bg-transparent">
            <option>ชั้น</option>
          </select>
          <select className="border rounded-xl px-3 py-2 bg-transparent md:col-span-2">
            <option>ห้อง</option>
          </select>
          <input className="border rounded-xl px-3 py-2 bg-transparent md:col-span-2" placeholder="ผู้รับผิดชอบ" />
        </div>

        <div className="flex gap-3 mt-6">
          <button className="rounded-xl px-4 py-2 bg-black text-white dark:bg-white dark:text-black">
            บันทึก
          </button>
          <a className="rounded-xl px-4 py-2 border" href="/assets">ยกเลิก</a>
        </div>
      </div>
    </main>
  );
}
