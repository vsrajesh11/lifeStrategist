import { supabase } from "../supabase";

export type Task = {
  id: string;
  title: string;
  description: string;
  estimated_time: number; // in minutes
  impact_score: number; // 1-100
  priority: "high" | "medium" | "low";
  completed: boolean;
  in_progress: boolean;
  goal_id?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
};

export const taskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }

    return data as Task[];
  },

  async createTask(task: Omit<Task, "id" | "created_at" | "updated_at">) {
    const { data, error } = await supabase.from("tasks").insert(task).select();

    if (error) {
      console.error("Error creating task:", error);
      return null;
    }

    return data[0] as Task;
  },

  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating task:", error);
      return null;
    }

    return data[0] as Task;
  },

  async deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.error("Error deleting task:", error);
      return false;
    }

    return true;
  },
};
