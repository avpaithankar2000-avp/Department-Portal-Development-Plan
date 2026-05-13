import Achievement from "../models/Achievement.js";
import Event from "../models/Event.js";
import Internship from "../models/Internship.js";
import Placement from "../models/Placement.js";

const groupBy = (items, key, fallback = "Unknown") =>
  items.reduce((acc, item) => {
    const value = item[key] || fallback;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

const topTechnologies = (internships) => {
  const counts = {};
  internships.forEach((item) => {
    (item.technologiesUsed || []).forEach((tech) => {
      counts[tech] = (counts[tech] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
};

export const getAnalyticsOverview = async (_req, res) => {
  const [events, achievements, internships, placements] = await Promise.all([
    Event.find().lean(),
    Achievement.find().lean(),
    Internship.find().lean(),
    Placement.find().lean()
  ]);

  const stipendValues = internships.map((item) => Number(item.stipend || 0)).filter(Boolean);
  const packageValues = placements.map((item) => Number(item.packageLpa || item.package || 0)).filter(Boolean);

  res.json({
    summary: {
      events: events.length,
      achievements: achievements.length,
      internships: internships.length,
      placements: placements.length,
      averageStipend: stipendValues.length ? stipendValues.reduce((sum, item) => sum + item, 0) / stipendValues.length : 0,
      highestStipend: Math.max(...stipendValues, 0),
      averagePackage: packageValues.length ? packageValues.reduce((sum, item) => sum + item, 0) / packageValues.length : 0,
      highestPackage: Math.max(...packageValues, 0)
    },
    eventsByCategory: groupBy(events, "category"),
    achievementsByType: groupBy(achievements, "achieverType"),
    achievementsByCategory: groupBy(achievements, "category"),
    internshipGrowth: groupBy(internships, "academicYear"),
    internshipModes: groupBy(internships, "mode"),
    topTechnologies: topTechnologies(internships),
    placementGrowth: groupBy(placements, "academicYear"),
    placementTypes: groupBy(placements, "offerType"),
    recruiters: Object.entries(groupBy(placements, "company"))
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
  });
};
