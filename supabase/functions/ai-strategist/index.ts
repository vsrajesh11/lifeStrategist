import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { OpenAI } from "https://esm.sh/openai@4.28.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface Task {
  id: string;
  title: string;
  description: string;
  estimated_time: number;
  impact_score: number;
  priority: string;
  completed: boolean;
  in_progress: boolean;
  goal_id?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  priority: string;
  progress: number;
  impact: number;
  type: string;
  parent_goal_id?: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface UserPreferences {
  personality: any;
  preferences: any;
  goals: any;
  motivators: any;
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== "POST" && req.method !== "OPTIONS") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      });
    }

    // Get and validate request body
    const body = await req.json().catch(() => ({}));
    const { userId, tasks, taskId, action, prompt } = body;

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: userId" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    if (!action) {
      return new Response(
        JSON.stringify({ error: "Missing required field: action" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    console.log("Edge function received request:", {
      action,
      userId,
      taskId,
      promptLength: prompt?.length,
    });

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY") || "";

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response(
        JSON.stringify({
          error: "Server configuration error",
          response:
            "The server is not properly configured. Please contact support.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check for OpenAI API key
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      console.error("OPENAI_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({
          error: "OpenAI API key is not configured",
          response:
            "The AI service is not properly configured. Please add your OpenAI API key in the Supabase project settings.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Initialize OpenAI client
    // IMPORTANT: Set the OPENAI_API_KEY in your Supabase project settings
    // Go to: Supabase Dashboard > Project Settings > API > Environment Variables
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    // Get user preferences
    const { data: userPreferences } = await supabase
      .from("user_preferences")
      .select("*")
      .eq("user_id", userId)
      .single();

    // Get user goals if not provided
    const { data: goals } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId);

    // Get user tasks if needed
    const { data: userTasks } =
      action === "agent"
        ? await supabase.from("tasks").select("*").eq("user_id", userId)
        : { data: null };

    let response;

    if (action === "prioritize") {
      response = await prioritizeTasks(openai, tasks, goals, userPreferences);
    } else if (action === "strategy") {
      // Get specific task if taskId is provided
      const { data: task } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", taskId)
        .single();

      response = await generateTaskStrategy(
        openai,
        task,
        goals,
        userPreferences,
      );
    } else if (action === "agent") {
      response = await processAgentPrompt(
        openai,
        supabase,
        userId,
        prompt,
        userTasks,
        goals,
        userPreferences,
      );
    } else {
      throw new Error("Invalid action specified");
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in edge function:", error);
    return new Response(
      JSON.stringify({
        response:
          "I encountered an error while processing your request. Please try again later.",
        error: "Internal server error",
        tasksModified: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});

async function prioritizeTasks(
  openai: OpenAI,
  tasks: Task[],
  goals: Goal[],
  userPreferences: UserPreferences,
) {
  // Create a prompt for the OpenAI model
  const prompt = `
    You are an AI strategist helping a user prioritize their tasks effectively.
    
    User's personality traits: ${JSON.stringify(userPreferences?.personality?.traits || [])}
    User's work style: ${userPreferences?.personality?.workStyle || "Not specified"}
    User's focus areas: ${JSON.stringify(userPreferences?.preferences?.focusAreas || [])}
    User's motivators: ${JSON.stringify(userPreferences?.motivators?.rewards || [])}
    
    Here are the user's goals:
    ${goals?.map((goal) => `- ${goal.title} (${goal.type}, Priority: ${goal.priority})`).join("\n") || "No goals specified"}
    
    Here are the tasks that need prioritization:
    ${tasks.map((task) => `- ${task.title}: ${task.description || "No description"} (Estimated time: ${task.estimated_time} min, Impact score: ${task.impact_score})`).join("\n")}
    
    Please analyze these tasks and provide:
    1. A recommended priority order for these tasks based on impact, urgency, and alignment with the user's goals
    2. A brief explanation of your reasoning for each task's position in the priority list
    3. Any suggestions for breaking down complex tasks or combining related ones
    
    Format your response as a JSON object with the following structure:
    {
      "recommendations": [
        {
          "task_id": "[task id]",
          "recommendation_type": "priority",
          "content": "[priority recommendation]",
          "reasoning": "[explanation]"
        },
        ...
      ]
    }
  `;

  // Call OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an AI strategist specializing in productivity and goal achievement.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  // Parse the response
  const responseContent = completion.choices[0].message.content;
  const parsedResponse = JSON.parse(responseContent || "{}");

  // Add user_id to each recommendation
  const recommendations = parsedResponse.recommendations.map((rec: any) => ({
    ...rec,
    user_id: userId,
  }));

  return { recommendations };
}

async function generateTaskStrategy(
  openai: OpenAI,
  task: Task,
  goals: Goal[],
  userPreferences: UserPreferences,
) {
  // Find related goal if task has goal_id
  const relatedGoal = task.goal_id
    ? goals?.find((g) => g.id === task.goal_id)
    : null;

  // Create a prompt for the OpenAI model
  const prompt = `
    You are an AI strategist helping a user develop an effective strategy for completing a specific task.
    
    User's personality traits: ${JSON.stringify(userPreferences?.personality?.traits || [])}
    User's work style: ${userPreferences?.personality?.workStyle || "Not specified"}
    User's learning style: ${userPreferences?.personality?.learningStyle || "Not specified"}
    User's preferred environment: ${JSON.stringify(userPreferences?.preferences?.environment || [])}
    
    Task details:
    - Title: ${task.title}
    - Description: ${task.description || "No description provided"}
    - Estimated time: ${task.estimated_time} minutes
    - Impact score: ${task.impact_score}
    - Priority: ${task.priority}
    ${relatedGoal ? `- Related goal: ${relatedGoal.title} (${relatedGoal.type})` : ""}
    
    Please provide a detailed strategy for completing this task effectively, including:
    1. A step-by-step approach tailored to the user's work and learning style
    2. Techniques to maintain focus and motivation
    3. Potential obstacles and how to overcome them
    4. How this task contributes to the user's broader goals
    
    Format your response as a JSON object with the following structure:
    {
      "recommendation": {
        "task_id": "${task.id}",
        "recommendation_type": "strategy",
        "content": "[your detailed strategy]",
        "reasoning": "[explanation of why this strategy suits the user]"
      }
    }
  `;

  // Call OpenAI API
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "You are an AI strategist specializing in productivity and goal achievement.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  // Parse the response
  const responseContent = completion.choices[0].message.content;
  const parsedResponse = JSON.parse(responseContent || "{}");

  // Add user_id to the recommendation
  const recommendation = {
    ...parsedResponse.recommendation,
    user_id: task.user_id,
  };

  return { recommendation };
}

async function processAgentPrompt(
  openai: OpenAI,
  supabase: any,
  userId: string,
  prompt: string,
  tasks: Task[],
  goals: Goal[],
  userPreferences: UserPreferences,
) {
  console.log("Processing agent prompt:", {
    userId,
    prompt,
    tasksCount: tasks?.length,
    goalsCount: goals?.length,
    hasPreferences: !!userPreferences,
  });
  // Create a prompt for the OpenAI model
  const systemPrompt = `
    You are an AI productivity assistant that helps users manage their tasks and goals.
    You can create new tasks, prioritize existing tasks, break down complex tasks into smaller ones,
    and provide strategies for completing tasks effectively.
    
    When the user asks you to create a task, you should extract the following information:
    - Task title
    - Task description
    - Estimated time (in minutes)
    - Priority (high, medium, low)
    - Impact score (0-100)
    
    When responding, be concise, helpful, and action-oriented.
  `;

  const userContextPrompt = `
    User's personality traits: ${JSON.stringify(userPreferences?.personality?.traits || [])}
    User's work style: ${userPreferences?.personality?.workStyle || "Not specified"}
    User's learning style: ${userPreferences?.personality?.learningStyle || "Not specified"}
    
    Current tasks:
    ${tasks?.map((task) => `- ${task.title} (Priority: ${task.priority}, Impact: ${task.impact_score}, Completed: ${task.completed ? "Yes" : "No"})`).join("\n") || "No tasks"}
    
    User goals:
    ${goals?.map((goal) => `- ${goal.title} (${goal.type}, Priority: ${goal.priority})`).join("\n") || "No goals specified"}
    
    User prompt: ${prompt}
    
    Based on the user's prompt, determine what action to take (create task, prioritize tasks, break down task, etc.)
    and provide a helpful response. If creating or modifying tasks, include the necessary details in your response.
  `;

  try {
    console.log("Calling OpenAI API...");
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContextPrompt },
      ],
    });
    console.log("OpenAI API response received");

    const responseContent = completion.choices[0].message.content;

    // Check if we need to create or modify tasks based on the response
    let tasksModified = false;

    // Simple heuristic to detect if the response contains task creation intent
    if (
      responseContent.toLowerCase().includes("created a new task") ||
      responseContent.toLowerCase().includes("added a task") ||
      responseContent.toLowerCase().includes("created task")
    ) {
      // Extract task details using another API call
      const taskExtractionPrompt = `
      Based on this conversation:
      User: ${prompt}
      Your response: ${responseContent}
      
      Extract the task details in JSON format:
      {
        "title": "task title",
        "description": "task description",
        "estimated_time": number of minutes (just the number),
        "impact_score": number between 0-100 (just the number),
        "priority": "high", "medium", or "low"
      }
      
      If no task details can be extracted, return {"error": "No task details found"}
    `;

      const taskExtraction = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Extract structured task data from conversation.",
          },
          { role: "user", content: taskExtractionPrompt },
        ],
        response_format: { type: "json_object" },
      });

      const taskData = JSON.parse(
        taskExtraction.choices[0].message.content || "{}",
      );

      if (!taskData.error) {
        // Create the task in the database
        const { data: newTask, error } = await supabase
          .from("tasks")
          .insert([
            {
              title: taskData.title,
              description: taskData.description,
              estimated_time: taskData.estimated_time,
              impact_score: taskData.impact_score,
              priority: taskData.priority,
              completed: false,
              in_progress: false,
              user_id: userId,
            },
          ])
          .select();

        if (!error) {
          tasksModified = true;
        }
      }
    }

    return {
      response: responseContent,
      tasksModified,
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    return {
      response:
        "I encountered an error while processing your request. Please check that your OpenAI API key is valid and has sufficient credits.",
      error: error.message,
      tasksModified: false,
    };
  }
}
