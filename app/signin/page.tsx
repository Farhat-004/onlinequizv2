'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { getSession, signIn, signOut } from 'next-auth/react'
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router=useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

	    try {
	      const result = await signIn("credentials", {
	        email,
	        password,
	        redirectTo: "/",
	        redirect: false,
	      });

	      if (!result || result.error) {
	        setError(result?.error || "Invalid email or password");
	        return;
	      }

	      const session = await getSession();
	      if (!session?.user) {
	        setError("Login succeeded but session was not created. Please refresh and try again.");
	        return;
	      }

	      router.replace(result?.url ?? "/");
	      router.refresh();
	    } catch (err) {
	      setError('An error occurred. Please try again.');
	      console.log(err);
    } finally {
      setLoading(false);
    }
  };

const handleSignin=async () => {
  setError('')
  setLoading(true)
  try {
    // Ensure we don't reuse an existing NextAuth session from a previous Google account.
    await signOut({ redirect: false })
    await signIn(
      "google",
      { callbackUrl: "/" },
      // Force Google's account picker instead of silently using the last authorized account.
      { prompt: "select_account" },
    )
  } catch (err) {
    console.error(err)
    setError('Google sign-in failed. Please try again.')
  } finally {
    setLoading(false)
  }
}
  return (
    <div className="min-h-screen app-bg flex items-center justify-center px-4 py-12 home-bg">
        <div className="w-full max-w-md glass-card p-8">
          <h1 className="text-2xl font-bold mb-2 text-slate-900 text-center">Sign in</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label mb-0">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>
            <div>
              <label htmlFor="password" className="label mb-0">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary mt-2">
              Sign In
            </button>

          </form>
          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <div className="text-xs font-semibold text-slate-500">OR</div>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <button
            disabled={loading}
            onClick={handleSignin}
            className="w-full btn-outline mt-4 disabled:opacity-60"
          >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <path
                  d="M21.35 11.1h-9.18v2.98h5.26c-.23 1.25-1.41 3.67-5.26 3.67-3.16 0-5.73-2.62-5.73-5.85s2.57-5.85 5.73-5.85c1.8 0 3.01.77 3.7 1.44l2.52-2.43C16.79 3.57 14.74 2.5 12.17 2.5 6.97 2.5 2.75 6.8 2.75 11.9s4.22 9.4 9.42 9.4c5.43 0 9.02-3.83 9.02-9.22 0-.62-.07-1.1-.16-1.58Z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </button>

          <p className="text-sm text-slate-600 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-700 hover:text-indigo-800 font-semibold">
              Sign up
            </Link>
          </p>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </div>
        
    </div>
    
  )
}
