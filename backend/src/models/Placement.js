import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    public_id: String,
    secure_url: String,
    fileType: String,
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const placementSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    packageLpa: { type: Number, required: true, min: 0 },
    package: { type: Number, min: 0 },
    academicYear: { type: String, required: true, trim: true },
    offerType: { type: String, enum: ["Internship", "Full-time", "Internship + Full-time"], default: "Full-time" },
    placementType: { type: String, trim: true },
    location: { type: String, trim: true },
    placedDate: { type: Date, required: true },
    joiningDate: { type: Date },
    recruiterName: { type: String, trim: true },
    companyWebsite: { type: String, trim: true },
    verificationStatus: { type: String, enum: ["Verified", "Pending", "Rejected"], default: "Pending" },
    offerLetter: documentSchema,
    appointmentLetter: documentSchema,
    verificationProof: documentSchema,
    companyLogo: documentSchema,
    studentPhoto: documentSchema
  },
  { timestamps: true }
);

export default mongoose.model("Placement", placementSchema);
