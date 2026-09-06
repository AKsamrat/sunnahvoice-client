import { useEffect, useState } from "react";
import { Moon, Sun, Sunrise, Sunset, Clock3, CloudSun } from "lucide-react";
import { FaMosque } from "react-icons/fa";
import DhakaWeather from "./DhakaWeather";

type Timings = Record<"Fajr" | "Sunrise" | "Dhuhr" | "Asr" | "Maghrib" | "Isha", string>;
type PrayerDay = { timings: Timings; date: { hijri: { day: string; month: { en: string }; year: string } } };

const timeZone = "Asia/Dhaka";

function dhakaDate(date: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(date);

  return ["day", "month", "year"]
    .map((type) => parts.find((part) => part.type === type)?.value)
    .join("-");
}

function minutes(time: string) {
  const [hours, mins] = time.slice(0, 5).split(":").map(Number);

  return hours * 60 + mins;
}

function clockLabel(time: string | number) {
  const value = ((typeof time === "number" ? Math.round(time) : minutes(time)) % 1440 + 1440) % 1440;

  return (
    String(Math.floor(value / 60) % 12 || 12).padStart(2, "0") +
    ":" +
    String(value % 60).padStart(2, "0") +
    (value < 720 ? " AM" : " PM")
  );
}

async function getDay(date: string, signal: AbortSignal): Promise<PrayerDay> {
  const response = await fetch(
    "https://api.aladhan.com/v1/timingsByCity/" +
      date +
      "?city=Dhaka&country=Bangladesh&method=1&school=0",
    { signal }
  );

  if (!response.ok) {
    throw new Error("Prayer times unavailable");
  }

  const result = await response.json();

  if (
    result.code !== 200 ||
    !result.data?.date?.hijri ||
    !["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].every((name) =>
      /^([01]\d|2[0-3]):[0-5]\d/.test(result.data?.timings?.[name] ?? "")
    )
  ) {
    throw new Error("Invalid prayer times");
  }

  return result.data;
}

