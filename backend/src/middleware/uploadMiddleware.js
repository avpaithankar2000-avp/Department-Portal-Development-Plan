import multer from "multer";

const storage = multer.memoryStorage();
const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

const fileFilter = (_req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) return cb(null, true);
  return cb(new Error("Only PDF, JPG, JPEG, and PNG files are allowed"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export const internshipDocumentFields = upload.fields([
  { name: "offerLetter", maxCount: 1 },
  { name: "completionCertificate", maxCount: 1 },
  { name: "verificationProof", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
  { name: "studentPhoto", maxCount: 1 }
]);

export const placementDocumentFields = upload.fields([
  { name: "offerLetter", maxCount: 1 },
  { name: "appointmentLetter", maxCount: 1 },
  { name: "verificationProof", maxCount: 1 },
  { name: "companyLogo", maxCount: 1 },
  { name: "studentPhoto", maxCount: 1 }
]);
