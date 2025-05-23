import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  priceId: string; // Stripe price ID
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Basic goal tracking for individuals",
    price: 0,
    interval: "month",
    features: [
      "Up to 3 lifetime goals",
      "Up to 5 medium-term objectives",
      "Basic progress tracking",
      "Email support",
    ],
    priceId: "", // No price ID for free plan
  },
  {
    id: "pro",
    name: "Pro",
    description: "Advanced features for serious goal achievers",
    price: 9.99,
    interval: "month",
    features: [
      "Unlimited goals and objectives",
      "AI-powered task prioritization",
      "Advanced analytics and insights",
      "Custom achievement badges",
      "Priority support",
    ],
    priceId: "price_1234567890", // Replace with your actual Stripe price ID
  },
  {
    id: "team",
    name: "Team",
    description: "Goal tracking for teams and organizations",
    price: 29.99,
    interval: "month",
    features: [
      "Everything in Pro",
      "Team goal sharing",
      "Collaborative objectives",
      "Team analytics dashboard",
      "Admin controls",
      "Dedicated account manager",
    ],
    priceId: "price_0987654321", // Replace with your actual Stripe price ID
  },
];

const PricingPlans = () => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: PricingPlan) => {
    if (plan.id === "free") {
      // Handle free plan subscription
      return;
    }

    try {
      setLoading(plan.id);

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to subscribe");
      }

      // Call your backend to create a Stripe checkout session
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.id,
          customerEmail: user.email,
        }),
      });

      const { sessionId } = await response.json();

      // Redirect to Stripe checkout
      const stripe = await getStripe();
      await stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error subscribing to plan:", error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Choose the Right Plan for You
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Start with our free plan or upgrade for advanced features
          </p>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {plan.name}
                </CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-base font-medium text-muted-foreground">
                      /{plan.interval}
                    </span>
                  )}
                </div>
                <CardDescription className="mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.id === "free" ? "outline" : "default"}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading === plan.id}
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : plan.id === "free" ? (
                    "Get Started"
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
