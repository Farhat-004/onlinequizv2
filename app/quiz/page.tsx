"use client"
import MCQQuestion from "@/components/MCQQuestion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type ExamQuestion = {
  _id: string
  text: string
  choices: { text: string }[]
}

type Exam = {
  _id: string
  title: string
  joinCode: string
  durationMinutes?: number
  startTime?: string
  endTime?: string
  marksPerQues?: number
  totalMarks?: number
  questions: ExamQuestion[]
}

type SubmitResponse = {
  message?: string
  score: number
  totalMarks: number
  correctCount: number
  totalQuestions: number
  perQuestion: {
    questionId: string
    selectedIndex: number | null
    correctIndex: number
    correct: boolean
  }[]
}

function formatTime(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds))
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")
  return `${mm}:${ss}`
}

export default  function Quiz() {
  const searchParams=useSearchParams()
  const router = useRouter()
  
  const joinCode=searchParams.get("joinCode")
    const [exam,setExam]=useState<Exam | null>(null)
    const [answers,setAnswers]=useState<Record<string, number | null>>({})
    const [timeLeftSec, setTimeLeftSec] = useState<number | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState<SubmitResponse | null>(null)
    useEffect(()=>{
        if(!joinCode) return
        // Fetch questions using join code
        async function fetchQuestions() {
          try {
            const response=await fetch(`/api/exams?joinCode=${encodeURIComponent(joinCode)}`)
            if(!response.ok) throw new Error("Failed to fetch questions")
            const data: Exam=await response.json()
            setExam(data)
            const initialAnswers: Record<string, number | null> = {}
            for (const q of data.questions || []) initialAnswers[q._id] = null
            setAnswers(initialAnswers)

            const now = Date.now()
            const endMs = data.endTime ? new Date(data.endTime).getTime() : null
            const durationMs =
              typeof data.durationMinutes === "number" ? data.durationMinutes * 60_000 : null

            const effectiveEndMs =
              endMs && endMs > now + 1000 ? endMs : durationMs ? now + durationMs : null

            if (effectiveEndMs) {
              setTimeLeftSec(Math.max(0, Math.floor((effectiveEndMs - now) / 1000)))
            } else {
              setTimeLeftSec(null)
            }
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Failed to fetch questions"
            console.error(message);
          }
        }
        fetchQuestions()
    },[joinCode])

    const handleSubmit = useCallback(async () => {
      if (!joinCode) return
      if (submitting || submitted) return
      setSubmitting(true)
      try {
        const res = await fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ joinCode, answers }),
        })
        const bodyUnknown: unknown = await res.json().catch(() => ({}))
        const body = bodyUnknown as Partial<SubmitResponse> & {
          message?: string
          resultId?: string
        }
        if (!res.ok) throw new Error(body?.message || "Failed to submit result")
        setSubmitted(body as SubmitResponse)
        if (body?.resultId) {
          router.push(`/quiz/result?resultId=${encodeURIComponent(body.resultId)}`)
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to submit result"
        console.log(message)
        // alert(message)
      } finally {
        setSubmitting(false)
      }
    }, [answers, joinCode, router, submitting, submitted])

//timer
    const prevTimeLeftRef = useRef<number | null>(null)
    useEffect(() => {
      if (timeLeftSec === null) return
      if (submitted) return
      const prev = prevTimeLeftRef.current
      prevTimeLeftRef.current = timeLeftSec
      // Only auto-submit when we actually count down to 0 (not if we loaded an already-expired exam)
      if (prev !== null && prev > 0 && timeLeftSec <= 0) {
        void handleSubmit()
        return
      }
      const t = setInterval(() => setTimeLeftSec((s) => (s === null ? s : Math.max(0, s - 1))), 1000)
      return () => clearInterval(t)
    }, [timeLeftSec, submitted, handleSubmit])

    function setAnswer(questionId: string, choiceIndex: number) {
      if (submitted) return
      setAnswers((prev) => ({ ...prev, [questionId]: choiceIndex }))
    }

  return (
    <section>
        <div className="flex items-center justify-between px-4 pt-3">
          <h2 className="text-center font-semibold">{exam?.title || "Quiz"}</h2>
          <div className=" font-mono">
            Time left : {timeLeftSec === null ? "—:—" : formatTime(timeLeftSec)}
          </div>
        </div>
        <div className="mt-6">
          {(() => {
            const perQuestion = new Map<string, SubmitResponse["perQuestion"][number]>()
            for (const pq of submitted?.perQuestion || []) perQuestion.set(pq.questionId, pq)
            return (exam?.questions || []).map((q, index) => {
              const pq = perQuestion.get(q._id) || null
              return (
            <MCQQuestion
              key={q?._id}
              question={{...q,index:index+1}}
              selectedIndex={answers?.[q._id] ?? null}
              onSelect={(choiceIndex) => setAnswer(q._id, choiceIndex)}
              disabled={Boolean(submitting || submitted)}
              result={
                pq ? { correctIndex: pq.correctIndex, selectedIndex: pq.selectedIndex } : null
              }
            />
              )
            })
          })()}
        </div>

        <div className="px-4 pb-8 flex items-center justify-between gap-4">
          <div className="text-black">
            {submitted ? (
              <div>
                <div className="font-semibold">Score: {submitted.score}/{submitted.totalMarks}</div>
                <div className="text-sm text-gray-700">Correct: {submitted.correctCount}/{submitted.totalQuestions}</div>
              </div>
            ) : null}
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!exam || submitting || Boolean(submitted)}
            className="px-4 py-2 rounded bg-amber-600 text-white disabled:opacity-60"
          >
            {submitted ? "Submitted" : submitting ? "Submitting..." : "Submit Result"}
          </button>
        </div>
    </section>
  )
}
