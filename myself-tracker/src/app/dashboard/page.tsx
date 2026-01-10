// src/app/dashboard/page.tsx (NO AUTO-REFRESH)
"use client";

import { DashboardGreeting } from "@/components/dashboard/DashboardGreeting";
import { ProductivityMeter } from "@/components/dashboard/ProductivityMeter";
import { DashboardTodayTasks } from "@/components/dashboard/DashboardTodayTasks";
import { useDashboardData } from "@/hooks/useDashboardData";
import { AppShell } from "@/components/layout/AppShell";

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading dashboard...</div>
        </div>
      </AppShell>
    );
  }

  if (error || !data) {
    return (
      <AppShell>
        <div className="p-8 text-center">
          <h1 className="text-2xl font-semibold mb-4">Error loading dashboard</h1>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="px-6 py-2 bg-brand-teal text-white rounded-xl font-medium"
          >
            🔄 Refresh
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="px-4 py-6 max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center mb-4">
          <DashboardGreeting username={data.profile?.display_name || data.profile?.username || 'User'} />
          <button
            onClick={refetch}
            className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition text-sm"
          >
            🔄 Refresh Data
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProductivityMeter
            score={data.prevDayScore}
            label="Yesterday"
            color="#10B981"
            infoContent={
              <div>
                <p className="font-medium mb-2">Previous day:</p>
                <p>Total: {data.yesterdayTasks.length}</p>
                <p>Completed: {data.yesterdayTasks.filter((t: any) => t.is_completed).length}</p>
              </div>
            }
          />
          
          <ProductivityMeter
            score={data.currentDayScore}
            label="Today"
            color="#3B82F6"
            infoContent={
              <div>
                <p className="font-medium mb-2">Today so far:</p>
                <p><strong>Total: {data.todayTasks.length}</strong></p>
                <p><strong>Completed: {data.todayTasks.filter((t: any) => t.is_completed).length}</strong></p>
                {data.todayTasks.filter((t: any) => t.is_completed && t.satisfaction_score).length > 0 && (
                  <p>
                    Rating: {Math.round(
                      data.todayTasks
                        .filter((t: any) => t.is_completed && t.satisfaction_score)
                        .reduce((sum: number, t: any) => sum + t.satisfaction_score!, 0) / 
                      data.todayTasks.filter((t: any) => t.is_completed && t.satisfaction_score).length
                    )}/10
                  </p>
                )}
              </div>
            }
          />
          
          <ProductivityMeter
            score={data.weeklyScore}
            label="This Week"
            color="#F59E0B"
            infoContent={
              <div>
                <p className="font-medium mb-2">7-day average:</p>
                {data.weekTasks.slice(0, 3).map((dayTasks: any[], i: number) => (
                  <p key={i} className="text-xs">
                    Day {i + 1}: {dayTasks.filter((t: any) => t.is_completed).length}/{dayTasks.length}
                  </p>
                ))}
              </div>
            }
          />
        </div>

        <DashboardTodayTasks />
      </div>
    </AppShell>
  );
}
