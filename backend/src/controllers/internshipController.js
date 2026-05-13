import Internship from "../models/Internship.js";
import { buildSearchFilter, paginatedResponse } from "../utils/queryHelpers.js";
import { uploadDocumentFields } from "../utils/uploadImage.js";

const documentFields = ["offerLetter", "completionCertificate", "verificationProof", "companyLogo", "studentPhoto"];

const normalizeInternshipBody = (body) => {
  const normalized = { ...body };

  if (typeof normalized.technologiesUsed === "string") {
    normalized.technologiesUsed = normalized.technologiesUsed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (normalized.stipend === "") normalized.stipend = 0;

  return normalized;
};

const applyRemovedDocuments = (record, removeDocuments = "") => {
  removeDocuments
    .split(",")
    .map((item) => item.trim())
    .filter((item) => documentFields.includes(item))
    .forEach((field) => {
      record[field] = undefined;
    });
};

const internshipFilter = (query) => {
  const filter = buildSearchFilter(query, ["studentName", "rollNumber", "department", "company", "role", "academicYear", "mode"]);

  if (query.academicYear) filter.academicYear = query.academicYear;
  if (query.mode) filter.mode = query.mode;
  if (query.company) filter.company = { $regex: query.company, $options: "i" };
  if (query.verificationStatus) filter.verificationStatus = query.verificationStatus;

  return filter;
};

export const getInternships = async (req, res) => {
  const response = await paginatedResponse(Internship, internshipFilter(req.query), req.query, { startDate: -1 });
  res.json(response);
};

export const getInternship = async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) return res.status(404).json({ message: "Internship not found" });
  res.json(internship);
};

export const createInternship = async (req, res) => {
  const documents = await uploadDocumentFields(req.files, "aiml_portal/internships");
  const internship = await Internship.create({ ...normalizeInternshipBody(req.body), ...documents });
  res.status(201).json(internship);
};

export const updateInternship = async (req, res) => {
  const internship = await Internship.findById(req.params.id);
  if (!internship) return res.status(404).json({ message: "Internship not found" });

  const documents = await uploadDocumentFields(req.files, "aiml_portal/internships");
  Object.assign(internship, normalizeInternshipBody(req.body), documents);
  applyRemovedDocuments(internship, req.body.removeDocuments);
  await internship.save();

  res.json(internship);
};

export const deleteInternship = async (req, res) => {
  const internship = await Internship.findByIdAndDelete(req.params.id);
  if (!internship) return res.status(404).json({ message: "Internship not found" });
  res.json({ message: "Internship deleted" });
};
