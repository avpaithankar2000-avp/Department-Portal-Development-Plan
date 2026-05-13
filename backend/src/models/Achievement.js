import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    achieverName: { type: String, required: true, trim: true },
    achieverType: { type: String, enum: ["Student", "Faculty"], required: true },
    awardDate: { type: Date, required: true },
    category: { type: String, trim: true, default: "General" },
    image: imageSchema
  },
  { timestamps: true }
);

export default mongoose.model("Achievement", achievementSchema);
