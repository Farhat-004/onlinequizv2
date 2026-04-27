import { auth } from '@/auth'
import Link from 'next/link'

export default async function Home() {
  const session=await auth()
  if(session)console.log(session)
  return (
    <div className="min-h-screen flex items-center justify-center home-bg">
      <div className="max-w-xl w-full p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-semibold mb-4 text-amber-700">eExam</h1>
        <p className="mb-6 text-gray-600">Sign in as:</p>
        <div className="flex gap-4">
          <Link href="/student/dashboard" className="flex-1 py-3 text-center bg-blue-600 text-white rounded">Student</Link>
          <Link href="/teacher/dashboard" className="flex-1 py-3 text-center bg-green-600 text-white rounded">Teacher</Link>
        </div>
      </div>
    </div>
  )
}
