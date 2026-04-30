 "use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function NavBar() {
  const session = useSession();
  const user = session?.data?.user as
    | { name?: string; email?: string; image?: string }
    | undefined;

  return (
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center">
      <Link href={'/'} className="font-semibold text-black">eExam</Link>
      <div className="flex gap-3 items-center">
        <Link href={'/create-quiz'} className="text-sm text-gray-600">Create Quiz</Link>
        <Link href={'/quiz'} className="text-sm text-gray-600">Exam</Link>
        {!user ? <Link href={'/signin'} className="text-sm text-gray-600">Sign-in</Link> : null}
        <button className="text-sm text-gray-600">Feedback</button>
        <button className="text-sm text-gray-600">Report</button>
        {user ? (
          <div className="flex items-center gap-2 pl-3 border-l">
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
            <div className="leading-tight">
              <div className="text-sm font-semibold text-black">{user.name || "User"}</div>
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
    </nav>
  )
}
