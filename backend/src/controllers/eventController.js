import Event from "../models/Event.js";
import { buildSearchFilter, paginatedResponse } from "../utils/queryHelpers.js";
import  uploadImage  from "../utils/uploadImage.js";

const eventFilter = (query) => {
  const filter = buildSearchFilter(query, ["title", "description", "venue", "organizer", "category"]);

  if (query.category) filter.category = query.category;
  if (query.from || query.to) {
    filter.date = {};
    if (query.from) filter.date.$gte = new Date(query.from);
    if (query.to) filter.date.$lte = new Date(query.to);
  }

  return filter;
};

export const getEvents = async (req, res) => {
  const response = await paginatedResponse(Event, eventFilter(req.query), req.query, { date: -1 });
  res.json(response);
};

export const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
};

export const createEvent = async (req, res) => {
  const image = await uploadImage(req.file, "aiml-portal/events");
  const event = await Event.create({ ...req.body, image: image || undefined });
  res.status(201).json(event);
};

export const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const image = await uploadImage(req.file, "aiml-portal/events");
  Object.assign(event, req.body);
  if (image) event.image = image;
  await event.save();
  res.json(event);
};

export const deleteEvent = async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json({ message: "Event deleted" });
};
