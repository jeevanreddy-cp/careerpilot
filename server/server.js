require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { createClient } = require("@supabase/supabase-js");

const app = express();

const PORT = process.env.PORT || 5001;

// =========================================
// Environment variable validation
// =========================================

if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is missing from the .env file");
  process.exit(1);
}

if (!process.env.SUPABASE_URL) {
  console.error("Error: SUPABASE_URL is missing from the .env file");
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "Error: SUPABASE_SERVICE_ROLE_KEY is missing from the .env file"
  );

  process.exit(1);
}

// =========================================
// Gemini client
// =========================================

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
});

// =========================================
// Supabase client
// =========================================

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// =========================================
// Middleware
// =========================================

app.use(cors());
app.use(express.json());

// =========================================
// Test route
// =========================================

app.get("/", (req, res) => {
  res.send("CareerPilot backend is running");
});

// =========================================
// Get all saved roadmaps
// =========================================

app.get("/api/roadmaps", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("career_roadmaps")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("Supabase fetch error:", error);

      return res.status(500).json({
        message: "Failed to fetch saved roadmaps",
        error: error.message,
        details: error.details,
        hint: error.hint,
      });
    }

    res.json({
      message: "Saved roadmaps fetched successfully",
      roadmaps: data,
    });
  } catch (error) {
    console.error("Error fetching roadmaps:", error);

    res.status(500).json({
      message: "Something went wrong while fetching roadmaps",
      error: error.message,
    });
  }
});

// =========================================
// Update completed steps for a saved roadmap
// =========================================

app.patch(
  "/api/roadmaps/:id/progress",
  async (req, res) => {
    const { id } = req.params;
    const { completedSteps } = req.body;

    console.log("Progress update received:", {
      id,
      completedSteps,
    });

    if (!Array.isArray(completedSteps)) {
      return res.status(400).json({
        message: "completedSteps must be an array",
      });
    }

    try {
      const { data, error } = await supabase
        .from("career_roadmaps")
        .update({
          completed_steps: completedSteps,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error(
          "Supabase progress update error:",
          error
        );

        return res.status(500).json({
          message: "Failed to update roadmap progress",
          error: error.message,
          details: error.details,
          hint: error.hint,
        });
      }

      console.log("Updated roadmap:", data);

      res.json({
        message: "Roadmap progress updated successfully",
        roadmap: data,
      });
    } catch (error) {
      console.error(
        "Progress update error:",
        error
      );

      res.status(500).json({
        message: "Something went wrong while updating progress",
        error: error.message,
      });
    }
  }
);

// =========================================
// Generate AI roadmap
// =========================================

app.post("/api/roadmap", async (req, res) => {
  const {
    skills,
    interests,
    careerGoal,
    education,
    experience,
    learningTime,
  } = req.body;

  console.log("Received data from frontend:");

  console.log({
    skills,
    interests,
    careerGoal,
    education,
    experience,
    learningTime,
  });

  // Validate required fields
  if (
    !skills ||
    !interests ||
    !careerGoal ||
    !education ||
    !experience ||
    !learningTime
  ) {
    return res.status(400).json({
      message: "Please provide all required career details",
    });
  }

  try {
    const prompt = `
You are a professional career guidance AI agent.

Create a personalized learning roadmap for a student.

Student details:
- Main skill: ${skills}
- Main interest: ${interests}
- Career goal: ${careerGoal}
- Education level: ${education}
- Experience level: ${experience}
- Available learning time: ${learningTime}

Create exactly 5 practical and beginner-friendly roadmap steps.

Each roadmap step must contain:
- title
- description
- duration

The roadmap should match the student's experience level,
career goal, interests, education level, and available
weekly learning time.

Return only valid JSON in this exact format:

{
  "roadmap": [
    {
      "title": "Step title",
      "description": "Step description",
      "duration": "3–4 weeks"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);

    let aiResponse = result.response.text();

    console.log("Raw Gemini response:");
    console.log(aiResponse);

    // Remove Markdown code fences if Gemini adds them
    aiResponse = aiResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (error) {
      console.error("Invalid JSON returned by Gemini:", aiResponse);

      return res.status(500).json({
        message: "AI returned an invalid JSON response",
      });
    }

    // Validate roadmap format
    if (
      !parsedResponse.roadmap ||
      !Array.isArray(parsedResponse.roadmap)
    ) {
      return res.status(500).json({
        message: "AI returned an invalid roadmap format",
      });
    }

    // Ensure exactly five roadmap steps
    if (parsedResponse.roadmap.length !== 5) {
      return res.status(500).json({
        message: "AI did not return exactly five roadmap steps",
      });
    }

    // Validate every roadmap step
    const invalidStep = parsedResponse.roadmap.some((step) => {
      return (
        !step.title ||
        !step.description ||
        !step.duration
      );
    });

    if (invalidStep) {
      return res.status(500).json({
        message: "One or more roadmap steps are incomplete",
      });
    }

    // Save roadmap in Supabase
    const {
      data: savedRoadmap,
      error: databaseError,
    } = await supabase
      .from("career_roadmaps")
      .insert([
        {
          skills: skills,
          interests: interests,
          career_goal: careerGoal,
          education: education,
          experience: experience,
          learning_time: learningTime,
          roadmap: parsedResponse.roadmap,
          completed_steps: [],
        },
      ])
      .select()
      .single();

    if (databaseError) {
      console.error(
        "Supabase database error:",
        databaseError
      );

      return res.status(500).json({
        message: "Roadmap generated but could not be saved",
        error: databaseError.message,
        details: databaseError.details,
        hint: databaseError.hint,
      });
    }

    res.json({
      message: "AI roadmap generated and saved successfully",
      careerGoal: careerGoal,
      roadmap: savedRoadmap.roadmap,
    });
  } catch (error) {
    console.error(
      "AI roadmap generation error:",
      error
    );

    res.status(500).json({
      message: "Failed to generate AI roadmap",
      error: error.message,
    });
  }
});

// =========================================
// AI career chat agent
// =========================================

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  console.log("Career chat question:", message);

  if (
    !message ||
    typeof message !== "string" ||
    message.trim() === ""
  ) {
    return res.status(400).json({
      message: "Please enter a valid question",
    });
  }

  try {
    const prompt = `
You are CareerPilot, an AI career guidance agent.

Your role is to help students with:

- Career discovery
- Skill development
- Learning roadmaps
- Internship preparation
- Project ideas
- Resume preparation
- Interview preparation
- Career-related questions

Give clear, practical, beginner-friendly answers.

Use headings or bullet points when useful.

Do not make unrealistic promises.

If the question is unrelated to careers, education,
learning, skills, internships, resumes, projects,
or professional development, politely guide the
user back toward career-related topics.

Student's question:
${message}

Answer in a helpful and structured way.
`;

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    console.log("Career chat response:", reply);

    res.json({
      reply: reply,
    });
  } catch (error) {
    console.error("Career chat error:", error);

    res.status(500).json({
      message: "Failed to generate chat response",
      error: error.message,
    });
  }
});

// =========================================
// Start server
// =========================================

app.listen(PORT, () => {
  console.log(
    `CareerPilot backend running on http://localhost:${PORT}`
  );
});