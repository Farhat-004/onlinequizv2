 "use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function NavBar() {
  const session = useSession();
  const user = session?.data?.user as
    | { name?: string; email?: string; image?: string }
    | undefined;

  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center relative">
      <Link href={'/'} className="font-semibold text-black">eExam</Link>

      <button
        type="button"
        aria-label={mobileOpen ? "Close menu" : "Open menu"}
        className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded border text-black"
        onClick={() => setMobileOpen((v) => !v)}
      >
        <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      <div className="hidden md:flex gap-3 items-center">
        <Link href={'/create-quiz'} className="text-sm text-gray-600">Create Quiz</Link>
        <Link href={'/quiz'} className="text-sm text-gray-600">Exam</Link>
        {!user ? <Link href={'/signin'} className="text-sm text-gray-600">Sign-in</Link> : null}
        {user ? (
          <div className="flex items-center gap-2 pl-3 border-l">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <Link href={'/dashboard'}>
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
            <Link href={'/dashboard'}>
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
        ) : null}
      </div>

      {mobileOpen ? (
        <div className="md:hidden absolute left-0 right-0 top-full bg-white border-t shadow">
          <div className="p-4 flex flex-col gap-3">
            <Link onClick={() => setMobileOpen(false)} href={'/create-quiz'} className="text-sm text-gray-700">
              Create Quiz
            </Link>
            <Link onClick={() => setMobileOpen(false)} href={'/quiz'} className="text-sm text-gray-700">
              Exam
            </Link>
            {!user ? (
              <Link onClick={() => setMobileOpen(false)} href={'/signin'} className="text-sm text-gray-700">
                Sign-in
              </Link>
            ) : null}
            <button type="button" className="text-left text-sm text-gray-700">Feedback</button>
            <button type="button" className="text-left text-sm text-gray-700">Report</button>
            {user ? (
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
            ) : null}
          </div>
        </div>
      ) : null}
    </nav>
  )
}
