// src/app/auth/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setInfoMsg("");
    setSubmitting(true);
    try {
      const { user, session } = (await signUp(email, password)) as any;

      if (!session) {
        // If email confirmation is enabled, Supabase may not return a session.
        setInfoMsg(
          "Account created. Check your email to confirm your account before logging in."
        );
      } else {
        // Session exists, go straight to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to sign up");
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
        <h1 className="text-2xl font-semibold text-center">Create account</h1>
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
        {infoMsg && (
          <p className="text-xs text-emerald-400 text-center">{infoMsg}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand-teal py-2.5 text-sm font-medium hover:bg-emerald-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand-teal underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
