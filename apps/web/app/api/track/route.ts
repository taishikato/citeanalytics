import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

// Known AI bot patterns
const AI_BOT_PATTERNS = {
  chatgpt: [
    "ChatGPT-User/1.0",
    "GPTBot/1.0",
    "GPTBot/1.2",
    "OAI-SearchBot/1.0",
  ],
  claude: ["Claude-Web", "Anthropic-AI"],
  perplexity: ["PerplexityBot/1.0"],
  gemini: ["Google"],
  // Add other AI bot patterns as needed
};

// Detect AI bot type from User-Agent
function detectAIBot(userAgent: string): string | null {
  if (!userAgent) return null;

  for (const [botType, patterns] of Object.entries(AI_BOT_PATTERNS)) {
    if (
      patterns.some((pattern) => {
        if (botType === "gemini") {
          return userAgent === pattern;
        }
        return userAgent.includes(pattern);
      })
    ) {
      return botType;
    }
  }
  return null;
}

// Handle OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    console.log("[track] Received tracking request");
    const data = await request.json();

    // Get User-Agent from request headers
    const botType = detectAIBot(data.userAgent);

    // If no project_id is provided or it's not an AI bot, return early
    if (!data.projectId) {
      return NextResponse.json(
        { error: "Missing project ID" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Only proceed if it's an AI bot
    if (!botType) {
      console.log("[track] Not an AI bot request");
      return NextResponse.json(
        { message: "Not an AI bot request" },
        { headers: corsHeaders }
      );
    }

    // Insert tracking data into Supabase
    const { error } = await supabaseAdmin.from("ai_visits").insert({
      project_id: data.projectId,
      url: data.url || request.url,
      timestamp: new Date().toISOString(),
      user_agent: data.userAgent,
      bot_type: botType || "unknown",
    });

    if (error) {
      console.error("[track] Error inserting tracking data:", error);
      return NextResponse.json(
        { error: "Failed to save tracking data" },
        { status: 500, headers: corsHeaders }
      );
    }

    console.log("[track] Successfully saved tracking data");
    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("[track] Error processing tracking request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
