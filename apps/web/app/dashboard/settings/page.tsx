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
import { Input } from "@workspace/ui/components/input";
import type { Database } from "@/types/supabase";

type Project = Database["public"]["Tables"]["projects"]["Row"];

export default function SettingsPage() {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isUrlValid, setIsUrlValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    await fetch("${process.env.NEXT_PUBLIC_APP_URL}/api/track", {
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

  return (
    <div className="container mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Website Settings</CardTitle>
          <CardDescription>
            Update the URL of the website where you're tracking AI bot visits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-[42px] w-full" />
            </div>
          ) : (
            <div className="space-y-4">
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
                <p className="text-sm text-red-500">
                  Please enter a valid URL (e.g., https://example.com)
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking Setup (Next.js)</CardTitle>
          <CardDescription>
            Add this middleware to your Next.js project to start tracking AI bot
            visits.
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
                root. AI bot visits will be automatically detected and recorded.
              </p>
            </div>
          ) : (
            <div className="text-muted-foreground">
              No project found. Please contact support.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
