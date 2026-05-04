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
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-amber-950">
        <span className="font-medium">You have teacher and student access.</span>{" "}
        <span className="text-amber-900/90">Choose which dashboard to show.</span>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => setRole("teacher")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            active === "teacher"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
          } disabled:opacity-60`}
        >
          {pending === "teacher" ? "…" : "Teacher"}
        </button>
        <button
          type="button"
          disabled={pending !== null}
          onClick={() => setRole("student")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition ${
            active === "student"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
          } disabled:opacity-60`}
        >
          {pending === "student" ? "…" : "Student"}
        </button>
      </div>
    </div>
  );
}
