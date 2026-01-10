// src/components/dashboard/DashboardGreeting.tsx
export function DashboardGreeting({ username }: { username: string }) {
  return (
    <div className="mb-8 pb-6 border-b border-slate-800">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent mb-2">
        Hello, {username}!
      </h1>
      <p className="text-slate-400 max-w-md">
        Here's how you're doing today. Add tasks above and watch your productivity score update live.
      </p>
    </div>
  );
}
