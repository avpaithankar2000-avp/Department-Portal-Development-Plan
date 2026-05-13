import Achievement from "../models/Achievement.js";
import { buildSearchFilter, paginatedResponse } from "../utils/queryHelpers.js";
import  uploadImage  from "../utils/uploadImage.js";

const achievementFilter = (query) => {
  const filter = buildSearchFilter(query, ["title", "description", "achieverName", "category"]);

  if (query.achieverType) filter.achieverType = query.achieverType;
  if (query.category) filter.category = query.category;

  return filter;
};

export const getAchievements = async (req, res) => {
  const response = await paginatedResponse(Achievement, achievementFilter(req.query), req.query, { awardDate: -1 });
  res.json(response);
};

export const getAchievement = async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (!achievement) return res.status(404).json({ message: "Achievement not found" });
  res.json(achievement);
};

export const createAchievement = async (req, res) => {
  const image = await uploadImage(req.file, "aiml-portal/achievements");
  const achievement = await Achievement.create({ ...req.body, image: image || undefined });
  res.status(201).json(achievement);
};

export const updateAchievement = async (req, res) => {
  const achievement = await Achievement.findById(req.params.id);
  if (!achievement) return res.status(404).json({ message: "Achievement not found" });

  const image = await uploadImage(req.file, "aiml-portal/achievements");
  Object.assign(achievement, req.body);
  if (image) achievement.image = image;
  await achievement.save();
  res.json(achievement);
};

export const deleteAchievement = async (req, res) => {
  const achievement = await Achievement.findByIdAndDelete(req.params.id);
  if (!achievement) return res.status(404).json({ message: "Achievement not found" });
  res.json({ message: "Achievement deleted" });
};
