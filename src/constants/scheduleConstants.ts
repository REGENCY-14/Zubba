export const SERVICE_FEE = 5;

export const FREQUENCIES = ["One time pickup", "Daily", "Weekly", "Monthly"];

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0"),
);

export const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0"),
);

export const PERIODS = ["AM", "PM"];

export const TIME_PICKER_ITEM_H = 44;

export const frequencyMap: Record<
  string,
  "one_time" | "daily" | "weekly" | "monthly"
> = {
  "One time pickup": "one_time",
  Daily: "daily",
  Weekly: "weekly",
  Monthly: "monthly",
};

export const reverseFrequencyMap: Record<string, string> = {
  one_time: "One time pickup",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export function toLocalDateString(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// `new Date("YYYY-MM-DD")` parses the string as UTC midnight, which then reads
// back as the wrong calendar day through local getters (getDate/getMonth/etc.)
// once the device timezone is behind UTC. Parsing the components directly and
// building a local-midnight Date keeps the calendar day intact everywhere.
export function parseLocalDateString(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const days: { day: number; currentMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--)
    days.push({ day: daysInPrevMonth - i, currentMonth: false });
  for (let d = 1; d <= daysInMonth; d++)
    days.push({ day: d, currentMonth: true });
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++)
    days.push({ day: d, currentMonth: false });
  return days;
}
