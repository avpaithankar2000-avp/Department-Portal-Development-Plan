import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    url: String,
    publicId: String
  },
  { _id: false }
);

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["Workshop", "Seminar", "Hackathon", "Guest Lecture", "Conference", "Other"],
      default: "Other"
    },
    venue: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    organizer: { type: String, trim: true },
    image: imageSchema
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
