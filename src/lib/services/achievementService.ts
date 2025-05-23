import { supabase } from "../supabase";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  date?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  due_date: string;
  reward: string;
  progress: number;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export type Streak = {
  current: number;
  best: number;
  last_updated: string;
  user_id: string;
};

export const achievementService = {
  async getAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching achievements:", error);
      return [];
    }

    return data as Achievement[];
  },

  async getMilestones(userId: string): Promise<Milestone[]> {
    const { data, error } = await supabase
      .from("milestones")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching milestones:", error);
      return [];
    }

    return data as Milestone[];
  },

  async getStreak(userId: string): Promise<Streak | null> {
    const { data, error } = await supabase
      .from("user_preferences")
      .select("streak_current, streak_best, streak_last_updated")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching streak:", error);
      return null;
    }

    if (!data) return null;

    return {
      current: data.streak_current || 0,
      best: data.streak_best || 0,
      last_updated: data.streak_last_updated || new Date().toISOString(),
      user_id: userId,
    };
  },

  async updateStreak(userId: string, streak: Partial<Streak>) {
    const { error } = await supabase
      .from("user_preferences")
      .update({
        streak_current: streak.current,
        streak_best: streak.best,
        streak_last_updated: streak.last_updated,
      })
      .eq("user_id", userId);

    if (error) {
      console.error("Error updating streak:", error);
      return false;
    }

    return true;
  },
};
