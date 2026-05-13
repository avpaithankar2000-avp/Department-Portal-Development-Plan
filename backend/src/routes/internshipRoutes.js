import { body } from "express-validator";
import express from "express";
import {
  createInternship,
  deleteInternship,
  getInternship,
  getInternships,
  updateInternship
} from "../controllers/internshipController.js";
import { protect } from "../middleware/authMiddleware.js";
import { internshipDocumentFields } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const rules = [
  body("studentName").trim().notEmpty().withMessage("Student name is required"),
  body("company").trim().notEmpty().withMessage("Company is required"),
  body("role").trim().notEmpty().withMessage("Role is required"),
  body("mode").optional().isIn(["Remote", "On-site", "Hybrid"]).withMessage("Mode must be On-site, Remote, or Hybrid"),
  body("startDate").isISO8601().withMessage("Valid start date is required"),
  body("academicYear").trim().notEmpty().withMessage("Academic year is required"),
  body("verificationStatus").optional().isIn(["Verified", "Pending", "Rejected"]).withMessage("Invalid verification status")
];

router.route("/").get(getInternships).post(protect, internshipDocumentFields, rules, validate, createInternship);
router.route("/:id").get(getInternship).put(protect, internshipDocumentFields, rules, validate, updateInternship).delete(protect, deleteInternship);

export default router;
