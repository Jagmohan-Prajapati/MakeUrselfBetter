// src/components/dashboard/ProductivityMeter.tsx (DEBUG VERSION)
"use client";

import { useState, useEffect } from "react";

interface ProductivityMeterProps {
  score: number;
  label: string;
  color: string;
  infoContent: React.ReactNode;
}

export function ProductivityMeter({ score, label, color, infoContent }: ProductivityMeterProps) {
  const [showInfo, setShowInfo] = useState(false);
  const [debugInfo, setDebugInfo] = useState<{ time?: string; score?: string }>({});

  // FORCE RE-RENDER EVERY 1 SECOND
  useEffect(() => {
    const interval = setInterval(() => {
      setDebugInfo({
        time: new Date().toLocaleTimeString(),
        score: score.toFixed(1)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [score]);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 relative group">
      {/* DEBUG BADGE */}
      <div className="absolute top-2 right-2 text-xs bg-black/50 px-2 py-1 rounded text-emerald-400">
        {debugInfo.score || score.toFixed(1)}
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400 uppercase tracking-wider font-medium">{label}</p>
          <p className="text-3xl font-bold" style={{ color }}>
            <span className="text-4xl">{score.toFixed(1)}</span>
            <span className="text-xl font-normal">/10</span>
          </p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="px-3 py-1.5 text-xs bg-slate-800/50 border border-slate-700 rounded-full hover:bg-slate-700 transition"
        >
          More info
        </button>
      </div>

      {showInfo && (
        <div className="pt-4 border-t border-slate-800">
          <div className="max-h-48 overflow-auto p-3 bg-slate-950/80 rounded-xl text-sm space-y-2">
            {infoContent}
            {/* DEBUG INFO */}
            <details className="mt-3 p-2 bg-black/30 rounded text-xs">
              <summary className="cursor-pointer font-mono">Debug (click)</summary>
              <pre className="mt-1 text-emerald-400 text-xs overflow-auto max-h-20">
                Score: {score.toFixed(1)}
                Debug: {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}
