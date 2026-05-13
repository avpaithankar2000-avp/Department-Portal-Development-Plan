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

const internshipSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true, trim: true },
    rollNumber: { type: String, trim: true },
    department: { type: String, trim: true, default: "AIML" },
    company: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    mode: { type: String, enum: ["Remote", "On-site", "Hybrid"], default: "On-site" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    stipend: { type: Number, min: 0, default: 0 },
    academicYear: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    technologiesUsed: [{ type: String, trim: true }],
    verificationStatus: { type: String, enum: ["Verified", "Pending", "Rejected"], default: "Pending" },
    offerLetter: documentSchema,
    completionCertificate: documentSchema,
    verificationProof: documentSchema,
    companyLogo: documentSchema,
    studentPhoto: documentSchema,
    certificateUrl: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model("Internship", internshipSchema);
