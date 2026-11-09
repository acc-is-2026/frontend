export const formatRuntime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
};

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export const formatWatchedDate = (
  date: string | Date,
  variant: "short" | "long" = "short",
) => {
  const watched = new Date(date);
  const diffDays = Math.round(
    (startOfDay(new Date()) - startOfDay(watched)) / 86_400_000,
  );

  const day =
    diffDays === 0
      ? "Today"
      : diffDays === 1
        ? "Yesterday"
        : watched.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

  if (variant === "short") return day;

  const time = watched.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day} at ${time}`;
};

export const pluralize = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? "" : "s"}`;

export const formatYearRange = (
  firstAirDate?: string,
  lastAirDate?: string | null,
  inProduction?: boolean,
) => {
  const start = firstAirDate?.slice(0, 4);
  if (!start) return undefined;
  if (inProduction) return `${start}–`;

  const end = lastAirDate?.slice(0, 4);
  return end && end !== start ? `${start}–${end}` : start;
};
