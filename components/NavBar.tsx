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
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center relative">
      <Link href={"/"} className="font-semibold text-black">
        eExam
      </Link>

      <button
        type="button"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded border text-black"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      <div className="hidden md:flex gap-3 items-center">
        {!user ? (
          <>
            <Link href={"/how-it-works"} className="text-sm text-gray-600">
              How it works
            </Link>
            <Link href={"/signup"} className="text-sm text-gray-600">
              Sign up
            </Link>
            <Link href={"/signin"} className="text-sm text-gray-600">
              Sign in
            </Link>
          </>
        ) : (
          <>
            {canTeach ? (
              <Link href={"/create-quiz"} className="text-sm text-gray-600">
                Create Quiz
              </Link>
            ) : null}
            <Link href={"/quiz"} className="text-sm text-gray-600">
              Exam
            </Link>
            <NavRoleSwitcher />
            <div className="flex items-center gap-2 pl-3 border-l">
              {user.image ? (
                <Link href={"/dashboard"}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- external OAuth avatars */}
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="h-8 w-8 rounded-full border"
                    referrerPolicy="no-referrer"
                  />
                </Link>
              ) : (
                <div className="h-8 w-8 rounded-full border bg-gray-100" />
              )}
              <div className="leading-tight">
                <Link href={"/dashboard"}>
                  <div className="text-sm font-semibold text-black">{user.name || "User"}</div>
                </Link>
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/signin" })}
                className="ml-2 px-3 py-2 rounded bg-gray-800 text-white text-sm"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>

      {mobileOpen ? (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-t shadow z-10">
          <div className="p-4 flex flex-col gap-3">
            {!user ? (
              <>
                <Link
                  onClick={() => setMobileOpen(false)}
                  href={"/how-it-works"}
                  className="text-sm text-gray-700"
                >
                  How it works
                </Link>
                <Link
                  onClick={() => setMobileOpen(false)}
                  href={"/signup"}
                  className="text-sm text-gray-700"
                >
                  Sign up
                </Link>
                <Link
                  onClick={() => setMobileOpen(false)}
                  href={"/signin"}
                  className="text-sm text-gray-700"
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
                    className="text-sm text-gray-700"
                  >
                    Create Quiz
                  </Link>
                ) : null}
                <Link onClick={() => setMobileOpen(false)} href={"/quiz"} className="text-sm text-gray-700">
                  Exam
                </Link>
                <div className="py-1">
                  <NavRoleSwitcher />
                </div>
                <button type="button" className="text-left text-sm text-gray-700">
                  Feedback
                </button>
                <button type="button" className="text-left text-sm text-gray-700">
                  Report
                </button>
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-8 w-8 rounded-full border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full border bg-gray-100" />
                    )}
                    <div className="text-sm font-semibold text-black">{user.name || "User"}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="mt-3 w-full px-3 py-2 rounded bg-gray-800 text-white text-sm"
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </nav>
  );
}
