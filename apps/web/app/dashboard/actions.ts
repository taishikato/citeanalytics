"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function fetchSupavec(): Promise<void> {
  try {
    const supabase = await createClient();

    // Get the user's project and website URL
    const { data: project } = await supabase
      .from("projects")
      .select("website_url")
      .single();

    if (!project?.website_url) {
      throw new Error("No website URL configured");
    }

    const response = await fetch(project.website_url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ChatGPT-User/1.0; +https://openai.com/bot",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch from website");
    }

    revalidatePath("/dashboard");
  } catch (error: unknown) {
    console.error(
      "Error fetching from website:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}
