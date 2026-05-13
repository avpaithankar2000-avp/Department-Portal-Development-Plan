import express from "express";
import { getReportPayload } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/data", protect, getReportPayload);
router.get("/export/:format", protect, getReportPayload);

export default router;
