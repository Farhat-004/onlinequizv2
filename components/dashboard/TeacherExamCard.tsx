"use client";

import { useState } from "react";
import ResultsModal from "./TeacherResultsModal";

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

function fmt(dt: string | Date) {
  const d = typeof dt === "string" ? new Date(dt) : dt;
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function TeacherExamCard({ exam }: { exam: TeacherExam }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Join code
          </div>
          <div className="mt-1 inline-flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-slate-900">{exam.joinCode}</span>
            <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
              Share
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            Participants
          </div>
          <div className="mt-1 text-lg font-bold text-slate-900">{exam.participants}</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="text-lg font-semibold text-slate-900 truncate">{exam.title}</div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <svg viewBox="0 0 24 24" className="size-4 text-slate-700" fill="none" aria-hidden="true">
              <path
                d="M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            {fmt(exam.startTime)} → {fmt(exam.endTime)}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
            <svg viewBox="0 0 24 24" className="size-4 text-slate-700" fill="none" aria-hidden="true">
              <path
                d="M12 6v6l4 2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {exam.durationMinutes} min
            {typeof exam.totalMarks === "number" ? ` · ${exam.totalMarks} marks` : ""}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition group-hover:shadow-md hover:from-slate-800 hover:to-slate-700"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          View results
        </button>
      </div>

      <ResultsModal examId={String(exam._id)} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

