import api from "./client";

export const listResource = (resource, params = {}) => api.get(`/${resource}`, { params }).then((res) => res.data);
export const getResource = (resource, id) => api.get(`/${resource}/${id}`).then((res) => res.data);
const multipartConfig = (hasFile, onProgress) =>
  hasFile
    ? {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (!event.total || !onProgress) return;
          onProgress(Math.round((event.loaded * 100) / event.total));
        }
      }
    : undefined;

export const createResource = (resource, payload, hasFile = false, onProgress) =>
  api.post(`/${resource}`, payload, multipartConfig(hasFile, onProgress)).then((res) => res.data);
export const updateResource = (resource, id, payload, hasFile = false, onProgress) =>
  api.put(`/${resource}/${id}`, payload, multipartConfig(hasFile, onProgress)).then((res) => res.data);
export const deleteResource = (resource, id) => api.delete(`/${resource}/${id}`).then((res) => res.data);

export const getDashboardSummary = () => api.get("/events/summary/dashboard").then((res) => res.data);
export const getPlacementStats = () => api.get("/placements/stats/summary").then((res) => res.data);
export const getAnalyticsOverview = () => api.get("/analytics/overview").then((res) => res.data);
export const getReportData = (params = {}) => api.get("/reports/data", { params }).then((res) => res.data);
