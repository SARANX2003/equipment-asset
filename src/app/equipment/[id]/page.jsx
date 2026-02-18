import dbConnect from "@/lib/mongodb";
import Equipment from "@/models/Equipment";

export default async function EquipmentDetail(props) {
  const params = await props.params; // 🔥 ต้อง await

  await dbConnect();

  const equipment = await Equipment.findById(params.id).lean();

  if (!equipment) {
    return <div className="p-6">ไม่พบข้อมูล</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">
          {equipment.name}
        </h1>

        <div className="space-y-2">
          <p><strong>รหัส:</strong> {equipment.code}</p>
          <p><strong>หมวดหมู่:</strong> {equipment.category}</p>
          <p><strong>สถานะ:</strong> {equipment.status}</p>
          <p><strong>ที่ตั้ง:</strong> {equipment.location}</p>
        </div>
      </div>

      {equipment.qrCode && (
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="font-semibold mb-3">
            QR Code ครุภัณฑ์
          </h3>

          <img
            src={equipment.qrCode}
            alt="QR Code"
            className="mx-auto w-48 h-48"
          />

          <a
            href={equipment.qrCode}
            download={`equipment-${equipment._id}.png`}
            className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            ดาวน์โหลด QR
          </a>
        </div>
      )}
    </div>
  );
}
