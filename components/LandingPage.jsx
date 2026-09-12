import Link from "next/link";

export default function LandingPage() {
    return (
        <main className="flex-1 home-bg">
            <section className="max-w-6xl mx-auto px-6 py-14">
                <div className="grid gap-10 overflow-hidden rounded-[2px] border border-[#cbd8d2] bg-[#18312f] p-8 text-[#fffdf8] shadow-[0_18px_40px_rgba(24,49,47,0.18)] md:grid-cols-[1.2fr_0.8fr] md:p-12">
                    <div>
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#d99a24] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#18312f]">
                        A calmer way to assess
                    </div>
                    <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
                        Learning gets better when progress is visible.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-[#d4e4de]">
                        OnlineQuiz lets teachers publish quizzes with a join
                        code and students take them securely with automatic
                        scoring.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <Link href="/signin" className="inline-flex items-center justify-center bg-[#efc15a] px-5 py-3 text-sm font-bold text-[#18312f] transition hover:bg-[#f5d47f]">
                            Sign in
                        </Link>
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center border border-[#8fb9ae] px-5 py-3 text-sm font-bold text-[#fffdf8] transition hover:bg-[#28534d]"
                        >
                            Create account
                        </Link>
                    </div>
                    </div>
                    <div className="relative flex min-h-56 items-end border-l border-[#46766c] pl-7">
                        <div className="absolute right-0 top-0 size-28 rounded-full border-[18px] border-[#d95f4f] opacity-90" />
                        <div className="relative z-10 w-full border-t border-[#46766c] pt-5">
                            <div className="text-5xl font-semibold text-[#efc15a]">01</div>
                            <p className="mt-2 max-w-xs text-sm leading-6 text-[#d4e4de]">Create, join, and understand every result from one focused workspace.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="rounded-[2px] border-t-4 border-[#0f766e] bg-[#fffdf8] p-5 shadow-[0_8px_24px_rgba(24,49,47,0.07)] flex items-center gap-4">
                        <div className="h-14 w-[82px] m-2 flex items-center justify-center rounded-full bg-[#d9eee9] text-[#0f766e]">
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
                            <div className="font-semibold text-[#18312f]">
                                Fast setup
                            </div>
                            <div className="mt-2 mr-8 text-sm text-[#58706b]">
                                Build MCQs, set duration, and share a join code.
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2px] border-t-4 border-[#d95f4f] bg-[#fffdf8] p-5 shadow-[0_8px_24px_rgba(24,49,47,0.07)] flex items-center gap-4">
                        <div className="h-14 w-[82px] m-2 flex items-center justify-center rounded-full bg-[#fae2dc] text-[#b94b3d]">
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
                            <div className="font-semibold text-[#18312f]">
                                Time-bound exams
                            </div>
                            <div className="mt-2 mr-8 text-sm text-[#58706b]">
                                Joining is blocked automatically after the end
                                time.
                            </div>
                        </div>
                    </div>
                    <div className="rounded-[2px] border-t-4 border-[#d99a24] bg-[#fffdf8] p-5 shadow-[0_8px_24px_rgba(24,49,47,0.07)] flex items-center gap-4">
                        <div className="h-14 w-[82px] m-2 flex items-center justify-center rounded-full bg-[#fff1c9] text-[#ad7410]">
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
                            <div className="font-semibold text-[#18312f]">
                                Auto scoring
                            </div>
                            <div className="mt-2 mr-8 text-sm text-[#58706b]">
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
