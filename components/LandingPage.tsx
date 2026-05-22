import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="flex-1 home-bg">
      <section className="max-w-6xl mx-auto px-6 py-14">
        <div className="glass-card p-8">
          <h1 className="text-3xl md:text-5xl font-semibold text-slate-900">
            Create and take exams online
          </h1>
          <p className="mt-4 text-slate-700 max-w-2xl">
            eExam lets teachers publish quizzes with a join code and students take them securely
            with automatic scoring.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/signin"
              className="btn-primary px-5 py-3"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="btn-outline px-5 py-3"
            >
              Create account
            </Link>
            <Link
              href="/create-quiz"
              className="btn-dark px-5 py-3"
            >
              Create a quiz
            </Link>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <div className="font-semibold text-slate-900">Fast setup</div>
            <div className="mt-1 text-sm text-slate-700">
              Build MCQs, set duration, and share a join code.
            </div>
          </div>
          <div className="glass-card p-5">
            <div className="font-semibold text-slate-900">Auto scoring</div>
            <div className="mt-1 text-sm text-slate-700">
              Results include correct answers and what the student selected.
            </div>
          </div>
          <div className="glass-card p-5">
            <div className="font-semibold text-slate-900">Time-bound exams</div>
            <div className="mt-1 text-sm text-slate-700">
              Joining is blocked automatically after the end time.
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
