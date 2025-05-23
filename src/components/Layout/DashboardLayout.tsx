import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import {
  LogOut,
  User,
  Settings,
  Home,
  BarChart3,
  Target,
  Calendar,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 bg-muted/30 border-r p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
          <Target className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">GoalTracker</h1>
        </div>

        <nav className="space-y-1 flex-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/dashboard")}
          >
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/goals")}
          >
            <Target className="mr-2 h-4 w-4" />
            Goals
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/tasks")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Tasks
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/progress")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            Progress
          </Button>
        </nav>

        <div className="border-t pt-4 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/profile")}
          >
            <User className="mr-2 h-4 w-4" />
            Profile
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
