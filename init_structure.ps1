$ErrorActionPreference = "Stop"

$PROJECT_NAME = "myself-tracker"

Write-Host "Creating project folder: $PROJECT_NAME"
New-Item -ItemType Directory -Path $PROJECT_NAME -Force | Out-Null
Set-Location $PROJECT_NAME

Write-Host "Initializing basic project structure..."

# Helper to write files
function Write-File($Path, $Content) {
    $dir = Split-Path $Path
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    $Content | Set-Content -Path $Path -NoNewline
}

Write-File "package.json" @'
{
  "name": "myself-tracker",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "@supabase/supabase-js": "^2.48.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "@types/node": "^22.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "eslint": "^9.0.0"
  }
}
'@

Write-File "next.config.mjs" @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  }
};

export default nextConfig;
'@

Write-File "tsconfig.json" @'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
'@

Write-File "postcss.config.cjs" @'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
'@

Write-File "tailwind.config.cjs" @'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#208085",
          green: "#22C55E",
          amber: "#F59E0B",
          red: "#EF4444"
        }
      }
    }
  },
  plugins: []
};
'@

Write-File ".gitignore" @'
node_modules
.next
.env.local
'@

Write-File ".env.local" @'
NEXT_PUBLIC_SUPABASE_URL="https://YOUR-PROJECT-REF.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

NEXT_PUBLIC_APP_NAME="MakeUrselfBetter"
NEXT_PUBLIC_DEMO_MODE_WARNING="This is demo data only. Log in to use your own workspace."
'@

New-Item -ItemType Directory -Path "supabase" -Force | Out-Null

Write-File "supabase/schema.sql" @'
-- Supabase schema skeleton (fill with full definitions later)

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  username text,
  display_name text,
  age_years int,
  height_cm int,
  created_at timestamptz default now()
);

-- Add other tables here: daily_tasks, health_daily_metrics, skills, certifications, etc.
'@

Write-File "supabase/seed_demo.sql" @'
insert into profiles (user_id, username, display_name, age_years, height_cm)
values ('00000000-0000-0000-0000-000000000000', 'demo_user', 'Demo User', 22, 175);
'@

$dirs = @(
  "src/app/auth/login",
  "src/app/auth/register",
  "src/app/dashboard",
  "src/app/health",
  "src/app/skills",
  "src/app/certifications",
  "src/app/self-development",
  "src/app/finances",
  "src/app/riddles",
  "src/app/demo",
  "src/components/layout",
  "src/components/ui",
  "src/components/dashboard",
  "src/components/health",
  "src/components/skills",
  "src/components/certifications",
  "src/components/selfDevelopment",
  "src/components/finances",
  "src/components/riddles",
  "src/lib",
  "src/hooks",
  "src/styles"
)

foreach ($d in $dirs) {
    New-Item -ItemType Directory -Path $d -Force | Out-Null
}

Write-File "src/app/layout.tsx" @'
import "./globals.css";

export const metadata = {
  title: "MakeUrselfBetter",
  description: "Personal serverless tracker for you and your friends"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        {children}
      </body>
    </html>
  );
}
'@

Write-File "src/app/globals.css" @'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --brand-teal: #208085;
  --brand-green: #22C55E;
  --brand-amber: #F59E0B;
  --brand-red: #EF4444;
}
'@

Write-File "src/app/page.tsx" @'
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
'@

Write-File "src/app/auth/login/page.tsx" @'
"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login with", email);
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
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-brand-teal py-2.5 text-sm font-medium hover:bg-emerald-500 transition"
        >
          Sign in
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
'@

Write-File "src/app/auth/register/page.tsx" @'
"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register with", email);
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
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-full bg-brand-teal py-2.5 text-sm font-medium hover:bg-emerald-500 transition"
        >
          Sign up
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
'@

Write-File "src/app/demo/page.tsx" @'
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
'@

$routes = @("dashboard","health","skills","certifications","self-development","finances","riddles")

foreach ($route in $routes) {
    $name = $route -replace '-', '_'
    $content = @"
export default function ${name}Page() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">${route} (placeholder)</h1>
        <p className="text-slate-400 text-sm">
          This page will be implemented with full logic (Supabase + UI) in the next step.
        </p>
      </div>
    </main>
  );
}
"@
    Write-File "src/app/$route/page.tsx" $content
}

Write-File "src/lib/supabaseClient.ts" @'
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anonKey);
'@

Write-File "src/lib/demoData.ts" @'
export const demoUser = {
  id: "demo",
  name: "Demo User"
};
'@

Write-File "src/hooks/useAuth.ts" @'
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
'@

Write-Host "Project skeleton created."
Write-Host "Next steps:"
Write-Host "  1) cd $PROJECT_NAME"
Write-Host "  2) npm install (or pnpm/yarn)"
Write-Host "  3) Update .env.local with your Supabase URL & anon key"
Write-Host "  4) Run: npm run dev"
