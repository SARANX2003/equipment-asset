"use client";

export default function SearchFilter({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="ค้นหาอุปกรณ์..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border px-3 py-2 rounded w-64"
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="all">ทั้งหมด</option>
        <option value="Available">Available</option>
        <option value="Unavailable">Unavailable</option>
      </select>
    </div>
  );
}
