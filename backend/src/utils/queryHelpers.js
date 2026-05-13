export const buildPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const buildSearchFilter = (query, fields) => {
  if (!query.search) return {};

  return {
    $or: fields.map((field) => ({
      [field]: { $regex: query.search, $options: "i" }
    }))
  };
};

export const paginatedResponse = async (model, filter, query, sort = { createdAt: -1 }) => {
  const { page, limit, skip } = buildPagination(query);
  const [items, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter)
  ]);

  return {
    items,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      limit
    }
  };
};
