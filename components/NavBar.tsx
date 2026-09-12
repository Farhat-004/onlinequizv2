"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import NavRoleSwitcher from "@/components/NavRoleSwitcher";

export default function NavBar() {
  const session = useSession();
  const user = session?.data?.user as
    | { name?: string; email?: string; image?: string }
    | undefined;

  const sess = session?.data as { roles?: unknown } | null | undefined;
  const roles = Array.isArray(sess?.roles)
    ? (sess!.roles as string[]).filter((r) => r === "teacher" || r === "student")
    : [];
  const canTeach = roles.includes("teacher");

  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <nav className="w-full sticky top-0 z-40 border-b border-[#d8dfd8] bg-[#fffdf8] bg-image1">
      <div className="mx-auto max-w-6xl px-4 py-3 flex justify-between items-center relative">
        <Link href={"/"} className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid size-9 place-items-center rounded-[2px] bg-[#0f766e] text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="size-4" fill="none" aria-hidden="true">
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
          </span>
          OnlineQuiz
        </Link>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-[2px] border border-[#cbd8d2] bg-[#fffdf8] text-[#18312f] shadow-sm"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
        </button>

        <div className="hidden md:flex gap-3 items-center">
          {!user ? (
            <>
              <Link href={"/how-it-works"} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                How it works
              </Link>
              <Link href={"/signup"} className="btn-outline">
                Sign up
              </Link>
              <Link href={"/signin"} className="btn-primary">
                Sign in
              </Link>
            </>
          ) : (
            <>
              {canTeach ? (
                <Link href={"/create-quiz"} className="text-sm font-medium text-slate-600 hover:text-slate-900">
                  Create Quiz
                </Link>
              ) : null}
              <NavRoleSwitcher />
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                {user.image ? (
                  <Link href={"/dashboard"} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element -- external OAuth avatars */}
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-9 w-9 rounded-2xl border border-slate-200 object-cover shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                ) : (
                  <div className="h-9 w-9 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm" />
                )}
                <div className="leading-tight min-w-0">
                  <Link href={"/dashboard"}>
                    <div className="text-sm font-semibold text-slate-900 truncate">{user.name || "User"}</div>
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: "/signin" })}
                  className="ml-2 btn-dark"
                >
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>

        {mobileOpen ? (
          <div className="md:hidden absolute left-0 right-0 top-full border-t border-[#d8dfd8] bg-[#fffdf8] shadow z-10">
            <div className="p-4 flex flex-col gap-3">
              {!user ? (
                <>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    href={"/how-it-works"}
                    className="text-sm font-medium text-slate-700"
                  >
                    How it works
                  </Link>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    href={"/signup"}
                    className="text-sm font-medium text-slate-700"
                  >
                    Sign up
                  </Link>
                  <Link
                    onClick={() => setMobileOpen(false)}
                    href={"/signin"}
                    className="text-sm font-medium text-slate-700"
                  >
                    Sign in
                  </Link>
                </>
              ) : (
                <>
                  {canTeach ? (
                    <Link
                      onClick={() => setMobileOpen(false)}
                      href={"/create-quiz"}
                      className="text-sm font-medium text-slate-700"
                    >
                      Create Quiz
                    </Link>
                  ) : null}
                  <Link
                    onClick={() => setMobileOpen(false)}
                    href={"/quiz"}
                    className="text-sm font-medium text-slate-700"
                  >
                    Exam
                  </Link>
                  <div className="py-1">
                    <NavRoleSwitcher />
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                      {user.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user.image}
                          alt={user.name || "User"}
                          className="h-9 w-9 rounded-2xl border border-slate-200 object-cover shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-9 w-9 rounded-2xl border border-slate-200 bg-slate-50 shadow-sm" />
                      )}
                      <div className="text-sm font-semibold text-slate-900">{user.name || "User"}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/signin" })}
                      className="mt-3 w-full btn-dark"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
