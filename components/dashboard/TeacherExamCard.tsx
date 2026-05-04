"use client";

import { useState } from "react";
import ResultsModal from "./TeacherResultsModal";

export type TeacherExam = {
  _id: any;
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
    <div className="rounded-lg border p-4 bg-white">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-gray-500">Join code</div>
          <div className="font-mono text-lg font-semibold text-gray-900">{exam.joinCode}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Participants</div>
          <div className="text-lg font-semibold text-gray-900">{exam.participants}</div>
        </div>
      </div>

      <div className="mt-3">
        <div className="text-lg font-semibold text-gray-900 truncate">{exam.title}</div>
        <div className="mt-1 text-sm text-gray-600">
          {fmt(exam.startTime)} → {fmt(exam.endTime)}
        </div>
        <div className="mt-1 text-sm text-gray-600">
          Duration: {exam.durationMinutes} min
          {typeof exam.totalMarks === "number" ? ` · Total marks: ${exam.totalMarks}` : ""}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
        >
          View participants results
        </button>
      </div>

      <ResultsModal examId={String(exam._id)} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

