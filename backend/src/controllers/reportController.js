import { getAnalyticsOverview } from "./analyticsController.js";

export const getReportPayload = async (req, res, next) => {
  req.query = req.query || {};
  return getAnalyticsOverview(req, res, next);
};
