import { supabase } from "../supabase";

export type AIRecommendation = {
  id: string;
  task_id: string;
  recommendation_type: "priority" | "scheduling" | "strategy";
  content: string;
  reasoning: string;
  created_at: string;
  user_id: string;
};

export const aiService = {
  async getTaskPriorities(
    userId: string,
    tasks: any[],
  ): Promise<AIRecommendation[]> {
    try {
      // Call the OpenAI-powered edge function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-ai-strategist",
        {
          body: {
            userId,
            tasks,
            action: "prioritize",
          },
        },
      );

      if (error) throw error;
      return data.recommendations;
    } catch (err) {
      console.error("Error getting AI task priorities:", err);
      return [];
    }
  },

  async getTaskStrategies(
    userId: string,
    taskId: string,
  ): Promise<AIRecommendation | null> {
    try {
      // Call the OpenAI-powered edge function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-ai-strategist",
        {
          body: {
            userId,
            taskId,
            action: "strategy",
          },
        },
      );

      if (error) throw error;
      return data.recommendation;
    } catch (err) {
      console.error("Error getting AI task strategy:", err);
      return null;
    }
  },

  async processAgentPrompt(userId: string, prompt: string) {
    try {
      console.log("Calling AI agent with:", { userId, prompt });

      // Call the OpenAI-powered edge function
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-ai-strategist",
        {
          body: {
            userId,
            prompt,
            action: "agent",
          },
        },
      );

      if (error) {
        console.error("Error from edge function:", error);
        throw error;
      }

      console.log("AI agent response:", data);
      return data;
    } catch (err) {
      console.error("Error processing agent prompt:", err);
      return {
        error: err.message,
        response:
          "I'm having trouble connecting to the AI service. Please check that the OpenAI API key is correctly set in your Supabase project settings.",
      };
    }
  },

  async saveRecommendation(
    recommendation: Omit<AIRecommendation, "id" | "created_at">,
  ) {
    try {
      const { data, error } = await supabase
        .from("ai_recommendations")
        .insert(recommendation)
        .select();

      if (error) throw error;
      return data[0] as AIRecommendation;
    } catch (err) {
      console.error("Error saving AI recommendation:", err);
      return null;
    }
  },
};
