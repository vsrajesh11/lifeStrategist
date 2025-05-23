import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

interface OnboardingFlowProps {
  onComplete?: (userData: any) => void;
  isOpen?: boolean;
}

const OnboardingFlow = ({
  onComplete = () => {},
  isOpen = true,
}: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState({
    personality: {
      traits: [],
      workStyle: "",
      stressResponse: "",
      learningStyle: "",
    },
    preferences: {
      timeOfDay: "",
      environment: [],
      communicationStyle: "",
      focusAreas: [],
    },
    goals: {
      lifetime: [],
      mediumTerm: [],
      immediate: [],
    },
    motivators: {
      rewards: [],
      accountability: "",
      visualization: "",
    },
  });

  const steps = [
    "Personality Assessment",
    "Preferences",
    "Goal Definition",
    "Motivators",
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(userData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersonality = (field: string, value: any) => {
    setUserData({
      ...userData,
      personality: {
        ...userData.personality,
        [field]: value,
      },
    });
  };

  const updatePreferences = (field: string, value: any) => {
    setUserData({
      ...userData,
      preferences: {
        ...userData.preferences,
        [field]: value,
      },
    });
  };

  const updateGoals = (field: string, value: any) => {
    setUserData({
      ...userData,
      goals: {
        ...userData.goals,
        [field]: value,
      },
    });
  };

  const updateMotivators = (field: string, value: any) => {
    setUserData({
      ...userData,
      motivators: {
        ...userData.motivators,
        [field]: value,
      },
    });
  };

  const personalityTraits = [
    "Analytical",
    "Creative",
    "Detail-oriented",
    "Adaptable",
    "Organized",
    "Spontaneous",
    "Introverted",
    "Extroverted",
    "Competitive",
    "Collaborative",
    "Risk-taker",
    "Cautious",
  ];

  const focusAreas = [
    "Career",
    "Health",
    "Relationships",
    "Finance",
    "Education",
    "Personal Growth",
    "Spirituality",
    "Community",
  ];

  const environments = [
    "Quiet space",
    "Background music",
    "Coffee shop",
    "Outdoors",
    "Home office",
    "Coworking space",
    "Library",
    "Virtual",
  ];

  const rewardTypes = [
    "Social recognition",
    "Personal time",
    "Material rewards",
    "Learning opportunities",
    "Travel experiences",
    "Food treats",
    "Digital achievements",
    "Financial incentives",
  ];

  if (!isOpen) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to Your Goal Journey
            </CardTitle>
            <CardDescription className="text-center">
              Let's get to know you better so we can create a personalized plan
              for your success.
            </CardDescription>
            <div className="mt-4">
              <Progress
                value={((currentStep + 1) / steps.length) * 100}
                className="h-2"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center ${currentStep >= index ? "text-primary" : ""}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center mb-1 ${currentStep > index ? "bg-primary text-primary-foreground" : currentStep === index ? "border-2 border-primary" : "border-2 border-muted"}`}
                    >
                      {currentStep > index ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className="hidden sm:block">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 py-4">
            {currentStep === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-4">
                  Personality Assessment
                </h3>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base">
                      Select traits that describe you (choose multiple)
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {personalityTraits.map((trait) => (
                        <div
                          key={trait}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`trait-${trait}`}
                            checked={userData.personality.traits.includes(
                              trait,
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updatePersonality("traits", [
                                  ...userData.personality.traits,
                                  trait,
                                ]);
                              } else {
                                updatePersonality(
                                  "traits",
                                  userData.personality.traits.filter(
                                    (t) => t !== trait,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`trait-${trait}`}>{trait}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="workStyle" className="text-base">
                      How would you describe your work style?
                    </Label>
                    <RadioGroup
                      id="workStyle"
                      value={userData.personality.workStyle}
                      onValueChange={(value) =>
                        updatePersonality("workStyle", value)
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="structured" id="structured" />
                        <Label htmlFor="structured">
                          I prefer structure and planning
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="flexible" id="flexible" />
                        <Label htmlFor="flexible">
                          I prefer flexibility and spontaneity
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mixed" id="mixed" />
                        <Label htmlFor="mixed">I like a mix of both</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="stressResponse" className="text-base">
                      How do you typically respond to stress?
                    </Label>
                    <Textarea
                      id="stressResponse"
                      placeholder="Describe how you typically handle stressful situations..."
                      value={userData.personality.stressResponse}
                      onChange={(e) =>
                        updatePersonality("stressResponse", e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="learningStyle" className="text-base">
                      What's your preferred learning style?
                    </Label>
                    <RadioGroup
                      id="learningStyle"
                      value={userData.personality.learningStyle}
                      onValueChange={(value) =>
                        updatePersonality("learningStyle", value)
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="visual" id="visual" />
                        <Label htmlFor="visual">
                          Visual (images, diagrams)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="auditory" id="auditory" />
                        <Label htmlFor="auditory">
                          Auditory (listening, discussing)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reading" id="reading" />
                        <Label htmlFor="reading">Reading/Writing</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kinesthetic" id="kinesthetic" />
                        <Label htmlFor="kinesthetic">
                          Kinesthetic (hands-on practice)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-4">Your Preferences</h3>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="timeOfDay" className="text-base">
                      When are you most productive?
                    </Label>
                    <RadioGroup
                      id="timeOfDay"
                      value={userData.preferences.timeOfDay}
                      onValueChange={(value) =>
                        updatePreferences("timeOfDay", value)
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="morning" id="morning" />
                        <Label htmlFor="morning">Early morning</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="midday" id="midday" />
                        <Label htmlFor="midday">Mid-day</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="afternoon" id="afternoon" />
                        <Label htmlFor="afternoon">Afternoon</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="evening" id="evening" />
                        <Label htmlFor="evening">Evening</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="night" id="night" />
                        <Label htmlFor="night">Late night</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base">
                      What environments help you focus? (select multiple)
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {environments.map((env) => (
                        <div key={env} className="flex items-center space-x-2">
                          <Checkbox
                            id={`env-${env}`}
                            checked={userData.preferences.environment.includes(
                              env,
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updatePreferences("environment", [
                                  ...userData.preferences.environment,
                                  env,
                                ]);
                              } else {
                                updatePreferences(
                                  "environment",
                                  userData.preferences.environment.filter(
                                    (e) => e !== env,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`env-${env}`}>{env}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="communicationStyle" className="text-base">
                      How do you prefer to receive updates and reminders?
                    </Label>
                    <RadioGroup
                      id="communicationStyle"
                      value={userData.preferences.communicationStyle}
                      onValueChange={(value) =>
                        updatePreferences("communicationStyle", value)
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="detailed" id="detailed" />
                        <Label htmlFor="detailed">
                          Detailed and comprehensive
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="brief" id="brief" />
                        <Label htmlFor="brief">Brief and to-the-point</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="visual" id="visual-comm" />
                        <Label htmlFor="visual-comm">
                          Visual (charts, graphics)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minimal" id="minimal" />
                        <Label htmlFor="minimal">
                          Minimal, only when necessary
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base">
                      Which areas of life are you most focused on improving?
                      (select multiple)
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                      {focusAreas.map((area) => (
                        <div key={area} className="flex items-center space-x-2">
                          <Checkbox
                            id={`area-${area}`}
                            checked={userData.preferences.focusAreas.includes(
                              area,
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updatePreferences("focusAreas", [
                                  ...userData.preferences.focusAreas,
                                  area,
                                ]);
                              } else {
                                updatePreferences(
                                  "focusAreas",
                                  userData.preferences.focusAreas.filter(
                                    (a) => a !== area,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`area-${area}`}>{area}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-4">Define Your Goals</h3>

                <Tabs defaultValue="lifetime" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="lifetime">Lifetime Goals</TabsTrigger>
                    <TabsTrigger value="medium">Medium-Term</TabsTrigger>
                    <TabsTrigger value="immediate">Immediate</TabsTrigger>
                  </TabsList>

                  <TabsContent value="lifetime" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="lifetimeGoals" className="text-base">
                        What are your major life goals? (one per line)
                      </Label>
                      <Textarea
                        id="lifetimeGoals"
                        placeholder="Examples: Start my own business, Run a marathon, Learn a new language..."
                        value={userData.goals.lifetime.join("\n")}
                        onChange={(e) =>
                          updateGoals(
                            "lifetime",
                            e.target.value
                              .split("\n")
                              .filter((g) => g.trim() !== ""),
                          )
                        }
                        className="mt-2 min-h-[150px]"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        These are your big, long-term aspirations that might
                        take years to achieve.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="medium" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="mediumGoals" className="text-base">
                        What are your medium-term objectives? (one per line)
                      </Label>
                      <Textarea
                        id="mediumGoals"
                        placeholder="Examples: Complete a certification, Save $5000, Establish a daily exercise routine..."
                        value={userData.goals.mediumTerm.join("\n")}
                        onChange={(e) =>
                          updateGoals(
                            "mediumTerm",
                            e.target.value
                              .split("\n")
                              .filter((g) => g.trim() !== ""),
                          )
                        }
                        className="mt-2 min-h-[150px]"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        These are objectives that might take weeks or months to
                        complete.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="immediate" className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="immediateGoals" className="text-base">
                        What are your immediate goals? (one per line)
                      </Label>
                      <Textarea
                        id="immediateGoals"
                        placeholder="Examples: Set up a workout schedule, Research courses, Create a budget template..."
                        value={userData.goals.immediate.join("\n")}
                        onChange={(e) =>
                          updateGoals(
                            "immediate",
                            e.target.value
                              .split("\n")
                              .filter((g) => g.trim() !== ""),
                          )
                        }
                        className="mt-2 min-h-[150px]"
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        These are tasks you want to accomplish in the next few
                        days or weeks.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-medium mb-4">What Motivates You</h3>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base">
                      What types of rewards motivate you? (select multiple)
                    </Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {rewardTypes.map((reward) => (
                        <div
                          key={reward}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`reward-${reward}`}
                            checked={userData.motivators.rewards.includes(
                              reward,
                            )}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateMotivators("rewards", [
                                  ...userData.motivators.rewards,
                                  reward,
                                ]);
                              } else {
                                updateMotivators(
                                  "rewards",
                                  userData.motivators.rewards.filter(
                                    (r) => r !== reward,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label htmlFor={`reward-${reward}`}>{reward}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accountability" className="text-base">
                      How do you prefer to be held accountable?
                    </Label>
                    <RadioGroup
                      id="accountability"
                      value={userData.motivators.accountability}
                      onValueChange={(value) =>
                        updateMotivators("accountability", value)
                      }
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="self" id="self" />
                        <Label htmlFor="self">
                          Self-monitoring and tracking
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">Public commitments</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="partner" id="partner" />
                        <Label htmlFor="partner">Accountability partner</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="coach" id="coach" />
                        <Label htmlFor="coach">Coach or mentor</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="group" id="group" />
                        <Label htmlFor="group">Group accountability</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="visualization" className="text-base">
                      Describe what success looks like to you
                    </Label>
                    <Textarea
                      id="visualization"
                      placeholder="When you achieve your goals, what will your life look like? How will you feel?"
                      value={userData.motivators.visualization}
                      onChange={(e) =>
                        updateMotivators("visualization", e.target.value)
                      }
                      className="mt-2 min-h-[100px]"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This visualization will help motivate you when challenges
                      arise.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
            <Button onClick={handleNext} className="flex items-center gap-1">
              {currentStep === steps.length - 1 ? "Complete" : "Next"}{" "}
              {currentStep < steps.length - 1 && (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingFlow;
