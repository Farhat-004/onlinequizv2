"use client";

import { useMemo } from "react";
import DashboardRoleSwitcher from "@/components/DashboardRoleSwitcher";
import ExamSection from "./TeacherExamSection";

type UserInfo = { name: string; email: string; image?: string; role: "teacher" | "student" };

export type TeacherExam = {
  _id: unknown;
  title: string;
  joinCode: string;
  totalMarks?: number;
  durationMinutes: number;
  startTime: string | Date;
  endTime: string | Date;
  participants: number;
};

export default function TeacherDashboard({
  hasBothRoles,
  user,
  upcoming,
  ongoing,
  past,
}: {
  hasBothRoles: boolean;
  user: UserInfo;
  upcoming: TeacherExam[];
  ongoing: TeacherExam[];
  past: TeacherExam[];
}) {
  const stats = useMemo(() => {
    const total = upcoming.length + ongoing.length + past.length;
    const participants = [...upcoming, ...ongoing, ...past].reduce(
      (s, e) => s + (Number(e.participants) || 0),
      0,
    );
    return { total, participants };
  }, [upcoming, ongoing, past]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 bg-image1 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 app-bg">
        <DashboardRoleSwitcher hasBothRoles={hasBothRoles} />
        <div className="overflow-hidden rounded-3xl border border-slate-200 app-bg bg-white/70 backdrop-blur shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative">
                  <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-md">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={user.name}
                        src={user.image}
                        className="size-12 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-base font-semibold">
                        {(user.name || "T").trim().slice(0, 1).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 rounded-xl border border-slate-200 bg-white/30 backdrop-blur-md px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
                    Teacher
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                    Dashboard
                  </div>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900 truncate">
                    Welcome, {user.name}
                  </h1>
                  <div className="mt-1 text-sm text-slate-600 truncate">{user.email}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-medium  text-slate-600">
                    <span className="grid size-7 place-items-center rounded-xl bg-indigo-50 text-indigo-700">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
                        <path
                          d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 9h8M8 13h8M8 17h5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                    Total exams
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md p-4 shadow-sm">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                    <span className="grid size-7 place-items-center rounded-xl bg-fuchsia-50 text-fuchsia-700">
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
                    </span>
                    Total participants
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {stats.participants}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/30 backdrop-blur-md px-3 py-1.5 shadow-sm">
                <span className="size-2 rounded-full bg-emerald-500" />
                Ongoing: <span className="font-semibold text-slate-900">{ongoing.length}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/30 backdrop-blur-md px-3 py-1.5 shadow-sm">
                <span className="size-2 rounded-full bg-indigo-500" />
                Upcoming: <span className="font-semibold text-slate-900">{upcoming.length}</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/30 backdrop-blur-md px-3 py-1.5 shadow-sm">
                <span className="size-2 rounded-full bg-slate-400" />
                Past: <span className="font-semibold text-slate-900">{past.length}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 ">
          <ExamSection title="Ongoing (today)" empty="No ongoing exams right now." exams={ongoing} />
          <ExamSection title="Upcoming" empty="No upcoming exams." exams={upcoming} />
          <ExamSection title="Past exams" empty="No past exams yet." exams={past} />
        </div>
      </div>
    </div>
  );
}

