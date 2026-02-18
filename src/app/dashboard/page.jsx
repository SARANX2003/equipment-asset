"use client";

import { useEffect, useState } from "react";
import EquipmentTable from "./components/EquipmentTable";
import SearchFilter from "./components/SearchFilter";
import Pagination from "./components/Pagination";
import Loading from "./components/Loading";
import EmptyState from "./components/EmptyState";
import ErrorState from "./components/ErrorState";
import EquipmentModal from "./components/EquipmentModal";

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    status: "Available",
    location: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/equipment?page=${page}&search=${search}&status=${status}`
      );

      if (!res.ok) throw new Error("โหลดข้อมูลล้มเหลว");

      const data = await res.json();

      setItems(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, status]);

  // ========================
  // ✅ ADD
  // ========================
  const handleAdd = () => {
    setIsEdit(false);
    setForm({
      name: "",
      code: "",
      category: "",
      status: "Available",
      location: "",
    });
    setOpenModal(true);
  };

  // ========================
  // ✅ EDIT
  // ========================
  const handleEdit = (item) => {
    setIsEdit(true);
    setForm(item);
    setOpenModal(true);
  };

  // ========================
  // ✅ DELETE
  // ========================
  const handleDelete = async (id) => {
    if (!confirm("ยืนยันการลบอุปกรณ์?")) return;

    await fetch(`/api/equipment/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  // ========================
  // ✅ SUBMIT (ADD / EDIT)
  // ========================
  const handleSubmit = async () => {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit
      ? `/api/equipment/${form._id}`
      : `/api/equipment`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setOpenModal(false);
    fetchData();
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-700">
          รายการอุปกรณ์ (คณะวิทยาศาสตร์)
        </h2>

        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
        >
          + เพิ่มอุปกรณ์
        </button>
      </div>

      <SearchFilter
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        setPage={setPage}
      />

      {loading && <Loading />}
      {error && <ErrorState message={error} />}
      {!loading && !error && items.length === 0 && <EmptyState />}

      {!loading && !error && items.length > 0 && (
        <>
          <EquipmentTable
            items={items}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </>
      )}

      <EquipmentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        isEdit={isEdit}
      />
    </div>
  );
}
