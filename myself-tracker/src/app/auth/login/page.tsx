// src/app/auth/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl"
      >
        <h1 className="text-2xl font-semibold text-center">Sign in</h1>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-teal"
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-400 text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-teal py-2.5 text-sm font-medium hover:bg-emerald-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-xs text-slate-400 text-center">
          New here?{" "}
          <Link href="/auth/register" className="text-brand-teal underline">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
