import Link from "next/link";

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Demo workspace</h1>
            <p className="text-slate-400 text-sm">
              This page uses hardcoded data to showcase features. Log in to
              unlock your own private tracker.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="px-4 py-2 rounded-full bg-brand-teal text-sm font-medium hover:bg-emerald-500 transition"
          >
            Log in
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-semibold mb-2">Dashboard</h2>
            <p className="text-xs text-slate-400">
              See demo productivity meters, tasks for today, and weekly summary.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-semibold mb-2">Health</h2>
            <p className="text-xs text-slate-400">
              Preview steps, calories and workout table structure.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="text-sm font-semibold mb-2">Skills & Finances</h2>
            <p className="text-xs text-slate-400">
              Explore how skill plans, certifications and money tracking are
              organized.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}