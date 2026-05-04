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

  const exam =
    result?.examId ?
      await ExamModel.findById(result.examId).populate("questions").lean()
    : null

  const answersArray = Array.isArray((result as { answers?: unknown }).answers) ?
      ((result as { answers?: unknown[] }).answers ?? [])
    : []

  const answersByQuestionId = new Map<
    string,
    { selectedIndex: number | null; correct?: boolean }
  >()
  for (const a of answersArray as {
    questionId?: unknown
    selectedIndex?: unknown
    correct?: unknown
  }[]) {
    const qid = a?.questionId ? String(a.questionId) : null
    if (!qid) continue
    const selectedIndex =
      Number.isInteger(a?.selectedIndex) ? Number(a.selectedIndex) : null
    answersByQuestionId.set(qid, { selectedIndex, correct: Boolean(a?.correct) })
  }

  const examQuestions = Array.isArray((exam as { questions?: unknown }).questions) ?
      ((exam as { questions?: unknown[] }).questions ?? [])
    : []

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

      {answersArray.length > 0 ? (
        <div className="mt-4 rounded border bg-white p-4">
          <div className="text-black font-semibold mb-3">Answer Details</div>
          {examQuestions.length > 0 ? (
            <div className="space-y-3">
              {examQuestions.map((qAny, idx) => {
              const q = qAny as {
                _id?: unknown
                text?: unknown
                choices?: { text?: unknown; isCorrect?: unknown }[]
              }
              const qid = q?._id ? String(q._id) : null
              const ans = qid ? answersByQuestionId.get(qid) : null
              const choices = Array.isArray(q?.choices) ? q.choices : []
              const correctIndex = choices.findIndex((c) => Boolean(c?.isCorrect))
              const selectedIndex = ans?.selectedIndex ?? null
              const yourAnswer =
                selectedIndex !== null && selectedIndex >= 0 && selectedIndex < choices.length ?
                  String(choices[selectedIndex]?.text ?? "")
                : "Not answered"
              const correctAnswer =
                correctIndex >= 0 && correctIndex < choices.length ?
                  String(choices[correctIndex]?.text ?? "")
                : "N/A"
              const correctLabel =
                selectedIndex !== null && selectedIndex === correctIndex ?
                  "Correct"
                : "Wrong"

              return (
                <div key={qid || `q:${idx}`} className="rounded border p-3">
                  <div className="text-sm font-semibold text-black">
                    Q{idx + 1}: {String(q?.text ?? "")}
                  </div>
                  <div className="mt-2 text-sm text-black">
                    <div>
                      Your answer: <span className="font-medium">{yourAnswer}</span>
                    </div>
                    <div>
                      Correct answer: <span className="font-medium">{correctAnswer}</span>
                    </div>
                    <div className={`mt-1 text-xs ${correctLabel === "Correct" ? "text-green-700" : "text-red-700"}`}>
                      {correctLabel}
                    </div>
                  </div>
                </div>
              )
              })}
            </div>
          ) : (
            <ul className="space-y-1 text-sm text-black">
              {(answersArray as { correct?: unknown }[]).map((a, idx) => (
                <li key={`a:${idx}`}>Q{idx + 1}: {a?.correct ? "Correct" : "Wrong"}</li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </section>
  )
}
