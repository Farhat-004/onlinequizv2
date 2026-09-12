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
    <div className="flex items-center gap-1 rounded-[2px] border border-[#cbd8d2] bg-[#e8f2ed] p-1 shadow-sm">
      <button
        type="button"
        disabled={pending !== null}
        onClick={() => setRole("teacher")}
        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
          active === "teacher"
            ? "bg-[#0f766e] text-white shadow-sm"
            : "text-[#58706b] hover:text-[#18312f] hover:bg-[#fffdf8]"
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
            ? "bg-[#0f766e] text-white shadow-sm"
            : "text-[#58706b] hover:text-[#18312f] hover:bg-[#fffdf8]"
        } disabled:opacity-50`}
      >
        Student
      </button>
    </div>
  );
}
