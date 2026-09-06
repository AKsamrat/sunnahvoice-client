import { useEffect, useState } from "react";
import { Cloud, CloudFog, CloudLightning, CloudRain, CloudSun, Moon, Snowflake, Sun } from "lucide-react";

type Weather = {
  current: { time: string; temperature_2m: number | null; apparent_temperature: number | null; relative_humidity_2m: number | null; wind_speed_10m: number | null; surface_pressure: number | null; weather_code: number | null; is_day: number };
  hourly: { time: string[]; visibility: (number | null)[]; uv_index: (number | null)[] };
  daily: { time: string[]; temperature_2m_max: (number | null)[]; temperature_2m_min: (number | null)[]; weather_code: (number | null)[]; sunrise: string[]; sunset: string[] };
};
const endpoint = "https://api.open-meteo.com/v1/forecast?latitude=23.8103&longitude=90.4125&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,surface_pressure,weather_code,is_day&hourly=visibility,uv_index&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&wind_speed_unit=mph&timezone=Asia%2FDhaka&forecast_days=7";
function condition(code: number | null, day = true) {
  if (code === null) return { icon: Cloud, label: "Conditions unavailable", color: "text-slate-300" };
  if (code === 0 || code === 1) return { icon: day ? Sun : Moon, label: code === 0 ? "Clear" : "Mainly clear", color: "text-amber-400" };
  if (code === 2) return { icon: CloudSun, label: "Partly cloudy", color: "text-amber-300" };
  if (code === 3) return { icon: Cloud, label: "Overcast", color: "text-slate-300" };
  if ([45, 48].includes(code)) return { icon: CloudFog, label: "Fog", color: "text-slate-300" };
  if (code >= 95) return { icon: CloudLightning, label: "Thunderstorms", color: "text-amber-300" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: Snowflake, label: "Snow", color: "text-sky-200" };
  return { icon: CloudRain, label: "Rain / drizzle", color: "text-sky-300" };
}
function number(value: number | null | undefined, suffix = "", digits = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value.toLocaleString("en-US", { maximumFractionDigits: digits }) + suffix : "Unavailable";
}
function localTime(value?: string) {
  if (!value) return "Unavailable";
  const [hours, minutes] = value.slice(11, 16).split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return "Unavailable";
  return String(hours % 12 || 12).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + (hours < 12 ? " AM" : " PM");
}
function uvLabel(value: number | null | undefined) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "Unavailable";
  const level = value < 3 ? "Low" : value < 6 ? "Moderate" : value < 8 ? "High" : value < 11 ? "Very high" : "Extreme";
  return number(value, "", 1) + " " + level;
}
export default function DhakaWeather() {
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState<{ key: number; weather?: Weather; error?: boolean }>({ key: -1 });
  useEffect(() => {
    const timer = window.setInterval(() => setRefresh(value => value + 1), 900000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    fetch(endpoint, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("Weather unavailable");
      const result = await response.json();
      if (typeof result.current?.time !== "string" || !Array.isArray(result.hourly?.time) || !Array.isArray(result.daily?.time) || !["visibility", "uv_index"].every(key => Array.isArray(result.hourly[key])) || !["temperature_2m_max", "temperature_2m_min", "weather_code", "sunrise", "sunset"].every(key => Array.isArray(result.daily[key]))) throw new Error("Invalid weather");
      if (active) setState({ key: refresh, weather: result });
    }).catch(() => { if (active) setState({ key: refresh, error: true }); }).finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [refresh]);
  if (state.key !== refresh) return <p role="status" className="py-16 text-center text-sm text-emerald-50/65">Loading Dhaka weather...</p>;
  if (state.error || !state.weather) return <div role="alert" className="py-12 text-center"><p>Weather is temporarily unavailable.</p><button onClick={() => setRefresh(value => value + 1)} className="mt-4 rounded-full border border-white/25 px-5 py-2 text-sm">Try again</button></div>;
  const { current, daily, hourly } = state.weather;
  const today = daily.time.indexOf(current.time.slice(0, 10));
  const hour = hourly.time.indexOf(current.time.slice(0, 13) + ":00");
  const visibility = hourly.visibility[hour];
  const conditions = condition(current.weather_code, current.is_day === 1);
  const Icon = conditions.icon;
  const details = [
    ["Feels Like", number(current.apparent_temperature, "\u00b0C")],
    ["Wind", number(current.wind_speed_10m, " mph", 1)],
    ["Humidity", number(current.relative_humidity_2m, " %")],
    ["UV Index", uvLabel(hourly.uv_index[hour])],
    ["Pressure", number(current.surface_pressure, " mb")],
    ["Visibility", number(typeof visibility === "number" ? visibility / 1609.344 : null, " mi", 1)],
    ["Sunrise", localTime(daily.sunrise[today])],
    ["Sunset", localTime(daily.sunset[today])],
  ];
  return <div>
    <div className="flex items-end justify-between gap-3 border-b border-white/10 pb-6"><div><Icon size={54} aria-hidden="true" className={"mb-4 " + conditions.color} /><p className="text-xs text-emerald-50/65">Today Weather in</p><h2 className="mt-2 text-3xl font-semibold">Dhaka</h2><p className="mt-2 text-xs text-emerald-50/65">{conditions.label}</p></div><div className="text-right"><strong className="text-4xl font-semibold sm:text-5xl">{number(current.temperature_2m)}<span className="text-2xl">&deg;C</span></strong><p className="mt-4 text-xs text-emerald-50/65">High: {number(daily.temperature_2m_max[today], "\u00b0")} <span className="mx-1">|</span> Low: {number(daily.temperature_2m_min[today], "\u00b0")}</p></div></div>
    <dl className="my-6 grid grid-cols-1 gap-x-5 gap-y-5 min-[420px]:grid-cols-2">{details.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-2 text-xs sm:text-sm"><dt className="text-emerald-50/75">{label}</dt><dd className="text-right font-medium tabular-nums">{value}</dd></div>)}</dl>
    <div className="overflow-x-auto pb-2"><ol aria-label="Seven-day weather forecast" className="grid min-w-[350px] grid-cols-7 gap-1">{daily.time.slice(0, 7).map((date, index) => { const forecast = condition(daily.weather_code[index]); const ForecastIcon = forecast.icon; const label = index === today ? "Today" : new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "Asia/Dhaka" }).format(new Date(date + "T12:00:00+06:00")); return <li key={date} title={date + ": " + forecast.label} className={"flex flex-col items-center gap-4 rounded-2xl px-1 py-4 text-center " + (index === today ? "border border-white/10 bg-white/[0.07]" : "")}><p className="text-[10px] text-emerald-50/65">{label}</p><ForecastIcon size={26} className={forecast.color} aria-hidden="true" /><span className="sr-only">{forecast.label}</span><p className="whitespace-nowrap text-[10px] tabular-nums">{number(daily.temperature_2m_max[index], "\u00b0")}<span className="text-emerald-50/60"> / {number(daily.temperature_2m_min[index], "\u00b0")}</span></p></li>; })}</ol></div>
    <p className="mt-4 text-[10px] leading-4 text-emerald-50/55">Updated {current.time.replace("T", " ")} (Dhaka). Refreshes every 15 minutes. UV and visibility use the matching hourly forecast. <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="underline">Weather data by Open-Meteo</a>.</p>
  </div>;
}
