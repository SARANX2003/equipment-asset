"use client";

import { useEffect, useState } from "react";
import EquipmentTable from "./components/EquipmentTable";
import SearchFilter from "./components/SearchFilter";
import Pagination from "./components/Pagination";
import EquipmentModal from "./components/EquipmentModal";

export default function DashboardClient() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    code: "",
    category: "",
    status: "Available",
    location: "",
  });

  const fetchData = async () => {
    setLoading(true);

    const res = await fetch(
      `/api/equipment?page=${page}&search=${search}&status=${status}`
    );

    const data = await res.json();

    setItems(data.data);
    setTotalPages(data.totalPages);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [page, search, status]);

  // =======================
  // เปิด modal เพิ่ม
  // =======================
  const handleAdd = () => {
    setIsEdit(false);
    setCurrentId(null);
    setForm({
      name: "",
      code: "",
      category: "",
      status: "Available",
      location: "",
    });
    setOpenModal(true);
  };

  // =======================
  // เปิด modal แก้ไข
  // =======================
  const handleEdit = (item) => {
    setIsEdit(true);
    setCurrentId(item._id);
    setForm(item);
    setOpenModal(true);
  };

  // =======================
  // บันทึก (เพิ่ม/แก้ไข)
  // =======================
  const handleSubmit = async () => {
    if (isEdit) {
      await fetch(`/api/equipment/${currentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch(`/api/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setOpenModal(false);
    fetchData();
  };

  // =======================
  // ลบ
  // =======================
  const handleDelete = async (id) => {
    if (!confirm("ต้องการลบใช่ไหม?")) return;

    await fetch(`/api/equipment/${id}`, {
      method: "DELETE",
    });

    fetchData();
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-green-700">
          รายการอุปกรณ์
        </h2>

        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm"
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

      {loading ? (
        <p className="text-center">กำลังโหลด...</p>
      ) : (
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
