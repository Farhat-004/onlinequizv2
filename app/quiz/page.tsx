import { Suspense } from "react"
import QuizClient from "./QuizClient"

export default function QuizPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen app-bg p-6 text-sm text-slate-600">Loading quiz...</div>}
    >
      <QuizClient />
    </Suspense>
  )
}
