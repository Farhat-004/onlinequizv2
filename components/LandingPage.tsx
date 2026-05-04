import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="flex-1 home-bg">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="rounded-2xl bg-white/90 backdrop-blur border shadow-sm p-8">
          <h1 className="text-3xl md:text-5xl font-semibold text-black">
            Create and take exams online
          </h1>
          <p className="mt-4 text-gray-700 max-w-2xl">
            eExam lets teachers publish quizzes with a join code and students take them securely
            with automatic scoring.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/signin"
              className="px-5 py-3 rounded bg-amber-600 text-white font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-5 py-3 rounded border border-gray-300 text-black font-medium bg-white"
            >
              Create account
            </Link>
            <Link
              href="/create-quiz"
              className="px-5 py-3 rounded border border-amber-200 text-amber-800 font-medium bg-amber-50"
            >
              Create a quiz
            </Link>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/90 backdrop-blur border p-5">
            <div className="font-semibold text-black">Fast setup</div>
            <div className="mt-1 text-sm text-gray-700">
              Build MCQs, set duration, and share a join code.
            </div>
          </div>
          <div className="rounded-xl bg-white/90 backdrop-blur border p-5">
            <div className="font-semibold text-black">Auto scoring</div>
            <div className="mt-1 text-sm text-gray-700">
              Results include correct answers and what the student selected.
            </div>
          </div>
          <div className="rounded-xl bg-white/90 backdrop-blur border p-5">
            <div className="font-semibold text-black">Time-bound exams</div>
            <div className="mt-1 text-sm text-gray-700">
              Joining is blocked automatically after the end time.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

