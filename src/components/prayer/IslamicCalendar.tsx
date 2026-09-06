import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DateConverter from "./DateConverter";
import IslamicEvents from "./IslamicEvents";
import { calendarRequest, gregorianDate, months, shiftedMonth, type CalendarDay } from "./calendarApi";

function MonthCalendar({ today }: { today: CalendarDay }) {
  const [selection, setSelection] = useState({ month: today.hijri.month.number, year: Number(today.hijri.year) });
  const [retry, setRetry] = useState(0);
  const [sideTab, setSideTab] = useState("events");
  const key = selection.year + ":" + selection.month + ":" + retry;
  const [state, setState] = useState<{ key: string; days?: CalendarDay[]; current?: CalendarDay[]; error?: boolean }>({ key: "" });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    Promise.all(
      [-1, 0, 1].map((offset) => {
        const month = shiftedMonth(selection.month, selection.year, offset);

        return calendarRequest<CalendarDay[]>(
          "hToGCalendar/" + month.month + "/" + month.year,
          controller.signal
        );
      })
    )
      .then(([previous, current, next]) => {
        if (!current.length) {
          throw new Error("Empty calendar");
        }

        const padding = (gregorianDate(current[0]).getDay() + 1) % 7;

        const days = [
          ...(padding ? previous.slice(-padding) : []),
          ...current,
        ];

        const trailing = (7 - (days.length % 7)) % 7;

        if (active) {
          setState({
            key,
            current,
            days: [...days, ...next.slice(0, trailing)],
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({ key, error: true });
        }
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [selection, key]);

  const ready = state.key === key;
  const field = "rounded-xl border border-white/15 bg-[#151c16] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-[#8cc66b]";
  const move = (offset: number) => setSelection((current) => shiftedMonth(current.month, current.year, offset));

  return (
    <div className="grid items-start gap-7 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="min-w-0">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold">
              {months[selection.month - 1]} {selection.year}
            </h3>

            <p className="mt-2 text-sm text-[#8cc66b]">
              {ready && state.current
                ? state.current[0].gregorian.month.en +
                  " - " +
                  state.current[state.current.length - 1].gregorian.month.en +
                  " " +
                  state.current[state.current.length - 1].gregorian.year
                : "Hijri calendar"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button aria-label="Previous month" onClick={() => move(-1)} className="rounded-lg p-2 hover:bg-white/10">
              <ChevronLeft size={19} />
            </button>

            <select aria-label="Hijri month" className={field} value={selection.month} onChange={(event) => setSelection((current) => ({ ...current, month: Number(event.target.value) }))}>
              {months.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select aria-label="Hijri year" className={field} value={selection.year} onChange={(event) => setSelection((current) => ({ ...current, year: Number(event.target.value) }))}>
              {Array.from(
                new Set([
                  ...Array.from({ length: 21 }, (_, index) => Number(today.hijri.year) - 10 + index),
                  selection.year,
                ])
              )
                .sort((a, b) => a - b)
                .map((year) => (
                  <option key={year}>{year}</option>
                ))}
            </select>

            <button aria-label="Next month" onClick={() => move(1)} className="rounded-lg p-2 hover:bg-white/10">
              <ChevronRight size={19} />
            </button>

            <button onClick={() => setSelection({ month: today.hijri.month.number, year: Number(today.hijri.year) })} className="px-2 text-xs text-[#a9d98c]">
              Today
            </button>
          </div>
        </div>

        {!ready ? (
          <p role="status" className="py-20 text-center text-white/60">
            Loading calendar...
          </p>
        ) : state.error ? (
          <div className="py-20 text-center">
            <p role="alert">Calendar unavailable.</p>

            <button onClick={() => setRetry((value) => value + 1)} className="mt-4 underline">
              Retry
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-white/10">
            <table className="w-full table-fixed text-center">
              <caption className="sr-only">
                {months[selection.month - 1]} {selection.year}. Hijri days above Gregorian dates.
              </caption>

              <thead className="bg-[#427f32]">
                <tr>
                  {["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => (
                    <th key={day} scope="col" className="py-4 text-xs sm:text-sm">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: (state.days?.length ?? 0) / 7 }, (_, week) => (
                  <tr key={week}>
                    {state.days?.slice(week * 7, week * 7 + 7).map((day) => {
                      const isToday = day.gregorian.date === today.gregorian.date;
                      const outside = day.hijri.month.number !== selection.month;

                      return (
                        <td
                          key={day.gregorian.date}
                          aria-current={isToday ? "date" : undefined}
                          className={"border border-white/5 py-4 sm:py-5 " + (isToday ? "bg-[#427f32] font-bold" : outside ? "bg-black/15 text-white/30" : "bg-white/[0.02]")}
                        >
                          <span className="block text-base sm:text-lg">
                            {String(day.hijri.day).padStart(2, "0")}
                          </span>

                          <span className="mt-1 block text-[10px] sm:text-xs">
                            {day.gregorian.day}{" "}
                            {isToday || day.gregorian.day === "01" || day.gregorian.day === "1"
                              ? day.gregorian.month.en.slice(0, 3)
                              : ""}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <aside className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] lg:min-h-0 lg:self-stretch lg:[contain:size]">
        <div className="grid shrink-0 grid-cols-2 border-b border-white/10">
          {[
            ["events", "Islamic Events"],
            ["converter", "Hijri Date Converter"],
          ].map(([value, label]) => (
            <button key={value} aria-pressed={sideTab === value} onClick={() => setSideTab(value)} className={"border-b-2 px-3 py-5 text-sm " + (sideTab === value ? "border-[#8cc66b] text-[#a9d98c]" : "border-transparent text-white/60")}>
              {label}
            </button>
          ))}
        </div>

        <div className="prayer-panel-scroll lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        {sideTab === "events" ? (
          <IslamicEvents year={selection.year} />
        ) : (
          <DateConverter />
        )}
        </div>

        <p className="m-5 shrink-0 rounded-2xl border border-white/10 p-4 text-xs leading-5 text-white/55">
          Dates and observances may vary with local moon sighting. Laylat al-Qadr is sought in the last ten nights; no exact date is asserted.
        </p>
      </aside>
    </div>
  );
}

export default function IslamicCalendar() {
  const [now, setNow] = useState(() => new Date());
  const [retry, setRetry] = useState(0);
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Dhaka", day: "2-digit", month: "2-digit", year: "numeric" }).formatToParts(now);
  const date = ["day", "month", "year"].map((type) => parts.find((part) => part.type === type)?.value).join("-");
  const key = date + ":" + retry;
  const [state, setState] = useState<{ key: string; today?: CalendarDay; error?: boolean }>({ key: "" });

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    calendarRequest<CalendarDay>("gToH/" + date, controller.signal)
      .then((today) => {
        if (active) {
          setState({ key, today });
        }
      })
      .catch(() => {
        if (active) {
          setState({ key, error: true });
        }
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [date, key]);

  const today = state.key === key ? state.today : undefined;

  return (
    <section className="mt-20" aria-label="Islamic calendar">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">
          Islamic Calendar {parts.find((part) => part.type === "year")?.value}
        </h2>

        <p className="mt-4 text-sm text-white/60">
          {today ? today.hijri.day + " " + today.hijri.month.en + " " + today.hijri.year + " AH - " : ""}
          Dhaka, Bangladesh
        </p>
      </header>

      {today ? (
        <MonthCalendar key={date} today={today} />
      ) : state.key === key && state.error ? (
        <div className="text-center">
          <p role="alert">Calendar unavailable.</p>

          <button onClick={() => setRetry((value) => value + 1)} className="mt-4 underline">
            Retry
          </button>
        </div>
      ) : (
        <p role="status" className="py-12 text-center">
          Loading Islamic calendar...
        </p>
      )}
    </section>
  );
}