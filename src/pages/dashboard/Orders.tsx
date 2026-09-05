import { FileAudio, FileImage, Film, TrendingUp } from "lucide-react";

const sources = [
  { label: "Images", value: "12,480", percent: 78, icon: FileImage },
  { label: "Audio", value: "9,720", percent: 61, icon: FileAudio },
  { label: "Videos", value: "6,210", percent: 39, icon: Film },
];
const countries = [
  ["Bangladesh", "8,420", "29%"],
  ["United Kingdom", "4,810", "17%"],
  ["Malaysia", "3,950", "14%"],
  ["United States", "3,240", "11%"],
  ["Other countries", "8,010", "29%"],
];

export default function Orders() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="grid gap-5 md:grid-cols-3">
        {sources.map((source) => {
          const Icon = source.icon;
          return (
            <article
              key={source.label}
              className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-6"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#eee4cf] text-[#8b6422]">
                  <Icon size={19} />
                </span>
                <TrendingUp size={17} className="text-emerald-600" />
              </div>
              <p className="mt-5 text-sm text-slate-500">
                {source.label} downloads
              </p>
              <strong className="mt-1 block text-3xl">{source.value}</strong>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[#d6a84b]"
                  style={{ width: `${source.percent}%` }}
                />
              </div>
            </article>
          );
        })}
      </div>
      <div className="mt-7 grid gap-7 xl:grid-cols-[1.2fr_.8fr]">
        <article className="rounded-[1.75rem] border border-emerald-950/10 bg-white p-7">
          <h2 className="text-xl font-bold">Downloads over time</h2>
          <p className="mt-1 text-sm text-slate-400">
            Daily completed downloads this month
          </p>
          <div className="mt-9 flex h-72 items-end gap-2">
            {[42, 55, 38, 67, 73, 52, 82, 63, 91, 76, 88, 96, 71, 85].map(
              (height, index) => (
                <div key={index} className="flex h-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-emerald-900/15 hover:bg-[#d6a84b]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ),
            )}
          </div>
        </article>
        <article className="rounded-[1.75rem] border border-emerald-950/10 bg-white p-7">
          <h2 className="text-xl font-bold">Top locations</h2>
          <p className="mt-1 text-sm text-slate-400">
            Downloads by audience country
          </p>
          <div className="mt-6 divide-y divide-emerald-950/[.07]">
            {countries.map(([country, total, share], index) => (
              <div key={country} className="flex items-center gap-4 py-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f0eadc] text-xs font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 text-sm font-semibold">{country}</span>
                <span className="text-sm">{total}</span>
                <span className="w-9 text-right text-xs text-slate-400">
                  {share}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
