"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

type AppRole = "teacher" | "student";

export default function NavRoleSwitcher() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState<AppRole | null>(null);

  const hasBoth = Boolean((session as { hasBothRoles?: boolean } | null)?.hasBothRoles);
  if (!hasBoth) return null;

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
    <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white/70 backdrop-blur p-1 shadow-sm">
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => setRole("teacher")}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
          active === "teacher"
            ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-white"
        } disabled:opacity-50`}
      >
        Teacher
      </button>
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => setRole("student")}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
          active === "student"
            ? "bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white shadow-sm"
            : "text-slate-600 hover:text-slate-900 hover:bg-white"
        } disabled:opacity-50`}
      >
        Student
      </button>
    </div>
  );
}
