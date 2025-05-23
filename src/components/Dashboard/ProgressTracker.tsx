import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Award,
  Star,
  Calendar,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useGoals } from "@/lib/contexts/GoalContext";
import {
  Achievement,
  Milestone,
  Streak,
} from "@/lib/services/achievementService";

interface ProgressTrackerProps {
  achievements?: Achievement[];
  milestones?: Milestone[];
  streak?: Streak | null;
  completionRate?: number;
  weeklyProgress?: number[];
}

// Map database milestone fields to component fields
const mapMilestoneForDisplay = (milestone: Milestone) => ({
  ...milestone,
  dueDate: milestone.due_date,
});

const ProgressTracker: React.FC<ProgressTrackerProps> = (props) => {
  const {
    achievements: contextAchievements,
    milestones: contextMilestones,
    streak: contextStreak,
    completionRate: contextCompletionRate,
    weeklyProgress: contextWeeklyProgress,
    loading,
    error,
  } = useGoals();

  const achievements = props.achievements ||
    contextAchievements || [
      {
        id: "1",
        title: "Early Bird",
        description: "Complete 5 tasks before 9 AM",
        earned: true,
        date: "2023-06-15",
        user_id: "",
        created_at: "",
        updated_at: "",
      },
      {
        id: "2",
        title: "Consistency King",
        description: "Maintain a 7-day streak",
        earned: true,
        date: "2023-06-20",
        user_id: "",
        created_at: "",
        updated_at: "",
      },
      {
        id: "3",
        title: "Goal Crusher",
        description: "Complete a medium-term objective",
        earned: false,
        user_id: "",
        created_at: "",
        updated_at: "",
      },
    ];

  const milestones = props.milestones ||
    contextMilestones || [
      {
        id: "1",
        title: "Complete Portfolio Website",
        description: "Finish all sections of your personal portfolio",
        due_date: "2023-07-30",
        reward: "Weekend getaway",
        progress: 65,
        user_id: "",
        created_at: "",
        updated_at: "",
      },
      {
        id: "2",
        title: "Learn React Fundamentals",
        description: "Complete the React basics course",
        due_date: "2023-07-15",
        reward: "New tech gadget",
        progress: 80,
        user_id: "",
        created_at: "",
        updated_at: "",
      },
    ];

  const streak = props.streak ||
    contextStreak || {
      current: 5,
      best: 12,
      last_updated: "2023-06-25",
      user_id: "",
    };

  const completionRate = props.completionRate || contextCompletionRate || 78;
  const weeklyProgress = props.weeklyProgress ||
    contextWeeklyProgress || [65, 70, 75, 72, 78, 80, 78];

  if (loading) {
    return (
      <Card className="w-full h-full bg-background shadow-md">
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading progress data...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full bg-background shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Progress Tracker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="milestones">Milestones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Completion Rate</h3>
                  <span className="text-lg font-bold">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-medium">Current Streak</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-lg font-bold">
                      {streak?.current || 0} days
                    </span>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Best: {streak?.best || 0} days
                </div>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-2">Weekly Progress</h3>
              <div className="flex items-end justify-between h-24">
                {weeklyProgress.map((value, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center w-full"
                  >
                    <div
                      className="bg-primary w-full max-w-[12px] rounded-t-sm"
                      style={{ height: `${value}%` }}
                    ></div>
                    <span className="text-xs mt-1">
                      {["M", "T", "W", "T", "F", "S", "S"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
              <div>
                <h3 className="text-sm font-medium">Next Milestone</h3>
                <p className="text-xs text-muted-foreground">
                  {milestones.length > 0
                    ? milestones[0].title
                    : "No milestones set"}
                </p>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                <span className="text-xs">
                  {milestones.length > 0 ? milestones[0].due_date : "N/A"}
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-2">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center justify-between p-3 rounded-lg ${achievement.earned ? "bg-primary/10" : "bg-muted/50"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-full mr-3 ${achievement.earned ? "bg-primary/20" : "bg-muted"}`}
                  >
                    <Trophy
                      className={`h-4 w-4 ${achievement.earned ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{achievement.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                </div>
                {achievement.earned ? (
                  <Badge
                    variant="outline"
                    className="bg-primary/20 text-primary border-primary/20"
                  >
                    Earned {achievement.date && `on ${achievement.date}`}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-muted text-muted-foreground"
                  >
                    In Progress
                  </Badge>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="milestones" className="space-y-4">
            {milestones.length > 0 ? (
              milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="bg-muted/50 p-4 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">{milestone.title}</h3>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-xs">{milestone.due_date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {milestone.description}
                  </p>
                  <div className="pt-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">
                        {milestone.progress}% complete
                      </span>
                    </div>
                    <Progress value={milestone.progress} className="h-2" />
                  </div>
                  <div className="flex items-center pt-1">
                    <Award className="h-4 w-4 text-primary mr-1" />
                    <span className="text-xs">Reward: {milestone.reward}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  No milestones available
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
