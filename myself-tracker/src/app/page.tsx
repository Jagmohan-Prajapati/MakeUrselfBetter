import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 px-4">
      <section className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          MakeUrselfBetter
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto">
          Crafting excellence in you. Track your day, habits, skills, health,
          money and thinking — all in one calm, focused dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 rounded-full bg-brand-teal text-white font-medium shadow-lg shadow-emerald-500/25 hover:bg-emerald-500 transition"
          >
            Start using
          </Link>
          <Link
            href="/demo"
            className="px-6 py-3 rounded-full border border-slate-600 text-slate-100 hover:bg-slate-800/60 transition"
          >
            Explore software (demo)
          </Link>
        </div>
      </section>
    </main>
  );
}