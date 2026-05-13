import { body } from "express-validator";
import express from "express";
import {
  createPlacement,
  deletePlacement,
  getPlacement,
  getPlacements,
  getPlacementStats,
  updatePlacement
} from "../controllers/placementController.js";
import { protect } from "../middleware/authMiddleware.js";
import { placementDocumentFields } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const rules = [
  body("studentName").trim().notEmpty().withMessage("Student name is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("role").trim().notEmpty().withMessage("Role is required"),
  body("packageLpa").optional().isFloat({ min: 0 }).withMessage("Package must be 0 or more"),
  body("package").optional().isFloat({ min: 0 }).withMessage("Package must be 0 or more"),
  body("academicYear").trim().notEmpty().withMessage("Academic year is required"),
  body("placedDate").optional().isISO8601().withMessage("Valid placed date is required"),
  body("joiningDate").optional().isISO8601().withMessage("Valid joining date is required"),
  body("verificationStatus").optional().isIn(["Verified", "Pending", "Rejected"]).withMessage("Invalid verification status")
];

router.get("/stats/summary", getPlacementStats);
router.route("/").get(getPlacements).post(protect, placementDocumentFields, rules, validate, createPlacement);
router.route("/:id").get(getPlacement).put(protect, placementDocumentFields, rules, validate, updatePlacement).delete(protect, deletePlacement);

export default router;
