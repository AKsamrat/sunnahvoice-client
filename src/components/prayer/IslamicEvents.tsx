import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import { calendarRequest, dateLabel, months, type CalendarDay } from "./calendarApi";

const events = [
  { name: "Isra and Mi'raj", month: 7, day: 27 },
  { name: "Nisfu Sha'ban", month: 8, day: 15 },
  { name: "Ramadan Begins", month: 9, day: 1 },
  { name: "Last ten nights of Ramadan", month: 9, day: 21 },
  { name: "Eid al-Fitr", month: 10, day: 1 },
  { name: "Day of Arafah", month: 12, day: 9 },
  { name: "Eid al-Adha", month: 12, day: 10 },
];

export default function IslamicEvents({ year }: { year: number }) {
  const [retry, setRetry] = useState(0);
  const key = year + ":" + retry;
  const [state, setState] = useState<{ key: string; days?: CalendarDay[]; error?: boolean }>({ key: "" });

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    Promise.all(
      events.map((event) =>
        calendarRequest<CalendarDay>(
          "hToG/" + event.day + "-" + event.month + "-" + year,
          controller.signal
        )
      )
    )
      .then((days) => {
        if (active) {
          setState({ key, days });
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
  }, [year, key]);

  if (state.key !== key) {
    return (
      <p role="status" className="p-6 text-sm text-white/60">
        Loading events for {year} AH...
      </p>
    );
  }

  if (state.error) {
    return (
      <div className="p-6">
        <p role="alert">
          Events are temporarily unavailable.
        </p>

        <button onClick={() => setRetry((value) => value + 1)} className="mt-4 text-[#a9d98c] underline">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="px-5">
      <p className="pt-4 text-xs text-white/50">
        Observances in {year} AH
      </p>

      <ul className="divide-y divide-white/10">
        {events.map((event, index) => (
          <li key={event.name} className="flex items-center gap-3 py-5">
            <Moon size={16} aria-hidden="true" className="shrink-0 text-[#8cc66b]" />

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-[#a9d98c]">
                {event.name}
              </h3>

              <p className="mt-1 text-xs text-white/55">
                {event.day} {months[event.month - 1]}
              </p>
            </div>

            <p className="max-w-28 text-right text-xs text-white/70">
              {state.days?.[index]
                ? dateLabel(state.days[index])
                : "Unavailable"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}