import { body } from "express-validator";
import express from "express";
import {
  createEvent,
  deleteEvent,
  getEvent,
  getEvents,
  updateEvent
} from "../controllers/eventController.js";
import { getDashboardSummary } from "../controllers/dashboardController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const rules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("venue").trim().notEmpty().withMessage("Venue is required"),
  body("date").isISO8601().withMessage("Valid event date is required")
];

router.get("/summary/dashboard", getDashboardSummary);
router.route("/").get(getEvents).post(protect, upload.single("image"), rules, validate, createEvent);
router.route("/:id").get(getEvent).put(protect, upload.single("image"), rules, validate, updateEvent).delete(protect, deleteEvent);

export default router;
