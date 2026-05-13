import Placement from "../models/Placement.js";
import { buildSearchFilter, paginatedResponse } from "../utils/queryHelpers.js";
import { uploadDocumentFields } from "../utils/uploadImage.js";

const documentFields = ["offerLetter", "appointmentLetter", "verificationProof", "companyLogo", "studentPhoto"];

const normalizePlacementBody = (body) => {
  const normalized = { ...body };

  if (normalized.package && !normalized.packageLpa) normalized.packageLpa = normalized.package;
  if (normalized.packageLpa && !normalized.package) normalized.package = normalized.packageLpa;
  if (normalized.placementType && !normalized.offerType) normalized.offerType = normalized.placementType;
  if (normalized.offerType && !normalized.placementType) normalized.placementType = normalized.offerType;
  if (normalized.joiningDate && !normalized.placedDate) normalized.placedDate = normalized.joiningDate;

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

const placementFilter = (query) => {
  const filter = buildSearchFilter(query, ["studentName", "company", "role", "academicYear", "location", "recruiterName"]);

  if (query.academicYear) filter.academicYear = query.academicYear;
  if (query.offerType) filter.offerType = query.offerType;
  if (query.company) filter.company = { $regex: query.company, $options: "i" };
  if (query.verificationStatus) filter.verificationStatus = query.verificationStatus;

  return filter;
};

export const getPlacements = async (req, res) => {
  const response = await paginatedResponse(Placement, placementFilter(req.query), req.query, { placedDate: -1 });
  res.json(response);
};

export const getPlacement = async (req, res) => {
  const placement = await Placement.findById(req.params.id);
  if (!placement) return res.status(404).json({ message: "Placement not found" });
  res.json(placement);
};

export const createPlacement = async (req, res) => {
  const documents = await uploadDocumentFields(req.files, "aiml_portal/placements");
  const placement = await Placement.create({ ...normalizePlacementBody(req.body), ...documents });
  res.status(201).json(placement);
};

export const updatePlacement = async (req, res) => {
  const placement = await Placement.findById(req.params.id);
  if (!placement) return res.status(404).json({ message: "Placement not found" });

  const documents = await uploadDocumentFields(req.files, "aiml_portal/placements");
  Object.assign(placement, normalizePlacementBody(req.body), documents);
  applyRemovedDocuments(placement, req.body.removeDocuments);
  await placement.save();

  res.json(placement);
};

export const deletePlacement = async (req, res) => {
  const placement = await Placement.findByIdAndDelete(req.params.id);
  if (!placement) return res.status(404).json({ message: "Placement not found" });
  res.json({ message: "Placement deleted" });
};

export const getPlacementStats = async (_req, res) => {
  const [overview, byYear, byCompany] = await Promise.all([
    Placement.aggregate([
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          highestPackage: { $max: "$packageLpa" },
          averagePackage: { $avg: "$packageLpa" }
        }
      }
    ]),
    Placement.aggregate([
      {
        $group: {
          _id: "$academicYear",
          count: { $sum: 1 },
          averagePackage: { $avg: "$packageLpa" }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    Placement.aggregate([
      { $group: { _id: "$company", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ])
  ]);

  res.json({
    overview: overview[0] || { totalStudents: 0, highestPackage: 0, averagePackage: 0 },
    byYear,
    byCompany
  });
};
