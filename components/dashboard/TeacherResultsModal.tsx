"use client";

import { useEffect, useMemo, useState } from "react";

type Row = {
  _id: string;
  student: { name?: string; email?: string; image?: string } | null;
  score: number;
  totalMarks: number;
  percent: number;
  submittedAt: string | null;
};

function fmtDate(iso: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function ResultsModal({
  examId,
  open,
  onClose,
}: {
  examId: string;
  open: boolean;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);

  /* eslint-disable react-hooks/set-state-in-effect -- existing behavior; keep logic unchanged */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`/api/teacher/exams/${encodeURIComponent(examId)}/results`)
      .then(async (r) => {
        const json = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(json?.message || "Failed to load results");
        return json;
      })
      .then((json) => {
        if (cancelled) return;
        setRows(Array.isArray(json?.results) ? json.results : []);
      })
      .catch((e) => {
        if (cancelled) return;
        setError(String(e?.message || e));
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, examId]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const summary = useMemo(() => {
    if (rows.length === 0) return { avg: 0 };
    const avg = Math.round(rows.reduce((s, r) => s + (Number(r.percent) || 0), 0) / rows.length);
    return { avg };
  }, [rows]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[95vw] max-w-3xl glass-card">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-500 uppercase">Participants</div>
            <div className="font-semibold text-slate-900">
              Results · {rows.length} submissions · Avg {summary.avg}%
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-outline"
          >
            Close
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
              No one has submitted yet.
            </div>
          ) : (
            <div className="overflow-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left font-medium px-4 py-3">Student</th>
                    <th className="text-left font-medium px-4 py-3">Score</th>
                    <th className="text-left font-medium px-4 py-3">%</th>
                    <th className="text-left font-medium px-4 py-3">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {rows.map((r) => (
                    <tr key={r._id} className="text-slate-900 hover:bg-slate-50/70 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium">{r.student?.name || "Student"}</div>
                        <div className="text-xs text-slate-600">{r.student?.email || ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        {r.score}/{r.totalMarks}
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge text-slate-800">{r.percent}%</span>
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
  );
}

