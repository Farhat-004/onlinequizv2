"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinExam() {
  const [code, setCode] = useState("");
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSearch(e) {
    e?.preventDefault();
    if (!code) return;
    setLoading(true);
    setError("");
    setExam(null);
    try {
      const res = await fetch(`/api/exams?joinCode=${encodeURIComponent(code)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || "Exam not found");
      }
      const data = await res.json();
      setExam(data);
    } catch (err) {
      setError(err?.message || "Failed to fetch exam");
    } finally {
      setLoading(false);
    }
  }

  function handleJoin() {
    // Redirect to exam page with search params
    router.push(`/quiz?joinCode=${encodeURIComponent(code)}`);
  }

  return (
    <div className="min-h-screen flex items-center justify-center home-bg">
      <div className="max-w-xl w-full p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4 text-amber-700">eExam</h1>
        <p className="mb-6 text-gray-600">Enter join code to find an exam</p>
        <form onSubmit={handleSearch} className="flex gap-2">
          <label className='text-black'>Join Code:</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            name="joinCode"
            required
            className='text-black border-amber-700 px-2'
          />
          <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">
            Search
          </button>
        </form>

        {loading && <p className="mt-4 text-sm text-gray-600">Searching...</p>}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {/* Modal */}
        {exam && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40"
            onClick={() => setExam(null)}
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-2 text-black">{exam.title || 'Exam Details'}</h2>
              <p className="text-sm text-gray-600 mb-4">Join Code: <strong>{exam.joinCode}</strong></p>
              <ul className="mb-4 text-sm space-y-1 text-black">
                <li><strong>Duration:</strong> {exam.durationMinutes ?? exam.duration ?? 'N/A'} minutes</li>
                <li><strong>Total Marks:</strong> {exam.totalMarks ?? 'N/A'}</li>
                <li><strong>Marks per Question:</strong> {exam.marksPerQues ?? 'N/A'}</li>
                <li><strong>Start Time:</strong> {exam.startTime ? new Date(exam.startTime).toLocaleString() : 'N/A'}</li>
                <li><strong>End Time:</strong> {exam.endTime ? new Date(exam.endTime).toLocaleString() : 'N/A'}</li>
                <li><strong>Questions:</strong> {Array.isArray(exam.questions) ? exam.questions.length : 'N/A'}</li>
              </ul>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setExam(null)}
                  className="px-4 py-2 border rounded bg-red-600 text-white"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleJoin}
                  className="px-4 py-2 bg-amber-600 text-white rounded"
                >
                  Join
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
