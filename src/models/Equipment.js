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
      enum: ["Available", "Borrowed"],
      default: "Available",
    },

    location: String,

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
