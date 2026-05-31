import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen home-bg flex items-center justify-center px-6 py-16">
      <section className="max-w-lg text-center">
        <div className="text-lg font-semibold tracking-wide text-indigo-700 uppercase">
          404
        </div>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-3 text-white">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-6 flex justify-center">
          <Link href="/" className="btn-primary">
            Return to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}

