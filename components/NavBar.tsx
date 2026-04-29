import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center">
      <Link href={'/'} className="font-semibold text-black">eExam</Link>
      <div className="flex gap-3">
        <Link href={'/create-quiz'} className="text-sm text-gray-600">Create Quiz</Link>
        <Link href={'/quiz'} className="text-sm text-gray-600">Exam</Link>
        <Link href={'/signin'} className="text-sm text-gray-600">Sign-in</Link>
        <button className="text-sm text-gray-600">Feedback</button>
        <button className="text-sm text-gray-600">Report</button>
      </div>
    </nav>
  )
}
