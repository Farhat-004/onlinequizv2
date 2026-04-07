export default function SideBar() {
  return (
    <aside className="w-64 bg-white p-4 border-r">
      <div className="mb-6">
        <div className="h-12 w-12 bg-gray-200 rounded-full mb-2" />
        <div className="font-semibold">Student Name</div>
        <div className="text-sm text-gray-500">student@example.com</div>
      </div>
      <nav className="flex flex-col gap-2">
        <a className="text-sm text-gray-700">Results</a>
        <a className="text-sm text-gray-700">Profile</a>
      </nav>
    </aside>
  )
}
