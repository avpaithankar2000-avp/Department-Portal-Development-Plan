export const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }).format(new Date(value))
    : "N/A";

export const moneyLpa = (value) => `${Number(value || 0).toFixed(1)} LPA`;
