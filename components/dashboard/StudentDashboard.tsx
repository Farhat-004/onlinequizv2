"use client";

import DashboardRoleSwitcher from "@/components/DashboardRoleSwitcher";
import PerformanceCircle from "./performance/PerformanceCircle";

type UserInfo = { name: string; email: string; image?: string; role: "teacher" | "student" };

type PastExam = {
  _id: string;
  examId: string;
  title: string;
  submittedAt: string | null;
  score: number;
  totalMarks: number;
  percent: number;
};

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function StudentDashboard({
  hasBothRoles,
  user,
  averagePercent,
  pastExams,
}: {
  hasBothRoles: boolean;
  user: UserInfo;
  averagePercent: number;
  pastExams: PastExam[];
}) {
  return (
    <div className="min-h-screen bg-[#f4f1ea] bg-image1 text-[#18312f]">
      <div className="max-w-6xl mx-auto p-6">
        <DashboardRoleSwitcher hasBothRoles={hasBothRoles} />
        <div className="grid gap-6 md:grid-cols-3 ">
          <div className="md:col-span-2 overflow-hidden home-bg rounded-[2px] border border-[#d8dfd8] bg-[#fffdf8] shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative">
                    <div className="grid size-12 place-items-center rounded-[2px] bg-[#0f766e] text-white shadow-md">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          alt={user.name}
                          src={user.image}
                          className="size-12 rounded-2xl object-cover"
                        />
                      ) : (
                        <span className="text-base font-semibold">
                          {(user.name || "S").trim().slice(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 rounded-xl border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
                      Student
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold tracking-wide text-[#0f766e] uppercase">
                      Dashboard
                    </div>
                    <h1 className="mt-1 text-2xl font-bold text-[#18312f] truncate">
                      Welcome, {user.name}
                    </h1>
                    <div className="mt-1 text-sm text-[#58706b] truncate">{user.email}</div>
                  </div>
                </div>
                <div className="shrink-0">
                  <PerformanceCircle value={averagePercent} label="Performance" />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-black">
                  <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                  <span className="size-2 rounded-full bg-indigo-500" />
                  Exams taken:{" "}
                  <span className="font-semibold text-black">{pastExams.length}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
                  <span className="size-2 rounded-full bg-fuchsia-500" />
                  Average:{" "}
                  <span className="font-semibold text-black">{averagePercent}%</span>
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2px] home-bg border border-[#d8dfd8] bg-[#fffdf8] shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold tracking-wide text-[#0f766e] uppercase">
                    Profile
                  </div>
                  <div className="mt-1 text-lg font-semibold text-[#18312f] truncate">
                    User details
                  </div>
                </div>
                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-black shadow-sm">
                  {user.role}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <span className="text-black">Role</span>
                  <span className="font-semibold text-black">{user.role}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <span className="text-black">Exams taken</span>
                  <span className="font-semibold text-black">{pastExams.length}</span>
                </div>
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                  <span className="text-black">Average</span>
                  <span className="font-semibold text-black">{averagePercent}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2px] border border-[#d8dfd8] bg-[#fffdf8] shadow-sm">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-[2px] bg-[#d95f4f] text-white shadow-sm">
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
              <h2 className="font-semibold text-slate-900">Past exams</h2>
            </div>
              <div className="text-sm text-black">
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 shadow-sm">
                {pastExams.length} results
              </span>
            </div>
          </div>
          <div className="p-5">
            {pastExams.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-black">
                No results yet.
              </div>
            ) : (
              <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-black">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Exam</th>
                      <th className="text-left font-medium px-4 py-3">Score</th>
                      <th className="text-left font-medium px-4 py-3">%</th>
                      <th className="text-left font-medium px-4 py-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pastExams.map((r) => (
                      <tr
                        key={r._id}
                        className="text-black hover:bg-slate-50/70 transition"
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs text-black">Exam ID: {r.examId}</div>
                        </td>
                        <td className="px-4 py-3">
                          {r.score}/{r.totalMarks}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-black">
                            {r.percent}%
                          </span>
                        </td>
                        <td className="px-4 py-3">{fmtDate(r.submittedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

