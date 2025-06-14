import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Import the actual DashboardLayout or use fallback
let DashboardLayoutImport;
try {
  DashboardLayoutImport =
    require("@/components/Layout/DashboardLayout").default;
} catch (e) {
  console.warn("DashboardLayout not found, using fallback");
}

// Use the imported layout or fallback to a simple layout if import fails
const FallbackLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto p-4 bg-background min-h-screen">
      {children}
    </div>
  );
};

const DashboardLayout = DashboardLayoutImport || FallbackLayout;
import TaskList from "@/components/Dashboard/TaskList";
import ProgressTracker from "@/components/Dashboard/ProgressTracker";
import GoalHierarchy from "@/components/Dashboard/GoalHierarchy";
import AIAgentPanel from "@/components/Dashboard/AIAgentPanel";
import { useAuth } from "@/lib/auth";
import { useGoals } from "@/lib/contexts/GoalContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading, error, refreshData } = useGoals();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not authenticated and auth is not loading, redirect to login
    if (!user && !authLoading) {
      navigate("/login");
    }

    // If we have a user, refresh the data
    if (user && !authLoading && refreshData) {
      refreshData();
    }
  }, [user, authLoading, navigate, refreshData]);

  // If auth is still loading, show loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading...</span>
      </div>
    );
  }

  // If user is not authenticated, don't render the dashboard
  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
          </h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {dataLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
            <span>Loading your dashboard data...</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <GoalHierarchy />
                <ProgressTracker />
              </div>
              <div className="space-y-6">
                <TaskList />
                {/* New AI Agent Panel */}
                <div className="mt-6">
                  <AIAgentPanel />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
