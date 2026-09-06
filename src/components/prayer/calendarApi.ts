export type CalendarDay = {
  hijri: { day: string; month: { number: number; en: string }; year: string; date: string };
  gregorian: { day: string; month: { number: number; en: string }; year: string; date: string };
};
export const months = ["Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Ula", "Jumada al-Akhirah", "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"];
export async function calendarRequest<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch("https://api.aladhan.com/v1/" + path, { signal });
  const result = await response.json();
  if (!response.ok || result.code !== 200 || !result.data) throw new Error("Calendar data is temporarily unavailable. Please try again.");
  return result.data;
}
export function gregorianDate(day: CalendarDay) {
  return new Date(Number(day.gregorian.year), day.gregorian.month.number - 1, Number(day.gregorian.day), 12);
}
export function dateLabel(day: CalendarDay) {
  return day.gregorian.day + " " + day.gregorian.month.en + " " + day.gregorian.year;
}
export function shiftedMonth(month: number, year: number, offset: number) {
  const index = year * 12 + month - 1 + offset;
  return { month: (index % 12 + 12) % 12 + 1, year: Math.floor(index / 12) };
}
