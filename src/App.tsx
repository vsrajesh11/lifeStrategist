import { Suspense, lazy } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import OnboardingFlow from "./components/Onboarding/OnboardingFlow";
import { AuthProvider } from "./lib/auth";
import { GoalProvider } from "./lib/contexts/GoalContext";
import routes from "tempo-routes";

// Lazy load components for better performance
const LoginForm = lazy(() => import("./components/Auth/LoginForm"));
const SignupForm = lazy(() => import("./components/Auth/SignupForm"));
const DashboardPage = lazy(
  () => import("./components/Dashboard/DashboardPage"),
);

function App() {
  return (
    <AuthProvider>
      <GoalProvider>
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen">
              Loading...
            </div>
          }
        >
          <>
            {/* Add Tempo routes before the Routes component */}
            {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/onboarding" element={<OnboardingFlow />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/goals" element={<DashboardPage />} />
              <Route path="/tasks" element={<DashboardPage />} />
              <Route path="/progress" element={<DashboardPage />} />
              <Route path="/profile" element={<DashboardPage />} />
              <Route path="/settings" element={<DashboardPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
              {import.meta.env.VITE_TEMPO === "true" && (
                <Route path="/tempobook/*" />
              )}
            </Routes>
            {/* Tempo routes should be before the Routes component */}
          </>
        </Suspense>
      </GoalProvider>
    </AuthProvider>
  );
}

export default App;
