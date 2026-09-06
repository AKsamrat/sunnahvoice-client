import { useEffect, useState, type FormEvent } from "react";
import { calendarRequest, dateLabel, months, type CalendarDay } from "./calendarApi";

export default function DateConverter() {
  const [direction, setDirection] = useState("gToH");
  const [request, setRequest] = useState<{ key: string; direction: string; day: number; month: number; year: number } | null>(null);
  const [result, setResult] = useState<{ key: string; day?: CalendarDay; error?: string } | null>(null);

  useEffect(() => {
    if (!request) return;

    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 15000);

    calendarRequest<CalendarDay>(
      request.direction + "/" + request.day + "-" + request.month + "-" + request.year,
      controller.signal
    )
      .then((day) => {
        const original = request.direction === "gToH" ? day.gregorian : day.hijri;

        if (
          Number(original.day) !== request.day ||
          original.month.number !== request.month ||
          Number(original.year) !== request.year
        ) {
          throw new Error("This date does not exist in the selected calendar.");
        }

        if (active) {
          setResult({ key: request.key, day });
        }
      })
      .catch((error) => {
        if (active) {
          setResult({
            key: request.key,
            error:
              error instanceof Error && error.name !== "AbortError"
                ? error.message
                : "Request timed out. Please try again.",
          });
        }
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [request]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    setRequest({
      key: String(Date.now()),
      direction,
      day: Number(form.get("day")),
      month: Number(form.get("month")),
      year: Number(form.get("year")),
    });
  };

  const pending = request && result?.key !== request.key;
  const field = "w-full rounded-xl border border-white/20 bg-[#18221a] px-3 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-[#8cc66b]";

  return (
    <form onSubmit={submit} className="space-y-5 p-6">
      <label className="block text-sm">
        Convert

        <select value={direction} onChange={(event) => { setDirection(event.target.value); setRequest(null); setResult(null); }} className={field + " mt-2"}>
          <option value="gToH">
            Gregorian to Hijri
          </option>

          <option value="hToG">
            Hijri to Gregorian
          </option>
        </select>
      </label>

      <div key={direction} className="grid grid-cols-[65px_1fr_85px] gap-2">
        <label className="text-xs">
          Day

          <input name="day" type="number" min="1" max={direction === "gToH" ? 31 : 30} required className={field + " mt-2"} />
        </label>

        <label className="text-xs">
          Month

          <select name="month" required className={field + " mt-2"}>
            {(direction === "hToG"
              ? months
              : Array.from({ length: 12 }, (_, index) =>
                  new Date(2026, index, 1).toLocaleString("en", {
                    month: "long",
                  })
                )
            ).map((month, index) => (
              <option key={month} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs">
          Year

          <input name="year" type="number" min={direction === "gToH" ? 1900 : 1300} max={direction === "gToH" ? 2100 : 1525} required className={field + " mt-2"} />
        </label>
      </div>

      <button disabled={!!pending} className="w-full rounded-xl bg-[#427f32] px-5 py-3 font-semibold text-white disabled:opacity-50">
        {pending ? "Converting..." : "Convert date"}
      </button>

      {result?.key === request?.key && result?.error && (
        <p role="alert" className="text-sm text-red-300">
          {result.error}
        </p>
      )}

      {result?.key === request?.key && result?.day && (
        <div role="status" className="rounded-xl border border-[#8cc66b]/30 bg-[#8cc66b]/10 p-5">
          <p className="text-lg font-semibold text-[#a9d98c]">
            {direction === "gToH"
              ? result.day.hijri.day +
                " " +
                result.day.hijri.month.en +
                " " +
                result.day.hijri.year +
                " AH"
              : dateLabel(result.day)}
          </p>
        </div>
      )}
    </form>
  );
}