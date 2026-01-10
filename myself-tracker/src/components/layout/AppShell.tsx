// src/components/layout/AppShell.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login?redirect=" + encodeURIComponent(pathname));
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <p className="text-sm text-slate-300">Checking session…</p>
      </main>
    );
  }

  if (!user) {
    // While redirecting
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex">
      {/* Sidebar could go here later */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-4">
          <span className="text-sm font-medium">
            MakeUrselfBetter · <span className="text-slate-400">Dashboard</span>
          </span>
          <button
            onClick={async () => {
              await signOut();
              router.push("/");
            }}
            className="text-xs px-3 py-1.5 rounded-full border border-slate-700 hover:bg-slate-800 transition"
          >
            Sign out
          </button>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
