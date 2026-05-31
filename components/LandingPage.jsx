import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="flex-1 home-bg ">
            <section className="max-w-6xl mx-auto px-6 py-14">
                <div className="glass-card p-8">
                    <h1 className="text-3xl md:text-5xl font-semibold text-slate-900">
                        Create and take exams online
                    </h1>
                    <p className="mt-4 text-slate-700 max-w-2xl">
                        OnlineQuiz lets teachers publish quizzes with a join
                        code and students take them securely with automatic
                        scoring.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/signin" className="btn-primary px-5 py-3">
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="btn-outline px-5 py-3 border-slate-300 text-slate-700 border-2"
                        >
                            Create account
                        </Link>
                    </div>
                </div>

                <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="glass-card p-5 flex items-center gap-4">
                        <div className="h-14 w-[82px] m-2 flex items-center justify-center rounded-full bg-slate-50 text-purple-700">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-7 w-7"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M8 9h8M8 13h8M8 17h5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">
                                Fast setup
                            </div>
                            <div className="mt-2 mr-8 text-sm text-slate-700">
                                Build MCQs, set duration, and share a join code.
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-5 flex items-center gap-4">
                        <div className="h-14 w-[82px] m-2 flex items-center justify-center rounded-full bg-slate-50 text-purple-700">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-7 w-7"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M8 9h8M8 13h8M8 17h5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">
                                Time-bound exams
                            </div>
                            <div className="mt-2 mr-8 text-sm text-slate-700">
                                Joining is blocked automatically after the end
                                time.
                            </div>
                        </div>
                    </div>
                    <div className="glass-card p-5 flex items-center gap-4">
                        <div className="h-14 w-[82px] m-2 flex items-center justify-center rounded-full bg-slate-50 text-purple-700">
                            <svg
                                viewBox="0 0 24 24"
                                className="h-7 w-7"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                />
                                <path
                                    d="M8 9h8M8 13h8M8 17h5"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">
                                Auto scoring
                            </div>
                            <div className="mt-2 mr-8 text-sm text-slate-700">
                                Results include correct answers and what the
                                student selected.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
