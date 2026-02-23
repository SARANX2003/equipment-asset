"use client";

import { useEffect, useState, useMemo } from "react";
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

  // 📊 Summary calculation
  const summary = useMemo(() => {
    const total = items.length;
    const available = items.filter(i => i.status === "Available").length;
    const borrowed = items.filter(i => i.status === "Borrowed").length;
    return { total, available, borrowed };
  }, [items]);

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

  const handleEdit = (item) => {
    setIsEdit(true);
    setForm(item);
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("ยืนยันการลบอุปกรณ์?")) return;
    await fetch(`/api/equipment/${id}`, { method: "DELETE" });
    fetchData();
  };

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
    <div className="space-y-8">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            รายการอุปกรณ์
          </h2>
          <p className="text-gray-500 text-sm">
            จัดการครุภัณฑ์ คณะวิทยาศาสตร์
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-5 py-2.5 rounded-xl shadow hover:scale-105 transition"
        >
          + เพิ่มอุปกรณ์
        </button>
      </div>

      {/* 📊 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="อุปกรณ์ทั้งหมด" value={summary.total} color="blue" />
        <SummaryCard title="พร้อมใช้งาน" value={summary.available} color="green" />
        <SummaryCard title="กำลังถูกยืม" value={summary.borrowed} color="red" />
      </div>

      {/* Filter */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <SearchFilter
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          setPage={setPage}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
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
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                setPage={setPage}
              />
            </div>
          </>
        )}
      </div>

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

function SummaryCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className={`text-3xl font-bold mt-2 ${colors[color]}`}>
        {value}
      </h3>
    </div>
  );
}