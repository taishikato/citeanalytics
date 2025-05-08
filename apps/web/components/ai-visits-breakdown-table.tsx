import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { IconRipple } from "./icon-ripple";
import { AddDemoForm } from "./add-demo-form";
import { OpenAILogo, PerplexityLogo, GeminiLogo } from "@/components/logo";
import { type Tables } from "@/types/supabase";

type BotStats = {
  visits: number;
  lastVisited: string;
  pagesVisited: Set<string>;
};

type AiVisitsBreakdownTableProps = {
  visits:
    | Pick<
        Tables<"ai_visits">,
        "bot_type" | "timestamp" | "url" | "created_at"
      >[]
    | null;
};

export async function AiVisitsBreakdownTable({
  visits,
}: AiVisitsBreakdownTableProps) {
  if (!visits || visits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <IconRipple />
        <p className="text-lg font-medium mt-10">Waiting for AI visitors</p>
        <div className="flex items-center gap-2 mt-2 p-3 bg-muted rounded-lg">
          <OpenAILogo className="size-4" />
          <p className="text-sm font-medium">
            We access your website as a ChatGPT bot for demonstration purposes.
          </p>
        </div>

        <AddDemoForm />
      </div>
    );
  }

  // Group visits by bot_type and calculate metrics
  const botStats = visits.reduce(
    (acc, visit) => {
      if (!visit.bot_type || !visit.timestamp || !visit.url) return acc;

      const botType = visit.bot_type;
      if (!acc[botType]) {
        acc[botType] = {
          visits: 0,
          lastVisited: visit.timestamp,
          pagesVisited: new Set(),
        };
      }
      const stats = acc[botType];
      stats.visits++;
      stats.lastVisited =
        new Date(visit.timestamp) > new Date(stats.lastVisited)
          ? visit.timestamp
          : stats.lastVisited;
      stats.pagesVisited.add(visit.url);
      return acc;
    },
    {} as Record<string, BotStats>
  );

  // Convert to array and sort by number of visits
  const sortedBotStats = Object.entries(botStats)
    .map(([botType, stats]) => ({
      botType,
      visits: stats.visits,
      lastVisited: stats.lastVisited,
      pagesVisited: stats.pagesVisited.size,
    }))
    .sort((a, b) => b.visits - a.visits);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">AI Visits Breakdown</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Platform</TableHead>
            <TableHead>AI Visits</TableHead>
            <TableHead>Last visited</TableHead>
            <TableHead>Pages visited</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBotStats.map((item) => (
            <TableRow key={item.botType}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {item.botType === "chatgpt" ? (
                    <>
                      <OpenAILogo className="size-4" />
                      <span>ChatGPT</span>
                    </>
                  ) : item.botType === "perplexity" ? (
                    <>
                      <PerplexityLogo className="size-4" />
                      <span>Perplexity</span>
                    </>
                  ) : item.botType === "gemini" ? (
                    <>
                      <GeminiLogo className="size-4" />
                      <span>Gemini</span>
                    </>
                  ) : (
                    <span>{item.botType}</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{item.visits}</span>
                </div>
              </TableCell>
              <TableCell>
                {new Date(item.lastVisited).toLocaleString()}
              </TableCell>
              <TableCell>{item.pagesVisited}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