export default function PrayerTimesCard({ expanded = false }: { expanded?: boolean }) {
  const [now, setNow] = useState(() => new Date());
  const [retry, setRetry] = useState(0);
  const [tab, setTab] = useState(0);

  const tabs = ["Daily Prayers", "Other Times", "Current Time", "Weather"];
  const tabIcons = [FaMosque, Sunrise, Clock3, CloudSun];

  const date = dhakaDate(now);
  const yesterday = dhakaDate(new Date(now.getTime() - 86400000));
  const tomorrow = dhakaDate(new Date(now.getTime() + 86400000));
  const key = date + ":" + retry;

  const [state, setState] = useState<{ key: string; today?: PrayerDay; nextFajr?: string; previousSunset?: string; error?: boolean }>({ key: "" });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 15000);

    Promise.all([
      getDay(date, controller.signal),
      getDay(tomorrow, controller.signal),
      getDay(yesterday, controller.signal),
    ])
      .then(([today, next, previous]) => {
        if (active) {
          setState({
            key,
            today,
            nextFajr: next.timings.Fajr,
            previousSunset: previous.timings.Maghrib,
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({ key, error: true });
        }
      })
      .finally(() => window.clearTimeout(timeout));

    return () => {
      active = false;
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [date, tomorrow, yesterday, key]);

  const ready = state.key === key && state.today && state.nextFajr;
  const hijri = ready ? state.today?.date.hijri : undefined;

  const currentMinutes = minutes(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(now)
  );

  const timings = state.today?.timings;

  const rows =
    ready && timings
      ? [
          { name: "Fajr", start: timings.Fajr, end: timings.Sunrise, icon: Sunrise },
          { name: "Dhuhr", start: timings.Dhuhr, end: timings.Asr, icon: Sun },
          { name: "Asr", start: timings.Asr, end: timings.Maghrib, icon: Sun },
          { name: "Maghrib", start: timings.Maghrib, end: timings.Isha, icon: Sunset },
          { name: "Isha", start: timings.Isha, end: state.nextFajr!, icon: Moon },
        ]
      : [];

  const otherRows =
    ready && timings && state.previousSunset
      ? [
          {
            name: "Sehri ends",
            start: 0,
            end: minutes(timings.Fajr),
            label: clockLabel(timings.Fajr),
            icon: Sunrise,
          },
          {
            name: "Iftar",
            start: minutes(timings.Maghrib),
            end: minutes(timings.Isha),
            label: clockLabel(timings.Maghrib),
            icon: Sunset,
          },
          {
            name: "Tahajjud",
            start: Math.round(
              minutes(timings.Fajr) -
                (1440 - minutes(state.previousSunset) + minutes(timings.Fajr)) / 3
            ),
            end: minutes(timings.Fajr),
            label: "",
            icon: Moon,
          },
          {
            name: "Ishraq",
            start: minutes(timings.Sunrise) + 15,
            end: minutes(timings.Sunrise) + 30,
            label: "",
            icon: Sunrise,
          },
          {
            name: "Salatul Duha",
            start: minutes(timings.Sunrise) + 30,
            end: minutes(timings.Dhuhr) - 20,
            label: "",
            icon: Sun,
          },
        ]
      : [];

  const upcoming = rows.find((row) => minutes(row.start) > currentMinutes);
  const nextName = upcoming?.name ?? "Fajr";
  const nextMinutes = upcoming ? minutes(upcoming.start) : state.nextFajr ? minutes(state.nextFajr) + 1440 : 0;

  const seconds = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone,
      second: "2-digit",
    }).format(now)
  );

  const remaining = Math.max(0, (nextMinutes - currentMinutes) * 60 - seconds);

  const countdown = [
    Math.floor(remaining / 3600),
    Math.floor(remaining / 60) % 60,
    remaining % 60,
  ]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");

  const currentPrayer =
    rows.find(
      (row) =>
        currentMinutes >= minutes(row.start) &&
        (row.name === "Isha" || currentMinutes < minutes(row.end))
    )?.name ??
    (timings && currentMinutes < minutes(timings.Fajr)
      ? "Isha"
      : "Between prayers");

  return (
    <div className={expanded ? "grid items-start gap-7 lg:grid-cols-[0.75fr_1.25fr]" : "w-full min-w-0"}>
      {expanded && (
        <div className="flex flex-col gap-6 text-emerald-50 lg:min-h-0 lg:self-stretch lg:gap-4 lg:[contain:size]">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-5">
            <div className="text-center">
              <p className="text-sm text-emerald-50/60">
                Current Prayer
              </p>

              <h2 className="mt-4 text-4xl font-bold text-[#8cc66b] lg:mt-2 lg:text-3xl">
                {ready ? currentPrayer : "--"}
              </h2>

              <p className="mt-5 text-sm lg:mt-3">
                {ready ? "Next: " + nextName : "Loading prayer information"}
              </p>

              <p className="mt-4 text-4xl font-bold tabular-nums sm:text-5xl lg:text-4xl">
                {ready ? countdown : "--:--:--"}
              </p>

              <p className="mt-2 text-xs text-emerald-50/50">
                Time until the next prayer begins
              </p>
            </div>

            <div className="mt-7 border-t border-white/10 pt-6 lg:mt-4 lg:pt-4">
              <h3 className="mb-5 text-lg font-semibold lg:mb-3">
                Prayer Information
              </h3>

              <dl className="space-y-4 text-sm lg:space-y-2">
                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-50/60">
                    Calculation Method
                  </dt>

                  <dd>
                    Karachi
                  </dd>
                </div>

                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-50/60">
                    Asr calculation
                  </dt>

                  <dd>
                    Standard
                  </dd>
                </div>

                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-50/60">
                    Time Zone
                  </dt>

                  <dd>
                    Asia/Dhaka (UTC+6)
                  </dd>
                </div>

                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-50/60">
                    Today's Date
                  </dt>

                  <dd className="text-right">
                    {new Intl.DateTimeFormat("en-US", {
                      timeZone,
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(now)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:shrink-0 lg:p-5">
            <h3 className="text-lg font-semibold">
              Forbidden Prayer Times
            </h3>

            {ready && timings ? (
              <dl className="mt-5 space-y-4 text-xs sm:text-sm lg:mt-3 lg:space-y-2">
                {[
                  [
                    "After Sunrise",
                    minutes(timings.Sunrise),
                    minutes(timings.Sunrise) + 15,
                  ],
                  [
                    "Zawal",
                    minutes(timings.Dhuhr) - 6,
                    minutes(timings.Dhuhr),
                  ],
                  [
                    "Before Sunset",
                    minutes(timings.Maghrib) - 15,
                    minutes(timings.Maghrib),
                  ],
                ].map(([name, start, end]) => (
                  <div key={name} className="flex justify-between gap-3">
                    <dt className="text-emerald-50/60">
                      {name}
                    </dt>

                    <dd className="text-right tabular-nums">
                      {clockLabel(Number(start))} - {clockLabel(Number(end))}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-emerald-50/60">
                {state.error
                  ? "Timings unavailable. Retry in Daily Prayers."
                  : "Loading timings..."}
              </p>
            )}

            <p className="mt-5 text-[10px] leading-4 text-emerald-50/50 lg:mt-3">
              Approximate caution windows: 15 minutes after sunrise, 6 minutes
              before Dhuhr, and 15 minutes before sunset. Confirm local guidance
              for your practice.
            </p>
          </section>
        </div>
      )}

      <aside aria-label="Dhaka prayer times, clock and weather" className="relative isolate w-full min-w-0 overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-white/[0.14] via-emerald-950/50 to-emerald-950/70 text-emerald-50 shadow-[0_24px_80px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-2xl">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.12),transparent_55%)]" />

        <div
          role="tablist"
          aria-label="Prayer and local information"
          className="grid grid-cols-4 border-b border-white/15 bg-white/[0.04]"
          onKeyDown={(event) => {
            const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];

            if (!keys.includes(event.key)) {
              return;
            }

            event.preventDefault();

            const next =
              event.key === "Home"
                ? 0
                : event.key === "End"
                  ? 3
                  : (tab + (event.key === "ArrowRight" ? 1 : 3)) % 4;

            setTab(next);

            event.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
          }}
        >
          {tabs.map((name, index) => {
            const Icon = tabIcons[index];

            return (
              <button key={name} id={"prayer-tab-" + index} type="button" role="tab" aria-selected={tab === index} aria-controls={"prayer-panel-" + index} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} className={"flex min-w-0 flex-col items-center justify-center gap-2 border-b-2 px-1 py-4 text-[10px] font-medium transition focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#8cc66b] sm:text-xs " + (tab === index ? "border-[#a9d98c] bg-white/[0.08] text-[#b8e49f]" : "border-transparent text-emerald-50/65 hover:bg-white/5 hover:text-white")}>
                <Icon size={17} aria-hidden="true" />
                {name}
              </button>
            );
          })}
        </div>

        <div id={"prayer-panel-" + tab} role="tabpanel" aria-labelledby={"prayer-tab-" + tab} tabIndex={0} className="min-h-[490px] p-5 focus-visible:outline-none sm:p-7">
          {tab !== 3 && (
            <div className="flex items-start justify-between gap-3 border-b border-white/10 pb-5">
              <div>
                {tab === 1 ? (
                  <span aria-hidden="true" className="mb-3 block text-4xl">
                    &#x1F4FF;
                  </span>
                ) : tab === 2 ? (
                  <Clock3 aria-hidden="true" className="mb-4 text-[#69a34e]" size={36} />
                ) : tab === 3 ? (
                  <CloudSun aria-hidden="true" className="mb-4 text-[#69a34e]" size={36} />
                ) : (
                  <FaMosque aria-hidden="true" className="mb-4 text-[#69a34e]" size={36} />
                )}

                <p className="text-xs text-emerald-50/65">
                  {
                    [
                      "Today's Prayer Time",
                      "Fasting & Nafl Prayer Times",
                      "Local Time",
                      "Local Weather",
                    ][tab]
                  }
                </p>

                <h2 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">
                  Dhaka, Bangladesh
                </h2>
              </div>

              <div className="min-w-16 max-w-[40%] text-right" aria-label="Hijri date">
                <strong className="block text-4xl font-bold sm:text-5xl">
                  {hijri?.day ?? "--"}
                </strong>

                <p className="mt-3 text-xs">
                  {hijri?.month.en ?? "Hijri date"}
                </p>

                <p className="mt-1 text-xs text-emerald-50/65">
                  {hijri ? hijri.year + " AH" : "--"}
                </p>
              </div>
            </div>
          )}

          {tab < 2 &&
            !ready &&
            (state.key === key && state.error ? (
              <div role="alert" className="py-12 text-center">
                <p className="text-sm">
                  Prayer times are temporarily unavailable.
                </p>

                <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-4 rounded-full border border-[#69a34e] px-5 py-2 text-sm">
                  Try again
                </button>
              </div>
            ) : (
              <p role="status" className="py-16 text-center text-sm text-emerald-50/65">
                Loading today's prayer times...
              </p>
            ))}

          {tab === 0 && ready && (
            <table className="mt-4 w-full table-fixed text-sm">
              <caption className="sr-only">
                Prayer timetable for {date}, Dhaka time.
              </caption>

              <thead>
                <tr className="text-[10px] text-emerald-50/65 sm:text-xs">
                  <th scope="col" className="w-[34%] py-3 text-left">
                    <span className="sr-only">
                      Prayer
                    </span>
                  </th>

                  <th scope="col" className="py-3 text-right font-normal">
                    Prayer Start
                  </th>

                  <th scope="col" className="py-3 text-right font-normal">
                    Prayer End
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => {
                  const Icon = row.icon;

                  const active =
                    currentMinutes >= minutes(row.start) &&
                    (row.name === "Isha" || currentMinutes < minutes(row.end));

                  return (
                    <tr key={row.name} className={active ? "text-[#8cc66b]" : ""}>
                      <th scope="row" className="py-2.5 text-left font-semibold">
                        <span className="flex items-center gap-2 uppercase text-[17px]">
                          <Icon size={17} aria-hidden="true" className="shrink-0 text-[#69a34e]" />

                          {row.name}

                          {active && (
                            <span className="sr-only">
                              {" "}
                              (current period)
                            </span>
                          )}
                        </span>
                      </th>

                      <td className="py-3.5 text-right text-xs tabular-nums sm:text-sm">
                        {clockLabel(row.start)}
                      </td>

                      <td className="py-3.5 text-right text-xs tabular-nums sm:text-sm">
                        {clockLabel(row.end)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {tab === 1 && ready && (
            <dl className="mt-3">
              {otherRows.map((row) => {
                const Icon = row.icon;
                const active = currentMinutes >= row.start && currentMinutes < row.end;

                return (
                  <div key={row.name} className={"flex items-center justify-between gap-2 py-4 " + (active ? "text-[#8cc66b]" : "")}>
                    <dt className="flex items-center gap-2 text-sm font-semibold">
                      <Icon size={17} aria-hidden="true" className="shrink-0 text-[#69a34e]" />

                      {row.name}
                    </dt>

                    <dd className="text-right text-xs tabular-nums sm:text-sm">
                      {row.label ||
                        clockLabel(row.start) +
                          " - " +
                          clockLabel(row.end)}
                    </dd>
                  </div>
                );
              })}
            </dl>
          )}

          {tab === 2 && (
            <div className="py-8 text-center">
              <p className="text-xs uppercase tracking-widest text-[#8cc66b]">
                Bangladesh Standard Time
              </p>

              <time dateTime={now.toISOString()} className="mt-5 block text-4xl font-semibold tabular-nums sm:text-5xl">
                {new Intl.DateTimeFormat("en-US", {
                  timeZone,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }).format(now)}
              </time>

              <p className="mt-4 text-sm text-emerald-50/65">
                {new Intl.DateTimeFormat("en-GB", {
                  timeZone,
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).format(now)}
              </p>

              <p className="mt-2 text-xs text-emerald-50/65">
                Asia/Dhaka &middot; UTC+06:00
              </p>

              {ready && (
                <div className="mt-7 rounded-xl border border-white/20 bg-white/[0.07] p-5">
                  <p className="text-sm">
                    Next prayer:{" "}
                    <strong className="text-[#8cc66b]">
                      {nextName}
                    </strong>
                  </p>

                  <p className="mt-2 text-3xl font-semibold tabular-nums">
                    {countdown}
                  </p>

                  <p className="mt-1 text-xs text-emerald-50/65">
                    Hours : Minutes : Seconds
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 3 && (
            <DhakaWeather />
          )}

          {tab < 2 && (
            <p className="mt-4 border-t border-white/10 pt-3 text-[10px] leading-4 text-emerald-50/65">
              Karachi calculation &middot; Standard Asr.

              <br />

              {tab === 0
                ? "End times use sunrise or the next prayer; Isha uses tomorrow's Fajr."
                : "Suggested windows: Tahajjud is the last third of sunset-to-Fajr; Ishraq is sunrise +15 to +30 min; Duha is sunrise +30 min to Dhuhr -20 min."}

              {" "}Hijri dates may vary with local moon sighting.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}