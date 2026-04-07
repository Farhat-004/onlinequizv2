import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full bg-white shadow p-4 flex justify-between items-center">
      <Link href={'/'} className="font-semibold">eExam</Link>
      <div className="flex gap-3">
        <button className="text-sm text-gray-600">Feedback</button>
        <button className="text-sm text-gray-600">Report</button>
      </div>
    </nav>
  )
}
