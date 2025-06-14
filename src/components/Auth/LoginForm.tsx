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

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    setResetSuccess(false);
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        throw error;
      }

      // Check if user was trying to complete onboarding
      const onboardingInProgress = localStorage.getItem("onboardingInProgress");
      if (onboardingInProgress) {
        navigate("/onboarding");
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      let errorMessage = "Failed to login. Please try again.";

      if (err.message?.includes("Invalid login credentials")) {
        errorMessage =
          "Invalid email or password. Please check your credentials and try again.";
      } else if (err.message?.includes("Email not confirmed")) {
        errorMessage =
          "Please check your email and click the confirmation link before signing in.";
      } else if (err.message?.includes("Too many requests")) {
        errorMessage =
          "Too many login attempts. Please wait a moment before trying again.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setResetSuccess(false);

    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || "Failed to login with Google. Please try again.");
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError(null);
    setResetSuccess(false);

    try {
      const { supabase } = await import("@/lib/supabase");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      setError(err.message || "Failed to login with Apple. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-background">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to continue your goal tracking journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {resetSuccess && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">
              Password reset email sent! Please check your inbox.
            </AlertDescription>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button
                variant="link"
                className="p-0 h-auto"
                type="button"
                onClick={async (e) => {
                  e.preventDefault();
                  const emailToReset =
                    email || prompt("Please enter your email address");
                  if (emailToReset) {
                    setLoading(true);
                    setError(null);
                    setResetSuccess(false);

                    try {
                      const { supabase } = await import("@/lib/supabase");
                      const { error: resetError } =
                        await supabase.auth.resetPasswordForEmail(
                          emailToReset,
                          {
                            redirectTo: `${window.location.origin}/reset-password`,
                          },
                        );

                      if (resetError) {
                        throw resetError;
                      }

                      setError(null);
                      setResetSuccess(true);
                    } catch (err: any) {
                      let errorMessage =
                        "Unable to send password reset email. Please try again.";

                      if (err.message?.includes("Invalid email")) {
                        errorMessage = "Please enter a valid email address.";
                      } else if (err.message?.includes("User not found")) {
                        errorMessage =
                          "No account found with this email address. Please check the email or sign up for a new account.";
                      } else if (err.message?.includes("rate limit")) {
                        errorMessage =
                          "For security purposes, we can only send password reset emails every 60 seconds. Please wait before trying again.";
                      } else if (err.message) {
                        errorMessage = err.message;
                      }

                      setError(errorMessage);
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
              >
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
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
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleAppleSignIn}
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
          Don't have an account?{" "}
          <Button
            variant="link"
            className="p-0 h-auto"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </Button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
