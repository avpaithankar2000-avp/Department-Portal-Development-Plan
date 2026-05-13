import Achievement from "../models/Achievement.js";
import Event from "../models/Event.js";
import Internship from "../models/Internship.js";
import Placement from "../models/Placement.js";

export const getDashboardSummary = async (_req, res) => {
  const [events, achievements, internships, placements] = await Promise.all([
    Event.countDocuments(),
    Achievement.countDocuments(),
    Internship.countDocuments(),
    Placement.countDocuments()
  ]);

  res.json({ events, achievements, internships, placements });
};
