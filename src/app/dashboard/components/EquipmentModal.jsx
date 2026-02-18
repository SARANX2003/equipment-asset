"use client";

export default function EquipmentModal({
  open,
  onClose,
  onSubmit,
  form,
  setForm,
  isEdit,
  loading
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">

        <h2 className="text-lg font-bold text-green-700 mb-4">
          {isEdit ? "แก้ไขอุปกรณ์" : "เพิ่มอุปกรณ์"}
        </h2>

        <div className="space-y-3">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="ชื่ออุปกรณ์"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="รหัส"
            value={form.code}
            onChange={e => setForm({ ...form, code: e.target.value })}
          />

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="หมวดหมู่"
            value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}
          />

          <select
            className="w-full border rounded px-3 py-2"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
          >
            <option value="Available">Available</option>
            <option value="Borrowed">Borrowed</option>
            <option value="Repair">Repair</option>
          </select>

          <input
            className="w-full border rounded px-3 py-2"
            placeholder="ที่ตั้ง"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="px-4 py-2 border rounded"
            onClick={onClose}
          >
            ยกเลิก
          </button>

          <button
            className="px-4 py-2 bg-green-600 text-white rounded"
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    </div>
  );
}
