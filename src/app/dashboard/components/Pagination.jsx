"use client";

export default function Pagination({
  page,
  totalPages,
  setPage,
}) {
  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        ก่อนหน้า
      </button>

      <span>
        หน้า {page} / {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        ถัดไป
      </button>
    </div>
  );
}
