// src/lib/productivity.ts (FIXED)
export function calculateCurrentDayScore(tasks: any[]): number {
  console.log("Calculating score for tasks:", tasks.length); // Debug
  
  if (!tasks || tasks.length === 0) {
    console.log("No tasks, score = 0");
    return 0;
  }

  const completed = tasks.filter((t: any) => t.is_completed === true).length;
  console.log("Completed tasks:", completed, "Total:", tasks.length);
  
  const total = tasks.length;
  const completionRate = completed / total;

  const satisfactionSum = tasks
    .filter((t: any) => t.is_completed === true && t.satisfaction_score && t.satisfaction_score > 0)
    .reduce((sum: number, t: any) => sum + (t.satisfaction_score || 0), 0);
    
  const avgSatisfaction = satisfactionSum / Math.max(completed, 1);
  console.log("Avg satisfaction:", avgSatisfaction);

  // Weighted: 70% completion + 30% satisfaction (0-10 scale)
  const score = Math.round((completionRate * 7 + (avgSatisfaction / 10) * 3) * 10) / 10;
  console.log("Final score:", score);
  
  return score;
}

export function calculatePreviousDayScore(tasks: any[]): number {
  return calculateCurrentDayScore(tasks);
}

export function calculateWeeklyScore(tasksByDay: any[][]): number {
  const dailyScores = tasksByDay.map(calculateCurrentDayScore);
  return dailyScores.length > 0 
    ? Math.round(dailyScores.reduce((a, b) => a + b, 0) / dailyScores.length * 10) / 10
    : 0;
}
