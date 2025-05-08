"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Copy } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/config";
import { Input } from "@workspace/ui/components/input";
import type { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"];

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://ai-citations.com";

export default function OnboardingPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProjectId = async () => {
      const supabase = createClient();

      const { data: project } = await supabase
        .from("projects")
        .select("id, website_url")
        .single<Project>();

      if (project) {
        setProjectId(project.id);
        if (project.website_url) {
          setWebsiteUrl(project.website_url);
          setIsUrlValid(true);
        }
      }
      setLoading(false);
    };

    fetchProjectId();
  }, []);

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setWebsiteUrl(url);
    setIsUrlValid(validateUrl(url));
  };

  const handleSaveUrl = async () => {
    if (!isUrlValid || !projectId) return;

    setIsSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("projects")
        .update({ website_url: websiteUrl })
        .match({ id: projectId });

      if (error) throw error;
      toast.success("Website URL saved successfully");
    } catch (error) {
      toast.error("Failed to save website URL");
      console.error("Error saving website URL:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const middlewareCode = projectId
    ? `// middleware.ts
import {
  type NextRequest,
  NextResponse,
} from "next/server";
import { after } from "next/server";

async function sendTrackingData(url: string, userAgent: string) {
  try {
    await fetch("${appUrl}/api/track", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: "${projectId}",
          url,
          userAgent,
        }),
      },
    );
    console.log("Successfully sent tracking data");
  } catch (error: unknown) {
    console.error("Failed to send tracking data:", error);
  }
}

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  event.waitUntil(sendTrackingData(request.url, userAgent));
  after(async () => {
    await sendTrackingData(request.url, userAgent);
  });

  return NextResponse.next();
}`
    : "";

  const handleCopyCode = () => {
    if (!projectId) return;
    navigator.clipboard.writeText(middlewareCode);
    toast.success("Middleware code copied to clipboard");
  };

  const handleProceedToDashboard = async () => {
    if (!isUrlValid) {
      toast.error("Please enter a valid website URL first");
      return;
    }

    setIsNavigating(true);
    const supabase = createClient();

    try {
      // Mark onboarding as complete
      await supabase
        .from("users")
        .update({ onboarding_at: new Date().toISOString() })
        // @ts-ignore
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to proceed to dashboard");
      setIsNavigating(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to {siteConfig.name}</h1>
          <p className="text-muted-foreground">Let's get your project set up</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Step 1: Add Your Website URL</CardTitle>
            <CardDescription>
              Enter the URL of the website where you'll be tracking AI bot
              visits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://your-website.com"
                value={websiteUrl}
                onChange={handleUrlChange}
                className={`flex-1 ${!isUrlValid && websiteUrl ? "border-red-500" : ""}`}
              />
              <Button
                onClick={handleSaveUrl}
                disabled={!isUrlValid || isSaving}
              >
                {isSaving ? "Saving..." : "Save URL"}
              </Button>
            </div>
            {!isUrlValid && websiteUrl && (
              <p className="text-sm text-red-500 mt-1">
                Please enter a valid URL (e.g., https://example.com)
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 2: Add Tracking Code</CardTitle>
            <CardDescription>
              Add this middleware to your Next.js project to start tracking AI
              bot visits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-[42px] w-full" />
              </div>
            ) : projectId ? (
              <div className="space-y-4">
                <div className="relative">
                  <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                    <code className="text-sm">{middlewareCode}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    className="absolute top-2 right-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Place this code as <code>middleware.ts</code> in your project
                  root. AI bot visits will be automatically detected and
                  recorded.
                </p>
              </div>
            ) : (
              <div className="text-muted-foreground">
                No project found. Please contact support.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Deploy Your Changes</CardTitle>
            <CardDescription>
              Deploy your Next.js application with the new middleware to start
              tracking AI visits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              After deploying your changes, your application will automatically
              start tracking AI bot visits.
            </p>
            <Button
              onClick={handleProceedToDashboard}
              className="w-full"
              disabled={isNavigating}
            >
              {isNavigating
                ? "Loading..."
                : "I've Deployed the Changes - Take Me to Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
