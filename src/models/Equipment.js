import mongoose from "mongoose";

const EquipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    category: String,
    status: {
      type: String,
      default: "available",
    },
    location: String,

    // ✅ เก็บ QR Code แบบ Base64
    qrCode: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: "equipments",
  }
);

export default mongoose.models.Equipment ||
  mongoose.model("Equipment", EquipmentSchema);
