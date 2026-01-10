// src/hooks/useDashboardData.ts
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { calculateCurrentDayScore, calculatePreviousDayScore, calculateWeeklyScore } from "@/lib/productivity";

export type DashboardData = {
  todayTasks: any[];
  yesterdayTasks: any[];
  weekTasks: any[][];
  currentDayScore: number;
  prevDayScore: number;
  weeklyScore: number;
  profile: any | null;
};

export function useDashboardData() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user");

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const todayStr = today.toISOString().split('T')[0];
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Get profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      // Get TODAY'S tasks
      const { data: todayTasks = [] } = await supabase
  .from('daily_tasks')
  .select('*')
  .eq('user_id', user.id)
  .eq('date', todayStr) // Must match EXACTLY what you inserted
  .order('created_at', { ascending: false });

      // Yesterday's tasks
      const { data: yesterdayTasks = [] } = await supabase
        .from('daily_tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', yesterdayStr);

      // Week (7 days back)
      const weekTasks: any[][] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const { data = [] } = await supabase
          .from('daily_tasks')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', dateStr);
        weekTasks.unshift(data || []);
      }

      const currentDayScore = calculateCurrentDayScore(todayTasks || []);
      const prevDayScore = calculatePreviousDayScore(yesterdayTasks || []);
      const weeklyScore = calculateWeeklyScore(weekTasks);

      console.log("Dashboard loaded:", { todayTasks: (todayTasks ?? []).length, todayStr });

      setData({
        todayTasks: todayTasks || [],
        yesterdayTasks: yesterdayTasks || [],
        weekTasks,
        currentDayScore,
        prevDayScore,
        weeklyScore,
        profile: profile || { username: 'User', display_name: 'User' }
      });
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (taskName: string) => {
    console.log("Adding task:", taskName);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data: newTask, error } = await supabase
      .from('daily_tasks')
      .insert({
        user_id: user!.id,
        task_name: taskName,
        date: new Date().toISOString().split('T')[0]
      })
      .select()
      .single();

    if (error) throw error;
    
    console.log("Task added:", newTask);
    
    // ADD TO EXISTING LIST - NO FULL REFRESH
    setData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        todayTasks: [newTask, ...prev.todayTasks]
      };
    });
    
    return newTask;
  };

  const toggleTask = async (taskId: string, isCompleted: boolean, satisfaction?: number) => {
    console.log("🔄 Toggling task:", taskId);
    
    const { error } = await supabase
      .from('daily_tasks')
      .update({ 
        is_completed: isCompleted,
        satisfaction_score: satisfaction || null 
      })
      .eq('id', taskId);

    if (error) {
      console.error("Toggle error:", error);
      throw error;
    }

    // Refresh ONLY today's tasks
    const { data: { user } } = await supabase.auth.getUser();
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: todayTasks = [] } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', user!.id)
      .eq('date', todayStr)
      .order('created_at', { ascending: false });

    setData(prev => prev ? ({
      ...prev,
      todayTasks: todayTasks || [],
      currentDayScore: calculateCurrentDayScore(todayTasks || [])
    }) : null);
    
    console.log("✅ Task toggled, refreshed list:", (todayTasks || []).length);
  };

  const deleteTask = async (taskId: string) => {
    console.log("🗑️ Deleting task:", taskId);
    
    const { error } = await supabase
      .from('daily_tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error("Delete error:", error);
      throw error;
    }

    // Refresh ONLY today's tasks
    const { data: { user } } = await supabase.auth.getUser();
    const todayStr = new Date().toISOString().split('T')[0];
    const { data: todayTasks = [] } = await supabase
      .from('daily_tasks')
      .select('*')
      .eq('user_id', user!.id)
      .eq('date', todayStr)
      .order('created_at', { ascending: false });

    setData(prev => prev ? ({
      ...prev,
      todayTasks: todayTasks || [],
      currentDayScore: calculateCurrentDayScore(todayTasks || [])
    }) : null);
    
    console.log("✅ Task deleted, remaining:", (todayTasks || []).length);
  };

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
    addTask,
    toggleTask,
    deleteTask
  };
}
