"use client";

import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function HistoryPage() {

  const [data,setData] = useState([]);
  const [search,setSearch] = useState("");
  const [startDate,setStartDate] = useState("");
  const [endDate,setEndDate] = useState("");

  useEffect(()=>{
    fetch("/api/borrow-list")
      .then(res=>res.json())
      .then(result => setData(result || []))
  },[])


  const deleteHistory = async(id)=>{

    if(!confirm("ต้องการลบประวัตินี้หรือไม่")) return

    await fetch(`/api/borrow-list/${id}`,{
      method:"DELETE"
    })

    setData(data.filter(item=>item._id !== id))
  }



  const filtered = data.filter(item => {

    const borrower = item.borrowerName || ""
    const equipment = item.equipmentName || ""
    const code = item.equipmentCode || ""
    const location = item.location || ""

    const matchSearch =
      borrower.toLowerCase().includes(search.toLowerCase()) ||
      equipment.toLowerCase().includes(search.toLowerCase()) ||
      code.toLowerCase().includes(search.toLowerCase()) ||
      location.toLowerCase().includes(search.toLowerCase())

    const borrowDate = item.borrowDate ? new Date(item.borrowDate) : null

    const matchStart =
      !startDate || (borrowDate && borrowDate >= new Date(startDate))

    const matchEnd =
      !endDate || (borrowDate && borrowDate <= new Date(endDate))

    return matchSearch && matchStart && matchEnd
  })


  const exportPDF = async () => {

    const element = document.getElementById("historyTable")

    const canvas = await html2canvas(element)

    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p","mm","a4")

    const imgWidth = 190
    const imgHeight = canvas.height * imgWidth / canvas.width

    pdf.addImage(imgData,"PNG",10,10,imgWidth,imgHeight)

    pdf.save("borrow-history.pdf")
  }



  return (

    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow border">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            📜 ประวัติการยืมคืน
          </h2>

          <p className="text-gray-500 text-sm">
            ตรวจสอบประวัติการใช้งานอุปกรณ์ทั้งหมด
          </p>
        </div>

        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl shadow transition"
        >
          ⬇ Export PDF
        </button>

      </div>



      {/* Filter */}
      <div className="bg-white rounded-2xl shadow border p-6 flex flex-wrap gap-4 items-center">

        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหา ผู้ยืม / อุปกรณ์ / รหัส / สถานที่..."
            className="border rounded-lg px-4 py-2 pl-10 w-80 focus:ring-2 focus:ring-green-500 outline-none"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </span>
        </div>

        <input
          type="date"
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          value={startDate}
          onChange={(e)=>setStartDate(e.target.value)}
        />

        <input
          type="date"
          className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 outline-none"
          value={endDate}
          onChange={(e)=>setEndDate(e.target.value)}
        />

      </div>



      {/* Table */}
      <div className="bg-white rounded-2xl shadow border overflow-hidden">

        <table id="historyTable" className="w-full">

          <thead className="bg-gray-50 text-gray-600 text-sm">

            <tr>

              <th className="text-left py-3 px-4">ผู้ยืม</th>
              <th className="text-left py-3 px-4">อุปกรณ์</th>
              <th className="text-left py-3 px-4">รหัส</th>
              <th className="text-left py-3 px-4">สถานที่นำไปใช้</th>
              <th className="text-left py-3 px-4">สถานะ</th>
              <th className="text-left py-3 px-4">วันที่</th>
              <th className="text-left py-3 px-4">จัดการ</th>

            </tr>

          </thead>

          <tbody className="text-sm">

            {filtered.map((item,index) => (

              <tr
                key={item._id}
                className={`border-t ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-green-50`}
              >

                <td className="py-3 px-4 font-medium">
                  {item.borrowerName}
                </td>

                <td className="py-3 px-4">
                  {item.equipmentName}
                </td>

                <td className="py-3 px-4 text-gray-500">
                  {item.equipmentCode}
                </td>

                <td className="py-3 px-4">
                  {item.location}
                </td>

                <td className="py-3 px-4">

                  {item.status === "returned" && (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                      คืนแล้ว
                    </span>
                  )}

                  {item.status === "rejected" && (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                      ปฏิเสธ
                    </span>
                  )}

                </td>

                <td className="py-3 px-4 text-gray-600">
                  {new Date(item.borrowDate).toLocaleDateString("th-TH")}
                </td>

                <td className="py-3 px-4">

                  <button
                    onClick={()=>deleteHistory(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition"
                  >
                    ลบ
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}