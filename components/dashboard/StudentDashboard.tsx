"use client";

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
  user,
  averagePercent,
  pastExams,
}: {
  user: UserInfo;
  averagePercent: number;
  pastExams: PastExam[];
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 bg-white border rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">Dashboard</div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {user.name}</h1>
                <div className="text-sm text-gray-600">{user.email}</div>
              </div>
              <PerformanceCircle value={averagePercent} label="Performance" />
            </div>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <div className="text-sm text-gray-600">User details</div>
            <div className="mt-2 space-y-2">
              <div className="text-sm">
                <span className="text-gray-500">Role:</span>{" "}
                <span className="font-medium text-gray-900">{user.role}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Exams taken:</span>{" "}
                <span className="font-medium text-gray-900">{pastExams.length}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500">Average:</span>{" "}
                <span className="font-medium text-gray-900">{averagePercent}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white border rounded-xl">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Past exams</h2>
            <div className="text-sm text-gray-600">{pastExams.length} results</div>
          </div>
          <div className="p-5">
            {pastExams.length === 0 ? (
              <div className="text-sm text-gray-600">No results yet.</div>
            ) : (
              <div className="overflow-auto border rounded-lg">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left font-medium px-4 py-3">Exam</th>
                      <th className="text-left font-medium px-4 py-3">Score</th>
                      <th className="text-left font-medium px-4 py-3">%</th>
                      <th className="text-left font-medium px-4 py-3">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pastExams.map((r) => (
                      <tr key={r._id} className="text-gray-900">
                        <td className="px-4 py-3">
                          <div className="font-medium">{r.title}</div>
                          <div className="text-xs text-gray-600">Exam ID: {r.examId}</div>
                        </td>
                        <td className="px-4 py-3">
                          {r.score}/{r.totalMarks}
                        </td>
                        <td className="px-4 py-3">{r.percent}%</td>
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

