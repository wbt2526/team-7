export function formatTripDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date to confirm";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getStatusLabel(status) {
  return status || "unknown";
}
