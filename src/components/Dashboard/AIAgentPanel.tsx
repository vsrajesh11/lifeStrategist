import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { aiService } from "@/lib/services/aiService";
import { useAuth } from "@/lib/auth";
import { useGoals } from "@/lib/contexts/GoalContext";
import { Loader2, Sparkles, Send, Plus } from "lucide-react";

interface AIAgentPanelProps {
  className?: string;
}

const AIAgentPanel: React.FC<AIAgentPanelProps> = ({ className }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { refreshData } = useGoals();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || !user) return;

    setLoading(true);
    setResponse(null);

    try {
      console.log("Submitting prompt to AI agent:", prompt);

      // Call the AI service to process the user's prompt
      const result = await aiService.processAgentPrompt(user.id, prompt);

      if (result.error) {
        console.error("Error from AI service:", result.error);
        throw new Error(result.error);
      }

      console.log("AI response received:", result);
      setResponse(
        result.response ||
          "I processed your request but didn't receive a proper response. Please try again.",
      );

      // If the AI created or modified tasks, refresh the data
      if (result.tasksModified) {
        console.log("Tasks were modified, refreshing data");
        refreshData();
      }
    } catch (error) {
      console.error("Error processing AI prompt:", error);
      setResponse(
        "Sorry, I encountered an error processing your request. Please check that the OpenAI API key is correctly set in your Supabase project settings.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = () => {
    setPrompt("Create a new task for me to ");
  };

  const handlePrioritize = () => {
    setPrompt("Help me prioritize my current tasks based on ");
  };

  const handleBreakdown = () => {
    setPrompt("Break down my task of ");
  };

  return (
    <Card
      className={`bg-gradient-to-br from-background to-background/80 border-primary/20 shadow-lg ${className}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl font-bold">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddTask}
              className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Task
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrioritize}
              className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Prioritize Tasks
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBreakdown}
              className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-sm"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" /> Break Down Task
            </Button>
          </div>

          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask me to create tasks, prioritize your work, or provide strategies..."
              className="min-h-[100px] pr-12 bg-background/50 border-primary/20 focus-visible:ring-primary/30"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8 bg-primary/90 hover:bg-primary"
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </form>

        {response && (
          <div className="mt-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">AI Assistant</p>
                <div className="text-sm whitespace-pre-wrap">{response}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIAgentPanel;
