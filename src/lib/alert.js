import Swal from "sweetalert2";

export const toast = (icon, title) => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
    background: "#1f2937",
    color: "#fff",
  });
};

export const confirmDialog = async (text) => {
  return Swal.fire({
    title: "ยืนยันการทำรายการ?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#dc2626",
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
  });
};