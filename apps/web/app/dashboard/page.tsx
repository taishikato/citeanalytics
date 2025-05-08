import { TrendingUpIcon, Dot } from "lucide-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { createClient } from "@/lib/supabase/server";
import { AiVisitsBreakdownTable } from "@/components/ai-visits-breakdown-table";
import { redirect } from "next/navigation";
import { LineChartComponent } from "@/components/LineChartComponent";
import { IconRipple } from "@/components/icon-ripple";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("onboarding_at, projects(id, website_url)")
    .single();

  if (!user?.onboarding_at) {
    redirect("/onboarding");
  }

  const projectDomain = user.projects?.[0]?.website_url
    ? new URL(user.projects[0].website_url).hostname
    : "No website set";

  const { count } = await supabase
    .from("ai_visits")
    .select("*", { count: "exact", head: true });

  const { data: visits } = await supabase
    .from("ai_visits")
    .select("created_at, bot_type, timestamp, url")
    .order("created_at", { ascending: true });

  type ChartDataItem = {
    day: string;
    chatgpt: number;
    perplexity: number;
    gemini: number;
  };

  const chartData: ChartDataItem[] = [];

  // Process the data
  if (visits) {
    for (const visit of visits) {
      const created_at = visit?.created_at;
      const bot_type = visit?.bot_type;

      if (typeof created_at === "string" && typeof bot_type === "string") {
        const day = new Date(created_at).toISOString().split("T")[0];
        const existingDay = chartData.find((item) => item.day === day);

        if (existingDay) {
          if (bot_type === "chatgpt") existingDay.chatgpt += 1;
          else if (bot_type === "perplexity") existingDay.perplexity += 1;
          else if (bot_type === "gemini") existingDay.gemini += 1;
        } else {
          chartData.push({
            day: day ?? "",
            chatgpt: bot_type === "chatgpt" ? 1 : 0,
            perplexity: bot_type === "perplexity" ? 1 : 0,
            gemini: bot_type === "gemini" ? 1 : 0,
          });
        }
      }
    }
  }

  // Sort by date
  chartData.sort((a, b) => a.day.localeCompare(b.day));

  // Get last 30 days of data
  const last30Days = chartData.slice(-30);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-x-3">
            <IconRipple
              icon={Dot}
              iconSize={16}
              inset="2px"
              iconColor="#6c29d9"
              borderColor="#6c29d9"
            />
            <h2 className="text-xl font-semibold">Analytics Overview</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
            <span className="text-sm font-medium">{projectDomain}</span>
          </div>
        </div>
      </div>
      <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 md:grid-cols-3 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card">
          <CardHeader className="relative">
            <CardDescription>Total Records</CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {count?.toLocaleString() ?? 0}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge
                variant="outline"
                className="flex gap-1 rounded-lg text-xs"
              >
                <TrendingUpIcon className="size-3" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Total AI visits tracked
            </div>
            <div className="text-muted-foreground">
              All-time records in the database
            </div>
          </CardFooter>
        </Card>
      </div>

      {last30Days.length > 0 && (
        <div className="mt-8">
          <LineChartComponent data={last30Days} />
        </div>
      )}

      <div className="mt-8">
        <AiVisitsBreakdownTable visits={visits} />
      </div>
    </div>
  );
}
