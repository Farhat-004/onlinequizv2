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
  const marksPerQuestion = Number((exam as { marksPerQues?: unknown } | null)?.marksPerQues) || 0
  const totalMarks =
    examQuestions.length > 0 && marksPerQuestion > 0 ?
      examQuestions.length * marksPerQuestion
    : Number(result.totalMarks) || 0

  return (
    <section className="min-h-screen app-bg bg-[linear-gradient(135deg,rgba(217,154,36,0.1),transparent_38%)] p-6">
      <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-[#18312f]">Result</h1>
      <div className="mt-4 glass-card border-t-4 border-t-[#d99a24] p-5">
        <div className="text-slate-900 font-semibold">{exam?.title ?? result.examTittle ?? "Exam"}</div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <span className="badge">
            Score: <span className="font-semibold text-slate-900">{result.score}</span> /{" "}
            {totalMarks}
          </span>
          {typeof result.correctCount === "number" && typeof result.totalQuestions === "number" ? (
            <span className="badge">
              Correct: <span className="font-semibold text-slate-900">{result.correctCount}</span>/
              {result.totalQuestions}
            </span>
          ) : null}
          {result.submittedAt ? (
            <span className="badge">
              Submitted:{" "}
              <span className="font-semibold text-slate-900">
                {new Date(result.submittedAt).toLocaleString()}
              </span>
            </span>
          ) : null}
        </div>
      </div>

      {answersArray.length > 0 ? (
        <div className="mt-4 glass-card p-5">
          <div className="text-slate-900 font-semibold mb-3">Answer Details</div>
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
                <div key={qid || `q:${idx}`} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-sm font-semibold text-slate-900">
                    Q{idx + 1}: {String(q?.text ?? "")}
                  </div>
                  <div className="mt-3 text-sm text-slate-900 space-y-1">
                    <div>
                      Your answer: <span className="font-medium">{yourAnswer}</span>
                    </div>
                    <div>
                      Correct answer: <span className="font-medium">{correctAnswer}</span>
                    </div>
                    <div className="pt-1">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                          correctLabel === "Correct"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {correctLabel}
                      </span>
                    </div>
                  </div>
                </div>
              )
              })}
            </div>
          ) : (
            <ul className="space-y-1 text-sm text-slate-900">
              {(answersArray as { correct?: unknown }[]).map((a, idx) => (
                <li key={`a:${idx}`}>Q{idx + 1}: {a?.correct ? "Correct" : "Wrong"}</li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
      </div>
    </section>
  )
}
