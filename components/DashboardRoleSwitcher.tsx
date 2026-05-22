"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

type AppRole = "teacher" | "student";

export default function DashboardRoleSwitcher({ hasBothRoles }: { hasBothRoles: boolean }) {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState<AppRole | null>(null);

  if (!hasBothRoles) return null;

  const role = (session as { role?: string } | null)?.role as AppRole | undefined;
  const active = role === "teacher" || role === "student" ? role : "student";

  async function setRole(next: AppRole) {
    if (next === active) return;
    setPending(next);
    try {
      const res = await fetch("/api/user/active-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeRole: next }),
      });
      if (!res.ok) return;
      await update();
      router.refresh();
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/70 backdrop-blur px-4 py-3 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3 text-sm text-slate-800">
        <div className="mt-0.5 grid size-8 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-sm">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M16 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            <path
              d="M8 11c1.657 0 3-1.79 3-4S9.657 3 8 3 5 4.79 5 7s1.343 4 3 4Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 21c0-3.314 2.686-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M22 21c0-3.314-2.686-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div>
          <div className="font-semibold text-slate-900">You have teacher and student access</div>
          <div className="text-slate-600">Choose which dashboard to show.</div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => setRole("teacher")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition shadow-sm ${
            active === "teacher"
              ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white border-transparent"
              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
          } disabled:opacity-60 disabled:shadow-none`}
        >
          {pending === "teacher" ? "…" : "Teacher"}
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => setRole("student")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold border transition shadow-sm ${
            active === "student"
              ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white border-transparent"
              : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
          } disabled:opacity-60 disabled:shadow-none`}
        >
          {pending === "student" ? "…" : "Student"}
        </button>
      </div>
    </div>
  );
}
