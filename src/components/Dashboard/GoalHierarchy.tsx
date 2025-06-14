import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronDown,
  ChevronRight,
  Star,
  Clock,
  Target,
  BarChart3,
  Loader2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGoals } from "@/lib/contexts/GoalContext";
import { useAuth } from "@/lib/auth";
import { GoalWithChildren } from "@/lib/services/goalService";

interface GoalHierarchyProps {
  goals?: GoalWithChildren[];
}

const GoalHierarchy = ({ goals: propGoals }: GoalHierarchyProps) => {
  const { goals: contextGoals, loading, error, refreshData } = useGoals();
  const goals = propGoals || contextGoals || defaultGoals;

  // Initialize expanded state for goals that exist
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>(
    {},
  );

  // Update expanded goals when goals change
  useEffect(() => {
    if (goals && goals.length > 0) {
      setExpandedGoals(
        goals.reduce((acc, goal) => ({ ...acc, [goal.id]: true }), {}),
      );
    }
  }, [goals]);

  // Refresh data on component mount
  useEffect(() => {
    if (refreshData) {
      refreshData();
    }
  }, [refreshData]);

  const toggleExpand = (goalId: string) => {
    setExpandedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive";
      case "medium":
        return "secondary";
      case "low":
        return "outline";
      default:
        return "default";
    }
  };

  const renderGoal = (goal: GoalWithChildren, depth = 0) => {
    const isExpanded = expandedGoals[goal.id];
    const hasChildren = goal.children && goal.children.length > 0;

    return (
      <div key={goal.id} className="mb-3">
        <Card
          className={`border-l-4 ${goal.type === "lifetime" ? "border-l-blue-500" : goal.type === "medium-term" ? "border-l-purple-500" : "border-l-green-500"}`}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {hasChildren && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => toggleExpand(goal.id)}
                  >
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </Button>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{goal.title}</h3>
                    <Badge variant={getPriorityColor(goal.priority) as any}>
                      {goal.priority}
                    </Badge>
                    <Badge variant="outline" className="bg-background">
                      {goal.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {goal.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <Target size={16} className="text-blue-500" />
                        <span className="text-sm font-medium">
                          {goal.progress}%
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Progress</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1">
                        <BarChart3 size={16} className="text-amber-500" />
                        <span className="text-sm font-medium">
                          {goal.impact}%
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Estimated Impact</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <Progress value={goal.progress} className="mt-2" />
          </CardContent>
        </Card>

        {hasChildren && isExpanded && (
          <div className="pl-6 mt-2 border-l-2 border-dashed border-gray-200">
            {goal.children!.map((childGoal) =>
              renderGoal(childGoal, depth + 1),
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-background p-4 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Goal Hierarchy</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const allExpanded = Object.values(expandedGoals).every((v) => v);
              const newState = goals.reduce(
                (acc, goal) => ({ ...acc, [goal.id]: !allExpanded }),
                {},
              );
              setExpandedGoals(newState);
            }}
          >
            <ChevronDown className="mr-2 h-4 w-4" />
            {Object.values(expandedGoals).every((v) => v)
              ? "Collapse All"
              : "Expand All"}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => {
              const title = prompt("Enter goal title:");
              if (!title) return;

              const description =
                prompt("Enter goal description (optional):") || "";
              const priorityOptions = ["high", "medium", "low"];
              const priority =
                prompt(`Enter priority (${priorityOptions.join(", ")}):`) ||
                "medium";
              const typeOptions = ["lifetime", "medium-term", "daily"];
              const type =
                prompt(`Enter goal type (${typeOptions.join(", ")}):`) ||
                "medium-term";

              // Use imported goalService instead of requiring it
              // And get user from the current context
              // Get user from context
              const { user } = useAuth();

              if (user) {
                // Import goalService directly
                import("@/lib/services/goalService").then(({ goalService }) => {
                  goalService
                    .createGoal({
                      title,
                      description,
                      priority: priorityOptions.includes(priority)
                        ? priority
                        : "medium",
                      progress: 0,
                      impact: 50,
                      type: typeOptions.includes(type) ? type : "medium-term",
                      user_id: user.id,
                    })
                    .then(() => {
                      if (refreshData) {
                        refreshData();
                      }
                    })
                    .catch((error) => {
                      console.error("Error creating goal:", error);
                      alert("Failed to create goal. Please try again.");
                    });
                });
              }
            }}
          >
            <Star className="mr-2 h-4 w-4" />
            Add Goal
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-4 mb-4">
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            Lifetime Goals
          </Badge>
          <Badge
            variant="outline"
            className="border-purple-500 text-purple-500"
          >
            <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
            Medium-Term Objectives
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-500">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            Daily Tasks
          </Badge>
        </div>

        {goals.map((goal) => renderGoal(goal))}
      </div>
    </div>
  );
};

// Default mock data
const defaultGoals: GoalWithChildren[] = [
  {
    id: "1",
    title: "Become a Senior Software Engineer",
    description:
      "Achieve senior level position in software engineering within 5 years",
    priority: "high",
    progress: 45,
    impact: 90,
    type: "lifetime",
    user_id: "",
    created_at: "",
    updated_at: "",
    children: [
      {
        id: "1-1",
        title: "Master React and TypeScript",
        description:
          "Become proficient in React, TypeScript and related technologies",
        priority: "high",
        progress: 60,
        impact: 75,
        type: "medium-term",
        user_id: "",
        created_at: "",
        updated_at: "",
        children: [
          {
            id: "1-1-1",
            title: "Complete Advanced React Course",
            description: "Finish the online course on advanced React patterns",
            priority: "high",
            progress: 80,
            impact: 60,
            type: "daily",
            user_id: "",
            created_at: "",
            updated_at: "",
          },
          {
            id: "1-1-2",
            title: "Build Portfolio Project",
            description: "Create a showcase project using React and TypeScript",
            priority: "medium",
            progress: 30,
            impact: 70,
            type: "daily",
            user_id: "",
            created_at: "",
            updated_at: "",
          },
        ],
      },
      {
        id: "1-2",
        title: "Contribute to Open Source",
        description: "Make regular contributions to open source projects",
        priority: "medium",
        progress: 25,
        impact: 65,
        type: "medium-term",
        user_id: "",
        created_at: "",
        updated_at: "",
      },
    ],
  },
  {
    id: "2",
    title: "Improve Physical Health",
    description:
      "Achieve optimal physical fitness and maintain healthy lifestyle",
    priority: "medium",
    progress: 35,
    impact: 80,
    type: "lifetime",
    user_id: "",
    created_at: "",
    updated_at: "",
    children: [
      {
        id: "2-1",
        title: "Establish Regular Exercise Routine",
        description: "Create and maintain a consistent workout schedule",
        priority: "high",
        progress: 50,
        impact: 85,
        type: "medium-term",
        user_id: "",
        created_at: "",
        updated_at: "",
        children: [
          {
            id: "2-1-1",
            title: "Morning Workout",
            description: "30 minutes of cardio and strength training",
            priority: "high",
            progress: 100,
            impact: 75,
            type: "daily",
            user_id: "",
            created_at: "",
            updated_at: "",
          },
        ],
      },
    ],
  },
];

export default GoalHierarchy;
