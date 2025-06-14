import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  Loader2,
  Brain,
  Sparkles,
} from "lucide-react";
import { aiService } from "@/lib/services/aiService";
import { useGoals } from "@/lib/contexts/GoalContext";
import { Task as TaskType, taskService } from "@/lib/services/taskService";
import { useAuth } from "@/lib/auth";

interface TaskListProps {
  tasks?: TaskType[];
}

// Map database task fields to component fields
const mapTaskForDisplay = (task: TaskType) => ({
  ...task,
  estimatedTime: task.estimated_time,
  impactScore: task.impact_score,
  inProgress: task.in_progress,
});

// Map component task fields to database fields
const mapTaskForDatabase = (task: any) => ({
  ...task,
  estimated_time: task.estimatedTime,
  impact_score: task.impactScore,
  in_progress: task.inProgress,
});

const TaskList: React.FC<TaskListProps> = ({ tasks: propTasks }) => {
  // Default tasks if none are provided
  const defaultTasks: TaskType[] = [
    {
      id: "1",
      title: "Complete project proposal",
      description: "Finalize the business plan for the new startup idea",
      estimated_time: 60,
      impact_score: 90,
      priority: "high",
      completed: false,
      in_progress: false,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Research market competitors",
      description: "Analyze top 5 competitors in the industry",
      estimated_time: 45,
      impact_score: 75,
      priority: "high",
      completed: false,
      in_progress: false,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "3",
      title: "Schedule networking event",
      description: "Find and register for industry meetups this month",
      estimated_time: 30,
      impact_score: 60,
      priority: "medium",
      completed: false,
      in_progress: false,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "4",
      title: "Daily exercise routine",
      description: "30 minutes of cardio and strength training",
      estimated_time: 30,
      impact_score: 50,
      priority: "medium",
      completed: false,
      in_progress: false,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "5",
      title: "Review weekly progress",
      description: "Check progress on all ongoing projects",
      estimated_time: 20,
      impact_score: 40,
      priority: "low",
      completed: false,
      in_progress: false,
      user_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const { tasks: contextTasks, loading, refreshData } = useGoals();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<TaskType[]>(
    propTasks || contextTasks || defaultTasks,
  );

  useEffect(() => {
    if (contextTasks && contextTasks.length > 0) {
      setTasks(contextTasks);
    }
  }, [contextTasks]);

  useEffect(() => {
    if (user && tasks.length > 0) {
      fetchAiRecommendations();
    }
  }, [user, tasks]);

  const fetchAiRecommendations = async () => {
    if (!user) return;
    setAiLoading(true);
    try {
      const recommendations = await aiService.getTaskPriorities(user.id, tasks);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const [impedimentTask, setImpedimentTask] = useState<TaskType | null>(null);
  const [impedimentReason, setImpedimentReason] = useState("");
  const [impedimentDialogOpen, setImpedimentDialogOpen] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiDialogOpen, setAiDialogOpen] = useState(false);
  const [selectedTaskForAi, setSelectedTaskForAi] = useState<TaskType | null>(
    null,
  );
  const [aiStrategy, setAiStrategy] = useState<any>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const handleStartTask = async (taskId: string) => {
    if (!user) return;

    // Update local state immediately for better UX
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, in_progress: true };
        } else {
          return { ...task, in_progress: false };
        }
      }),
    );

    // Update in database
    try {
      await taskService.updateTask(taskId, { in_progress: true });
      // Refresh all data to ensure consistency
      refreshData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    if (!user) return;

    // Update local state immediately for better UX
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, completed: true, in_progress: false };
        }
        return task;
      }),
    );

    // Update in database
    try {
      await taskService.updateTask(taskId, {
        completed: true,
        in_progress: false,
      });
      // Refresh all data to ensure consistency
      refreshData();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleReportImpediment = (task: TaskType) => {
    setImpedimentTask(task);
    setImpedimentDialogOpen(true);
  };

  const handleSubmitImpediment = () => {
    // In a real app, this would send the impediment to the AI for analysis
    console.log("Impediment reported:", {
      task: impedimentTask,
      reason: impedimentReason,
    });
    setImpedimentDialogOpen(false);
    setImpedimentReason("");
  };

  const handleGetAiStrategy = async (task: TaskType) => {
    if (!user) return;

    setSelectedTaskForAi(task);
    setAiDialogOpen(true);
    setAiLoading(true);

    try {
      const strategy = await aiService.getTaskStrategies(user.id, task.id);
      setAiStrategy(strategy);
    } catch (error) {
      console.error("Error getting AI strategy:", error);
    } finally {
      setAiLoading(false);
    }
  };

  // Sort tasks by priority and impact score
  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityOrder: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    const aPriority = priorityOrder[a.priority] || 0;
    const bPriority = priorityOrder[b.priority] || 0;

    if (bPriority !== aPriority) {
      return bPriority - aPriority;
    }
    return b.impact_score - a.impact_score;
  });

  // Calculate completion percentage
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionPercentage =
    tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <Card className="w-full max-w-md bg-background shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">Today's Tasks</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> {completedTasks}/{tasks.length}
          </Badge>
        </div>
        <Progress value={completionPercentage} className="h-2 mt-2" />
        {aiRecommendations.length > 0 && (
          <div className="mt-2 pt-2 border-t text-xs text-muted-foreground flex items-center">
            <Sparkles className="h-3 w-3 mr-1 text-primary" />
            AI has prioritized your tasks based on impact and goals
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No tasks for today. Great job!</p>
            </div>
          ) : (
            sortedTasks.map((task) => (
              <div
                key={task.id}
                className={`p-4 rounded-lg border ${task.completed ? "bg-muted/50 opacity-70" : "bg-background"}`}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleCompleteTask(task.id)}
                    className="mt-1"
                    disabled={task.completed}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                      >
                        {task.title}
                      </h3>
                      <Badge
                        className={`${getPriorityColor(task.priority)} capitalize`}
                        variant="outline"
                      >
                        {task.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {task.estimated_time} min
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" />
                        Impact: {task.impact_score}%
                      </div>
                    </div>

                    {!task.completed && (
                      <div className="flex gap-2 mt-3">
                        <Button
                          variant={task.in_progress ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleStartTask(task.id)}
                          className="flex items-center gap-1"
                        >
                          {task.in_progress ? "In Progress" : "Start"}
                          {!task.in_progress && (
                            <ArrowRight className="h-3 w-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReportImpediment(task)}
                          className="flex items-center gap-1"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Issue
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGetAiStrategy(task)}
                          className="flex items-center gap-1"
                        >
                          <Brain className="h-3 w-3" />
                          AI Strategy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <Dialog
        open={impedimentDialogOpen}
        onOpenChange={setImpedimentDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Impediment</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <h4 className="font-medium mb-1">Task:</h4>
              <p className="text-sm">{impedimentTask?.title}</p>
            </div>
            <div>
              <h4 className="font-medium mb-1">
                What's preventing you from completing this task?
              </h4>
              <Textarea
                value={impedimentReason}
                onChange={(e) => setImpedimentReason(e.target.value)}
                placeholder="Describe the issue..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImpedimentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitImpediment}
              disabled={!impedimentReason.trim()}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={aiDialogOpen} onOpenChange={setAiDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Strategy Recommendations
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {aiLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
                <span>Generating intelligent strategy...</span>
              </div>
            ) : aiStrategy ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-lg">
                    {selectedTaskForAi?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedTaskForAi?.description}
                  </p>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Strategy Recommendation</h4>
                  <div className="whitespace-pre-wrap text-sm">
                    {aiStrategy.content}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Reasoning</h4>
                  <p className="text-sm text-muted-foreground">
                    {aiStrategy.reasoning}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No AI strategy available for this task.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setAiDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskList;
