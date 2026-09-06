import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

type Location = { country: string; city: string };
type Prayer = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";
type Day = { timings: Record<Prayer, string>; date: { gregorian: { day: string; date: string } }; meta: { timezone: string; method: { name: string } } };
const prayers: Prayer[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const countries: Location[] = [
  { country: "Bhutan", city: "Thimphu" }, { country: "Nepal", city: "Kathmandu" },
  { country: "Myanmar", city: "Yangon" }, { country: "India", city: "New Delhi" },
  { country: "Laos", city: "Vientiane" }, { country: "Thailand", city: "Bangkok" },
  { country: "Vietnam", city: "Hanoi" }, { country: "Pakistan", city: "Islamabad" },
  { country: "Cambodia", city: "Phnom Penh" }, { country: "Sri Lanka", city: "Colombo" },
  { country: "Bangladesh", city: "Dhaka" }, { country: "Saudi Arabia", city: "Makkah" },
  { country: "United Arab Emirates", city: "Dubai" }, { country: "Malaysia", city: "Kuala Lumpur" },
  { country: "Indonesia", city: "Jakarta" }, { country: "Turkey", city: "Istanbul" },
  { country: "United Kingdom", city: "London" }, { country: "United States", city: "New York" },
  { country: "Egypt", city: "Cairo" }, { country: "Australia", city: "Sydney" },
];
const popular: Location[] = [
  { country: "Bangladesh", city: "Dhaka" }, { country: "Saudi Arabia", city: "Makkah" },
  { country: "Saudi Arabia", city: "Madinah" }, { country: "United Arab Emirates", city: "Dubai" },
  { country: "Pakistan", city: "Karachi" }, { country: "United Kingdom", city: "London" },
  { country: "Turkey", city: "Istanbul" }, { country: "Malaysia", city: "Kuala Lumpur" },
  { country: "Indonesia", city: "Jakarta" }, { country: "United States", city: "New York" },
  { country: "Bangladesh", city: "Chattogram" }, { country: "Saudi Arabia", city: "Riyadh" },
  { country: "Qatar", city: "Doha" }, { country: "Singapore", city: "Singapore" },
  { country: "Canada", city: "Toronto" }, { country: "Australia", city: "Sydney" },
];
function today() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dhaka", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date());
  return ["year", "month", "day"].map(type => parts.find(part => part.type === type)?.value).join("-");
}
function timeLabel(value: string) {
  const match = /^(\d{2}):(\d{2})/.exec(value);
  if (!match) return "Unavailable";
  const hours = Number(match[1]);
  return String(hours % 12 || 12).padStart(2, "0") + ":" + match[2] + (hours < 12 ? " AM" : " PM");
}
export default function PrayerTimetable() {
  const [location, setLocation] = useState<Location>({ country: "Bangladesh", city: "Dhaka" });
  const [date, setDate] = useState(today);
  const [visibleDays, setVisibleDays] = useState(10);
  const [directory, setDirectory] = useState("country");
  const [allLocations, setAllLocations] = useState(false);
  const [retry, setRetry] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const [year, month, day] = date.split("-").map(Number);
  const key = JSON.stringify([location, year, month, retry]);
  const [state, setState] = useState<{ key: string; days?: Day[]; error?: boolean }>({ key: "" });
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 20000);
    const params = new URLSearchParams({ city: location.city, country: location.country, school: "0" });
    if (location.city === "Dhaka") params.set("method", "1");
    fetch("https://api.aladhan.com/v1/calendarByCity/" + year + "/" + month + "?" + params, { signal: controller.signal }).then(async response => {
      const result = await response.json();
      if (!response.ok || result.code !== 200 || !Array.isArray(result.data) || !result.data.length || !result.data.every((item: Day) => item.date?.gregorian?.day && prayers.every(prayer => typeof item.timings?.[prayer] === "string"))) throw new Error("Invalid timetable");
      if (active) setState({ key, days: result.data });
    }).catch(() => { if (active) setState({ key, error: true }); }).finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [location, year, month, key]);
  const data = state.key === key ? state.days : undefined;
  const remainingDays = data?.filter(item => Number(item.date.gregorian.day) >= day) ?? [];
  const changeDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    const parsed = new Date(value + "T12:00:00Z");
    if (!Number.isFinite(parsed.getTime()) || parsed.getUTCFullYear() < 1900 || parsed.getUTCFullYear() > 2100) return;
    setDate(value); setVisibleDays(10);
  };
  const move = (offset: number) => { const next = new Date(date + "T12:00:00Z"); next.setUTCDate(next.getUTCDate() + offset); changeDate(next.toISOString().slice(0, 10)); };
  const locations = directory === "country" ? countries : popular;
  return <section className="mt-20 grid items-start gap-10 lg:grid-cols-2" aria-label="Prayer timetable and worldwide locations">
    <div ref={tableRef} className="min-w-0 scroll-mt-28">
      <div className="mb-7 flex items-center justify-center gap-3"><button type="button" aria-label="Previous day" onClick={() => move(-1)} className="rounded-full p-2 text-white/60 hover:bg-white/10"><ChevronLeft size={20} /></button><input type="date" aria-label="Timetable start date" min="1900-01-01" max="2100-12-31" value={date} onChange={event => changeDate(event.target.value)} className="rounded-full border border-white/15 bg-[#111811] px-4 py-2 text-sm text-white [color-scheme:dark] focus:outline-2 focus:outline-[#8cc66b]" /><button type="button" aria-label="Next day" onClick={() => move(1)} className="rounded-full p-2 text-white/60 hover:bg-white/10"><ChevronRight size={20} /></button></div>
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">Prayer Timetable {location.city}, {location.country}</h2><p className="mt-4 text-center text-sm text-white/55">Muslim Prayer Times for {new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date + "T12:00:00Z"))}</p>
      <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">{state.key !== key ? <p role="status" className="py-20 text-center text-white/60">Loading live prayer times...</p> : state.error ? <div className="p-8 text-center"><p role="alert">Timings are temporarily unavailable for this location.</p><button onClick={() => setRetry(value => value + 1)} className="mt-4 text-[#8cc66b] underline">Try again</button></div> : <div className="overflow-x-auto"><table className="w-full min-w-[460px] text-center text-xs"><caption className="sr-only">Prayer times from {date} in {location.city}</caption><thead className="bg-[#427f32] text-white"><tr><th scope="col" className="px-2 py-4">Date</th>{prayers.map(prayer => <th scope="col" key={prayer} className="px-2 py-4">{prayer}</th>)}</tr></thead><tbody>{remainingDays.slice(0, visibleDays).map(item => <tr key={item.date.gregorian.date} className={"border-t border-white/10 " + (Number(item.date.gregorian.day) === day ? "bg-white/[0.05]" : "bg-white/[0.02]")}><th scope="row" className="px-2 py-3 font-medium">{Number(item.date.gregorian.day)}</th>{prayers.map(prayer => <td key={prayer} className="whitespace-nowrap px-2 py-3 tabular-nums">{timeLabel(item.timings[prayer])}</td>)}</tr>)}</tbody></table>{!remainingDays.length && <p className="p-8 text-center text-sm">No timings available for the selected date.</p>}</div>}</div>
      {data && <><div className="mt-4 flex items-center justify-between gap-3 text-xs"><p className="text-white/50">{Math.min(visibleDays, remainingDays.length)} of {remainingDays.length} remaining days</p>{remainingDays.length > 10 && <button onClick={() => setVisibleDays(visibleDays >= remainingDays.length ? 10 : remainingDays.length)} className="rounded-lg px-3 py-2 font-semibold text-[#8cc66b] hover:bg-white/5">{visibleDays >= remainingDays.length ? "Show Less" : "Show More"}</button>}</div><p className="mt-3 text-[10px] leading-4 text-white/45">Local time: {data[0]?.meta.timezone}. {data[0]?.meta.method.name}; Standard Asr.</p></>}
    </div>
    <div className="min-w-0"><div className="mx-auto mb-7 grid max-w-xs grid-cols-2 rounded-full bg-white/[0.04] p-1">{[["country", "Country"], ["popular", "Popular"]].map(([value, label]) => <button key={value} type="button" aria-pressed={directory === value} onClick={() => { setDirectory(value); setAllLocations(false); }} className={"rounded-full px-5 py-2 text-sm " + (directory === value ? "bg-black/35 font-semibold text-white" : "text-white/50")}>{label}</button>)}</div><h2 className="text-center text-2xl font-semibold sm:text-3xl">{directory === "country" ? "Prayer Timings By Country" : "Popular Prayer Locations"}</h2><p className="mt-4 text-center text-sm text-white/55">Worldwide Islamic Prayer Timings</p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">{locations.slice(0, allLocations ? locations.length : 10).map(item => { const selected = location.city === item.city && location.country === item.country; return <button key={item.city + item.country} type="button" aria-pressed={selected} onClick={() => { setLocation(item); setVisibleDays(10); tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }} className={"flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition focus-visible:outline-2 focus-visible:outline-[#8cc66b] " + (selected ? "border-[#8cc66b]/50 bg-[#427f32]/15" : "border-white/10 hover:border-[#8cc66b]/35 hover:bg-white/[0.03]")}><MapPin size={24} aria-hidden="true" className="shrink-0 text-[#569b40]" /><span><span className="block text-[10px] text-white/50">Prayer Times</span><strong className="mt-1 block text-sm font-medium">{directory === "country" ? item.country : item.city}</strong><span className="mt-1 block text-[10px] text-white/45">{directory === "country" ? item.city : item.country}</span></span></button>; })}</div>
      <div className="mt-4 flex justify-end"><button type="button" onClick={() => setAllLocations(value => !value)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:text-[#8cc66b]">{allLocations ? "Show Less" : "Show More"}<ArrowRight size={16} /></button></div><p className="mt-3 text-[10px] leading-4 text-white/45">Select a location to update the timetable. Each country opens the city shown; prayer times vary by city.</p>
    </div>
  </section>;
}
