"use client"
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

type Exam = {
  _id?: string
  title?: string
  joinCode?: string
  durationMinutes?: number
  duration?: number
  totalMarks?: number
  marksPerQues?: number
  startTime?: string
  endTime?: string
  questions?: unknown[]
  dateExpired?: boolean
}

export default function JoinExam() {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [dateExpired, setDateExpired] = useState(false);
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function isExamExpired(endTime: unknown) {
    if (!endTime) return false
    const endMs = new Date(String(endTime)).getTime()
    if (!Number.isFinite(endMs)) return false
    return Date.now() > endMs
  }

  async function handleSearch(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();
    if (!code) return;
    setLoading(true);
    setError("");
    setExam(null);
    try {
      const res = await fetch(
        `/api/exams?joinCode=${encodeURIComponent(code)}&password=${encodeURIComponent(password)}`,
      );
      if (!res.ok) {
        const bodyUnknown: unknown = await res.json().catch(() => ({}));
        const body = bodyUnknown as { message?: string }
        throw new Error(body?.message || "Exam not found");
      }
      const data = (await res.json()) as Exam;
      setExam(data);
      console.log("Exam data:", data);
      setDateExpired(Boolean(data?.dateExpired) || isExamExpired(data?.endTime));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to fetch exam"
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleJoin() {
    if (dateExpired) return
    // Redirect to exam page with search params
    router.push(
      `/quiz?joinCode=${encodeURIComponent(code)}&password=${encodeURIComponent(password)}`,
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center home-bg">
      <div className="max-w-xl w-full p-8 glass-card">
        <h1 className="text-2xl font-semibold mb-2 text-slate-900">eExam</h1>
        <p className="mb-6 text-slate-600">Enter join code to find an exam</p>
        <form onSubmit={handleSearch} className="grid gap-3 sm:grid-cols-[auto,1fr]">
          <label className="label mb-0">Join Code</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            name="joinCode"
            required
            className="input"
          />
          <label className="label mb-0">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            required
            className="input"
          />
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>

        {loading && <p className="mt-4 text-sm text-slate-600">Searching...</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* Modal */}
        {exam && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40"
            onClick={() => setExam(null)}
          >
            <div
              className="w-full max-w-md glass-card p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-2 text-slate-900">{exam.title || 'Exam Details'}</h2>
              <p className="text-sm text-slate-600 mb-4">
                Join Code: <span className="font-mono font-semibold text-slate-900">{exam.joinCode}</span>
              </p>
              <ul className="mb-4 text-sm space-y-1 text-slate-900">
                <li><strong>Duration:</strong> {exam.durationMinutes ?? exam.duration ?? 'N/A'} minutes</li>
                <li><strong>Total Marks:</strong> {exam.totalMarks ?? 'N/A'}</li>
                <li><strong>Marks per Question:</strong> {exam.marksPerQues ?? 'N/A'}</li>
                <li><strong>Start Time:</strong> {exam.startTime ? new Date(exam.startTime).toLocaleString() : 'N/A'}</li>
                <li><strong>End Time:</strong> {exam.endTime ? new Date(exam.endTime).toLocaleString() : 'N/A'}</li>
                <li><strong>Questions:</strong> {Array.isArray(exam.questions) ? exam.questions.length : 'N/A'}</li>
              </ul>

              {dateExpired ? (
                <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  This exam has ended. You can no longer join.
                </div>
              ) : null}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setExam(null)}
                  className="btn-outline"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleJoin}
                  className="btn-primary"
                  disabled={dateExpired}
                >
                  {dateExpired ? "Ended" : "Join"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
