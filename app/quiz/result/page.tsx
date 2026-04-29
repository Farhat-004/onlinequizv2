"use server"

import { redirect } from "next/navigation"
import { dbConnect } from "@/lib/mongodb"
import ResultModel from "@/models/ResultModel"
import ExamModel from "@/models/ExamModel"

type Props = {
  searchParams?: Promise<{ resultId?: string }>
}

export default async function QuizResultPage({ searchParams }: Props) {
  const sp = (await searchParams) ?? {}
  const resultId = sp.resultId
  if (!resultId) redirect("/quiz")

  await dbConnect()

  const result = await ResultModel.findById(resultId).lean()
  if (!result) {
    return (
      <section className="p-6">
        <h1 className="text-xl font-semibold text-black">Result not found</h1>
      </section>
    )
  }

  const exam = result?.examId ? await ExamModel.findById(result.examId).lean() : null

  return (
    <section className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-black">Result</h1>
      <div className="mt-4 rounded border bg-white p-4">
        <div className="text-black font-semibold">{exam?.title ?? result.examTittle ?? "Exam"}</div>
        <div className="mt-2 text-black">
          <div>
            Score: <span className="font-semibold">{result.score}</span> / {result.totalMarks}
          </div>
          {typeof result.correctCount === "number" && typeof result.totalQuestions === "number" ? (
            <div className="text-sm text-gray-700">
              Correct: {result.correctCount}/{result.totalQuestions}
            </div>
          ) : null}
          {result.submittedAt ? (
            <div className="text-sm text-gray-700">Submitted: {new Date(result.submittedAt).toLocaleString()}</div>
          ) : null}
        </div>
      </div>

      {Array.isArray((result as { answers?: unknown }).answers) &&
      ((result as { answers?: unknown[] }).answers?.length || 0) > 0 ? (
        <div className="mt-4 rounded border bg-white p-4">
          <div className="text-black font-semibold mb-2">Answer Summary</div>
          <ul className="space-y-1 text-sm text-black">
            {((result as { answers: { _id?: unknown; correct?: unknown }[] }).answers || []).map(
              (a, idx) => (
                <li key={String(a?._id || idx)}>
                  Q{idx + 1}: {a?.correct ? "Correct" : "Wrong"}
                </li>
              ),
            )}
          </ul>
        </div>
      ) : null}
    </section>
  )
}
