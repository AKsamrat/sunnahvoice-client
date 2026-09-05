import { MoreHorizontal, Search, UserPlus } from "lucide-react";

const users = [
  {
    name: "Aisha Rahman",
    email: "aisha@example.com",
    initials: "AR",
    joined: "Sep 4, 2026",
    saved: 18,
  },
  {
    name: "Omar Faruk",
    email: "omar@example.com",
    initials: "OF",
    joined: "Sep 2, 2026",
    saved: 12,
  },
  {
    name: "Maryam Khan",
    email: "maryam@example.com",
    initials: "MK",
    joined: "Aug 29, 2026",
    saved: 31,
  },
  {
    name: "Yusuf Ahmed",
    email: "yusuf@example.com",
    initials: "YA",
    joined: "Aug 26, 2026",
    saved: 9,
  },
  {
    name: "Fatima Noor",
    email: "fatima@example.com",
    initials: "FN",
    joined: "Aug 21, 2026",
    saved: 24,
  },
];

export default function Users() {
  return (
    <div className="mx-auto max-w-[1500px]">
      <div className="grid gap-5 sm:grid-cols-3">
        {[
          ["Total users", "8,249"],
          ["New this month", "486"],
          ["Active today", "1,204"],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-6"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <strong className="mt-2 block text-3xl">{value}</strong>
          </article>
        ))}
      </div>
      <section className="mt-7 overflow-hidden rounded-[1.75rem] border border-emerald-950/10 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-emerald-950/10 p-5 sm:flex-row sm:items-center">
          <label className="flex h-11 max-w-sm flex-1 items-center gap-3 rounded-full bg-[#f5f3ed] px-4">
            <Search size={16} className="text-slate-400" />
            <input
              placeholder="Search users..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <button className="flex w-fit items-center gap-2 rounded-full bg-emerald-950 px-5 py-3 text-sm font-bold text-white">
            <UserPlus size={17} />
            Add user
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-[#f8f6f0] text-[10px] uppercase tracking-[.16em] text-slate-400">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-5 py-4">Joined</th>
                <th className="px-5 py-4">Saved media</th>
                <th className="px-5 py-4">Status</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/[.07]">
              {users.map((user) => (
                <tr key={user.email}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-emerald-950 text-xs font-bold text-[#e2bd69]">
                        {user.initials}
                      </span>
                      <div>
                        <strong className="block text-sm">{user.name}</strong>
                        <span className="text-xs text-slate-400">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-500">
                    {user.joined}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold">
                    {user.saved}
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                      Active
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button>
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
