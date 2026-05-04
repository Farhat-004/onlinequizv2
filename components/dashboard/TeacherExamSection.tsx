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
    <section className="bg-white border rounded-xl">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">{title}</h2>
        <div className="text-sm text-gray-600">{exams.length} exams</div>
      </div>
      <div className="p-5">
        {exams.length === 0 ? (
          <div className="text-sm text-gray-600">{empty}</div>
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

