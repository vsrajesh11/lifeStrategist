import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Target,
  BarChart3,
  CheckCircle2,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(true);

  // Check if user is first time user
  useEffect(() => {
    // This would typically check local storage or user data from API
    const checkFirstTimeUser = () => {
      // Mock implementation - replace with actual implementation
      const hasCompletedOnboarding = localStorage.getItem(
        "hasCompletedOnboarding",
      );
      setIsFirstTimeUser(!hasCompletedOnboarding);
    };

    checkFirstTimeUser();
  }, []);

  const handleGetStarted = () => {
    // Check if user is logged in using localStorage
    const isLoggedIn = localStorage.getItem("supabase.auth.token") !== null;
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const features = [
    {
      title: "Personalized Goal Setting",
      description:
        "Create a hierarchy of goals tailored to your personality and preferences",
      icon: <Target className="h-10 w-10 text-primary" />,
    },
    {
      title: "AI-Powered Task Organization",
      description:
        "Our AI analyzes your tasks and prioritizes them using the Pareto principle",
      icon: <Brain className="h-10 w-10 text-primary" />,
    },
    {
      title: "Adaptive Planning",
      description:
        "Intelligent recalibration when life happens, preserving your high-impact activities",
      icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
    },
    {
      title: "Progress Visualization",
      description:
        "Track your achievements with personalized metrics and celebrate milestones",
      icon: <BarChart3 className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/95 pt-16 md:pt-24 lg:pt-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Welcome to <span className="text-primary">GoalTracker</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Your intelligent companion for achieving life goals through
                personalized planning and AI-powered insights.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="mt-6 px-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="mt-6 px-8"
                >
                  Sign In
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto text-center md:max-w-[58rem]">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              How GoalTracker Works
            </h2>
            <p className="mt-4 text-muted-foreground">
              Our intelligent system adapts to your personality and helps you
              focus on what truly matters.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:gap-12 pt-8 md:pt-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="mb-2">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Ready to Transform Your Goal Achievement?
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Start with a simple personality assessment to create your
                personalized goal tracking system.
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="mt-4 px-8"
              >
                Begin Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/signup")}
                className="mt-4 px-8"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} GoalTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
