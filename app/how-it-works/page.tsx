import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen app-bg py-12 px-4">
      <div className="max-w-2xl mx-auto glass-card p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">How eExam works</h1>
        <p className="text-slate-600 text-sm mb-8">
          Short guide for teachers and students using this application.
        </p>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Teachers</h2>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
            <li>
              <Link href="/signup" className="font-semibold text-indigo-700 hover:underline">
                Sign up
              </Link>{" "}
              or{" "}
              <Link href="/signin" className="font-semibold text-indigo-700 hover:underline">
                sign in
              </Link>{" "}
              with a teacher account (or choose both roles if you also take exams).
            </li>
            <li>
              Open <strong>Create Quiz</strong> to set title, schedule, questions, and publish. You get a join code
              for students.
            </li>
            <li>
              Use the <strong>dashboard</strong> to see upcoming, ongoing, and past exams and open results when
              submissions exist.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Students</h2>
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
            <li>Sign in, then open <strong>Exam</strong> and enter the join code your teacher shared.</li>
            <li>Complete the exam within the allowed window. Your score appears on the dashboard after submission.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">Teacher and student on one account</h2>
          <p className="text-sm text-slate-700">
            If your account has both roles, use the <strong>Teacher</strong> / <strong>Student</strong> controls in
            the navigation bar or on the dashboard to switch views. Teacher tools (such as creating quizzes) stay
            available whenever your account includes the teacher role.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/signin"
            className="btn-primary"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="btn-outline"
          >
            Sign up
          </Link>
          <Link href="/" className="btn-outline">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
