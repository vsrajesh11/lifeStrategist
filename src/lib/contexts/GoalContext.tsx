import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../auth";
import { goalService, GoalWithChildren } from "../services/goalService";
import { taskService, Task } from "../services/taskService";
import {
  achievementService,
  Achievement,
  Milestone,
  Streak,
} from "../services/achievementService";

type GoalContextType = {
  goals: GoalWithChildren[];
  tasks: Task[];
  achievements: Achievement[];
  milestones: Milestone[];
  streak: Streak | null;
  completionRate: number;
  weeklyProgress: number[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
};

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<GoalWithChildren[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [completionRate, setCompletionRate] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Fetching data for user:", user.id);

      // Fetch goals
      const goalsData = await goalService.getGoals(user.id);
      console.log("Goals data fetched:", goalsData);
      const hierarchicalGoals = goalService.organizeGoalHierarchy(goalsData);
      console.log("Hierarchical goals:", hierarchicalGoals);
      setGoals(hierarchicalGoals);

      // Fetch tasks
      const tasksData = await taskService.getTasks(user.id);
      console.log("Tasks data fetched:", tasksData);
      setTasks(tasksData);

      // Calculate completion rate
      const completedTasks = tasksData.filter((task) => task.completed).length;
      const rate =
        tasksData.length > 0 ? (completedTasks / tasksData.length) * 100 : 0;
      setCompletionRate(rate);

      // Fetch achievements
      const achievementsData = await achievementService.getAchievements(
        user.id,
      );
      setAchievements(achievementsData);

      // Fetch milestones
      const milestonesData = await achievementService.getMilestones(user.id);
      setMilestones(milestonesData);

      // Fetch streak
      const streakData = await achievementService.getStreak(user.id);
      setStreak(streakData);

      // Generate mock weekly progress for now
      // In a real app, this would be calculated from historical data
      setWeeklyProgress([65, 70, 75, 72, 78, 80, 78]);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const value = {
    goals,
    tasks,
    achievements,
    milestones,
    streak,
    completionRate,
    weeklyProgress,
    loading,
    error,
    refreshData: fetchData,
  };

  return <GoalContext.Provider value={value}>{children}</GoalContext.Provider>;
}

export function useGoals() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error("useGoals must be used within a GoalProvider");
  }
  return context;
}
