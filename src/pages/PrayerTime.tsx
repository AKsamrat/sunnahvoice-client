import PrayerTimetable from "../components/prayer/PrayerTimetable";
import PrayerTimesCard from "../components/home/PrayerTimesCard";
import IslamicCalendar from "../components/prayer/IslamicCalendar";

export default function PrayerTime() {
  return <div className="min-h-screen bg-[#0c130e] px-4 pb-20 pt-28 text-emerald-50 sm:px-6">
    <div className="mx-auto max-w-7xl">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#8cc66b]">Dhaka, Bangladesh</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Prayer Time</h1>
        <p className="mt-3 text-sm text-emerald-50/60">Daily prayers, fasting times and your Islamic calendar in one place.</p>
        </header>
        <PrayerTimesCard expanded />
        <IslamicCalendar />
        <PrayerTimetable />
        </div>
  </div>;
}
