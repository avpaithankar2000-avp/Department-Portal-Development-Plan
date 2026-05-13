import { body } from "express-validator";
import express from "express";
import {
  createAchievement,
  deleteAchievement,
  getAchievement,
  getAchievements,
  updateAchievement
} from "../controllers/achievementController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

const rules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("achieverName").trim().notEmpty().withMessage("Achiever name is required"),
  body("achieverType").isIn(["Student", "Faculty"]).withMessage("Achiever type must be Student or Faculty"),
  body("awardDate").isISO8601().withMessage("Valid award date is required")
];

router.route("/").get(getAchievements).post(protect, upload.single("image"), rules, validate, createAchievement);
router.route("/:id").get(getAchievement).put(protect, upload.single("image"), rules, validate, updateAchievement).delete(protect, deleteAchievement);

export default router;
