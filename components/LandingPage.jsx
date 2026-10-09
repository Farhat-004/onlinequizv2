import Link from "next/link";
import Image from "next/image";

const steps = [
    [
        "01",
        "Build with purpose",
        "Create focused assessments with a schedule, duration, and secure join code.",
        "border-[#0f766e]",
    ],
    [
        "02",
        "Join without friction",
        "Students enter the code, confirm their identity, and begin with a clear time limit.",
        "border-[#d95f4f]",
    ],
    [
        "03",
        "Learn from the result",
        "Automatic scoring gives students useful feedback and teachers a readable record.",
        "border-[#d99a24]",
    ],
];

export default function LandingPage() {
    return (
        <main className="flex-1 bg-[#f4f1ea] text-[#18312f]">
            <section className="home-bg overflow-hidden border-b border-[#d8dfd8]">
                <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-14 md:grid-cols-[1fr_0.9fr] md:py-20">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0f766e]">
                            <span className="size-2 bg-[#d95f4f]" />
                            Assessment, made human
                        </div>
                        <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl">
                            Better questions.
                            <br />
                            <span className="text-[#0f766e]">
                                Clearer progress.
                            </span>
                        </h1>
                        <p className="mt-6 max-w-xl text-lg leading-8 text-[#58706b]">
                            OnlineQuiz gives teachers a calm place to create
                            assessments and students a focused way to show what
                            they know.
                        </p>
                        <div className="mt-8 flex flex-wrap items-center gap-3">
                            <Link
                                href="/signup"
                                className="btn-primary px-6 py-3"
                            >
                                Start for free
                            </Link>
                            <Link
                                href="/how-it-works"
                                className="btn-outline px-6 py-3"
                            >
                                See how it works
                            </Link>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#35514d]">
                            <span className="inline-flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[#0f766e]" />
                                Automatic scoring
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[#d95f4f]" />
                                Timed assessments
                            </span>
                            <span className="inline-flex items-center gap-2">
                                <span className="size-2 rounded-full bg-[#d99a24]" />
                                Actionable results
                            </span>
                        </div>
                    </div>
                    <div className="relative min-h-[390px] overflow-hidden border border-[#b9cbc3] bg-[#18312f] p-4 shadow-[0_20px_45px_rgba(24,49,47,0.18)] md:min-h-[470px]">
                        <Image
                            src="/bgweb.jpg"
                            alt="Abstract blue and cream study desk texture"
                            fill
                            sizes="(max-width: 768px) 100vw, 45vw"
                            className="object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-[#18312f]/45" />
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div className="flex items-center justify-between border-b border-[#8fb9ae]/50 pb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#d4e4de]">
                                <span>Live assessment</span>
                                <span className="flex items-center gap-2 text-[#efc15a]">
                                    <span className="size-2 rounded-full bg-[#efc15a]" />
                                    08:42
                                </span>
                            </div>
                            <div className="mx-auto w-full max-w-sm bg-[#fffdf8] p-5 text-[#18312f] shadow-[0_16px_30px_rgba(0,0,0,0.16)]">
                                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.14em] text-[#0f766e]">
                                    <span>Question 04</span>
                                    <span>8 of 12</span>
                                </div>
                                <h2 className="mt-5 text-xl font-bold leading-snug">
                                    Which habit makes learning stick?
                                </h2>
                                <div className="mt-5 space-y-2">
                                    <div className="border border-[#0f766e] bg-[#d9eee9] px-3 py-3 text-sm font-semibold">
                                        Retrieval and reflection
                                    </div>
                                    <div className="border border-[#d8dfd8] px-3 py-3 text-sm text-[#58706b]">
                                        Reading the same page again
                                    </div>
                                    <div className="border border-[#d8dfd8] px-3 py-3 text-sm text-[#58706b]">
                                        Waiting until the deadline
                                    </div>
                                </div>
                                <div className="mt-5 flex items-center justify-between border-t border-[#d8dfd8] pt-4 text-xs font-bold text-[#58706b]">
                                    <span>1 point</span>
                                    <span className="text-[#d95f4f]">
                                        Focused mode
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-end justify-between border-t border-[#8fb9ae]/50 pt-4 text-[#d4e4de]">
                                <span className="text-4xl font-bold text-[#efc15a]">
                                    01
                                </span>
                                <span className="max-w-[170px] text-right text-sm leading-5">
                                    A simple flow for thoughtful assessment.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="border-b border-[#d8dfd8] bg-[#fffdf8]">
                <div className="mx-auto grid max-w-6xl divide-y divide-[#d8dfd8] px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    <div className="py-4 sm:px-8 sm:py-2">
                        <div className="text-3xl font-bold text-[#0f766e]">
                            01
                        </div>
                        <div className="mt-1 text-sm text-[#58706b]">
                            workspace for every role
                        </div>
                    </div>
                    <div className="py-4 sm:px-8 sm:py-2">
                        <div className="text-3xl font-bold text-[#d95f4f]">
                            MCQ
                        </div>
                        <div className="mt-1 text-sm text-[#58706b]">
                            focused assessments, less admin
                        </div>
                    </div>
                    <div className="py-4 sm:px-8 sm:py-2">
                        <div className="text-3xl font-bold text-[#ad7410]">
                            100%
                        </div>
                        <div className="mt-1 text-sm text-[#58706b]">
                            clearer feedback after every attempt
                        </div>
                    </div>
                </div>
            </section>
            <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
                <div className="max-w-2xl">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#d95f4f]">
                        Designed around the moment
                    </div>
                    <h2 className="mt-3 text-3xl font-bold leading-tight md:text-5xl">
                        Everything people need before, during, and after an
                        exam.
                    </h2>
                </div>
                <div className="mt-12 grid gap-5 md:grid-cols-3">
                    {steps.map(([number, title, text, color]) => (
                        <article
                            key={number}
                            className={`border-t-4 ${color} bg-[#fffdf8] p-6 shadow-[0_8px_24px_rgba(24,49,47,0.06)]`}
                        >
                            <div className="text-4xl font-bold text-[#d8dfd8]">
                                {number}
                            </div>
                            <h3 className="mt-7 text-xl font-bold">{title}</h3>
                            <p className="mt-3 text-sm leading-6 text-[#58706b]">
                                {text}
                            </p>
                        </article>
                    ))}
                </div>
            </section>
            <section className="bg-[#18312f] text-[#fffdf8]">
                <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-6 py-14 md:flex-row md:items-center md:py-16">
                    <div>
                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#efc15a]">
                            Ready when you are
                        </div>
                        <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
                            Make the next assessment feel more considered.
                        </h2>
                        <p className="mt-4 max-w-xl text-[#d4e4de]">
                            Create an account and give your next quiz a better
                            beginning and a more useful ending.
                        </p>
                    </div>
                    <Link
                        href="/signup"
                        className="inline-flex shrink-0 items-center justify-center bg-[#efc15a] px-6 py-3 font-bold text-[#18312f] transition hover:bg-[#f5d47f]"
                    >
                        Create your account
                    </Link>
                </div>
            </section>
        </main>
    );
}
