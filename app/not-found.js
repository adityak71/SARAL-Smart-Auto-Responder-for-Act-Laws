import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center bg-slate-50 dark:bg-[#121821] text-slate-800 dark:text-slate-100">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-300 text-2xl font-bold mb-4">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Document or Page Not Found
      </h1>
      <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-md">
        The requested statutory petition, departmental directory, or page could not be located on the SARAL portal.
      </p>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md transition"
        >
          Return to Home
        </Link>
        <Link
          href="/general-info"
          className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-sm transition"
        >
          Search Knowledge Hub
        </Link>
      </div>
    </div>
  );
}
