"use client";

import TeacherExamCard, { type TeacherExam } from "./TeacherExamCard";

export default function ExamSection({
  title,
  empty,
  exams,
}: {
  title: string;
  empty: string;
  exams: TeacherExam[];
}) {
  return (
    <section className="overflow-hidden rounded-3xl border home-bg border-slate-200 bg-white/70 backdrop-blur shadow-sm">
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="grid size-8 place-items-center rounded-xl bg-slate-900 text-white shadow-sm shrink-0">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
              <path
                d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M8 12h8M8 16h5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <h2 className="font-semibold text-slate-900 truncate">{title}</h2>
        </div>
        <div className="text-sm text-slate-600 shrink-0">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/30 backdrop-blur-md px-2.5 py-1 shadow-sm">
            {exams.length} exams
          </span>
        </div>
      </div>
      <div className="p-5">
        {exams.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 backdrop-blur-md p-6 text-sm text-slate-600">
            {empty}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {exams.map((e) => (
              <TeacherExamCard key={String(e._id)} exam={e} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

