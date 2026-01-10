// src/components/dashboard/DashboardTodayTasks.tsx (FULLY FIXED)
"use client";

import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";

function TaskRow({ task, onToggle, onDelete }: any) {
  const [localSatisfaction, setLocalSatisfaction] = useState(task.satisfaction_score || 5);
  const [showRating, setShowRating] = useState(!!task.satisfaction_score); // Show if already rated

  // FIXED: Separate functions for toggle vs rating
  const handleToggle = () => {
    console.log("Toggle complete:", task.id);
    onToggle(task.id, !task.is_completed, task.satisfaction_score || localSatisfaction);
  };

  // FIXED: Save rating WITHOUT toggling complete status
  const handleSaveRating = async () => {
    console.log("Saving rating for task:", task.id, localSatisfaction);
    
    // Call toggleTask with SAME complete status + new satisfaction
    await onToggle(task.id, task.is_completed, localSatisfaction);
    setShowRating(true);
  };

  return (
    <div className="flex items-center gap-3 p-4 border border-slate-800 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-all group">
      {/* Checkbox - Toggle complete/incomplete */}
      <button
        onClick={handleToggle}
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${
          task.is_completed
            ? "bg-emerald-500 border-emerald-500 shadow-md"
            : "border-slate-600 hover:border-brand-teal hover:shadow-lg"
        }`}
        title={task.is_completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.is_completed && (
          <svg className="w-3 h-3 text-slate-900" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        )}
      </button>
      
      {/* Task details */}
      <div className="flex-1 min-w-0">
        <p className={`font-medium text-sm truncate pr-2 ${
          task.is_completed ? 'line-through text-slate-500' : 'text-slate-100'
        }`}>
          {task.task_name}
        </p>
        
        {/* Satisfaction Rating - VISIBLE FOR COMPLETED TASKS */}
        {task.is_completed && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-slate-800/50 rounded-lg">
            <span className="text-xs text-amber-400 font-bold">★</span>
            <div className="flex items-center gap-2 flex-1">
              <input
                id={`rating-${task.id}`}
                type="range"
                min="1"
                max="10"
                value={localSatisfaction}
                onChange={(e) => setLocalSatisfaction(Number(e.target.value))}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400"
              />
              <span className="text-sm font-mono text-slate-300 min-w-[2rem] text-right">
                {localSatisfaction}/10
              </span>
            </div>
            <button
              onClick={handleSaveRating}
              className="text-xs px-3 py-1 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-full hover:bg-amber-500/40 transition whitespace-nowrap"
            >
              Save ★
            </button>
          </div>
        )}
      </div>
      
      {/* Delete */}
      <button
        onClick={() => onDelete(task.id)}
        className="text-xs px-3 py-1 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full transition ml-2"
        title="Delete task"
      >
        ✕
      </button>
    </div>
  );
}


export function DashboardTodayTasks() {
  const [newTask, setNewTask] = useState("");
  const { data, addTask, toggleTask, deleteTask, loading } = useDashboardData();

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    try {
      await addTask(newTask.trim());
      setNewTask("");
    } catch (err) {
      console.error("Add task failed:", err);
    }
  };

  if (loading || !data) return <div className="p-8 text-center text-slate-400">Loading tasks...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        Tasks for today
        <span className="text-sm text-slate-400">({data.todayTasks.length})</span>
      </h3>
      
      <form onSubmit={handleAddTask} className="flex gap-2 mb-6 p-3 bg-slate-900/50 border border-slate-800 rounded-xl">
        <input
          id="new-task-input"
          name="new-task"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="e.g. 'Run 5km', 'Code 2hrs', 'Read 30min'..."
          className="flex-1 bg-transparent border-0 outline-none text-slate-100 placeholder-slate-500 text-sm px-3 py-2 focus:ring-2 focus:ring-brand-teal rounded-lg"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-brand-teal text-white rounded-lg font-medium hover:bg-emerald-500 transition-all whitespace-nowrap shadow-lg hover:shadow-xl"
        >
          Add Task
        </button>
      </form>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {data.todayTasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
            <p className="text-lg mb-2">📝 No tasks yet</p>
            <p className="text-sm">Add your first task above to get started!</p>
          </div>
        ) : (
          data.todayTasks.map((task: any) => (
            <TaskRow
              key={task.id}  // ← CRITICAL: Unique key prevents re-rendering issues
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
