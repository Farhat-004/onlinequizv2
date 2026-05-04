import { Suspense } from "react"
import QuizClient from "./QuizClient"

export default function QuizPage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-sm text-gray-600">Loading quiz...</div>}
    >
      <QuizClient />
    </Suspense>
  )
}

