export function formatDatetime(dt: string): string {
  if (!dt) return "";
  const [datePart, timePart] = dt.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dateStr = date.toLocaleDateString("en-GB", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return timePart ? `${dateStr}, ${timePart}` : dateStr;
}
