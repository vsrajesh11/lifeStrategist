import { supabase } from "../supabase";
import type { Database } from "@/types/supabase";

export type Goal = {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  progress: number;
  impact: number;
  type: "lifetime" | "medium-term" | "daily";
  parent_goal_id?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type GoalWithChildren = Goal & {
  children?: GoalWithChildren[];
  expanded?: boolean;
};

export const goalService = {
  async getGoals(userId: string): Promise<Goal[]> {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching goals:", error);
      return [];
    }

    return data as Goal[];
  },

  async createGoal(goal: Omit<Goal, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("goals").insert(goal).select();

    if (error) {
      console.error("Error creating goal:", error);
      return null;
    }

    return data[0] as Goal;
  },

  async updateGoal(id: string, updates: Partial<Goal>) {
    const { data, error } = await supabase
      .from("goals")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating goal:", error);
      return null;
    }

    return data[0] as Goal;
  },

  async deleteGoal(id: string) {
    const { error } = await supabase.from("goals").delete().eq("id", id);

    if (error) {
      console.error("Error deleting goal:", error);
      return false;
    }

    return true;
  },

  // Helper function to organize goals into a hierarchy
  organizeGoalHierarchy(goals: Goal[]): GoalWithChildren[] {
    const goalMap = new Map<string, GoalWithChildren>();
    const rootGoals: GoalWithChildren[] = [];

    // First pass: Create all goal objects with their basic properties
    goals.forEach((goal) => {
      goalMap.set(goal.id, { ...goal, children: [] });
    });

    // Second pass: Organize into hierarchy
    goals.forEach((goal) => {
      const goalWithChildren = goalMap.get(goal.id)!;

      if (goal.parent_goal_id && goalMap.has(goal.parent_goal_id)) {
        // This is a child goal, add it to its parent
        const parent = goalMap.get(goal.parent_goal_id)!;
        parent.children!.push(goalWithChildren);
      } else {
        // This is a root goal
        rootGoals.push(goalWithChildren);
      }
    });

    return rootGoals;
  },
};
