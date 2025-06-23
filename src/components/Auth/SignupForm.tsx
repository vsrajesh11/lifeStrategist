import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Mail, Apple } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/lib/auth";

const SignupForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await signUp(email, password);

      if (error) {
        let errorMessage = "Failed to create account. Please try again.";

        if (
          error.message?.includes("User already registered") ||
          error.message?.includes("already been registered")
        ) {
          errorMessage =
            "Account already exists. Please try signing in instead.";
        } else if (error.message?.includes("Password should be at least")) {
          errorMessage = "Password should be at least 6 characters long.";
        } else if (error.message?.includes("Invalid email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (error.message?.includes("Too many requests")) {
          errorMessage =
            "Too many signup attempts. Please wait a moment before trying again.";
        } else if (error.message?.includes("fetch")) {
          errorMessage =
            "Connection error. Please check your internet connection and try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        setError(errorMessage);
        return;
      }

      // Set flag that we're in the onboarding process
      localStorage.setItem("onboardingInProgress", "true");

      // Show success message
      setError(
        "Signup successful! Please check your email to confirm your account.",
      );

      // Navigate to onboarding after a short delay
      setTimeout(() => {
        navigate("/onboarding");
      }, 2000);
    } catch (err: any) {
      console.error("Unexpected error during signup:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      localStorage.setItem("onboardingInProgress", "true");
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        throw error;
      }

      // OAuth will redirect, so we don't need to handle success here
    } catch (err: any) {
      console.error("Google sign up error:", err);
      localStorage.removeItem("onboardingInProgress");
      setError(
        err.message || "Failed to sign up with Google. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignUp = async () => {
    setLoading(true);
    setError(null);

    try {
      localStorage.setItem("onboardingInProgress", "true");
      const { supabase } = await import("@/lib/supabase");
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/onboarding`,
        },
      });

      if (error) {
        throw error;
      }

      // OAuth will redirect, so we don't need to handle success here
    } catch (err: any) {
      console.error("Apple sign up error:", err);
      localStorage.removeItem("onboardingInProgress");
      setError(
        err.message || "Failed to sign up with Apple. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
        <CardDescription>
          Sign up to start tracking your goals and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up with Email"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleAppleSignUp}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <Apple className="h-4 w-4" />
              Apple
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigate("/login")}
          >
            Sign in
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
