import { OpenAILogo, PerplexityLogo, GeminiLogo } from "@/components/logo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { supabaseAdmin } from "@/lib/supabase/admin";

const PROJECT_ID = "2ac9af27-97fe-4f33-86f3-34b8d9d63647";

export async function VisitsTable() {
  const { data: visits } = await supabaseAdmin
    .from("ai_visits")
    .select("id, bot_type, url, timestamp")
    .match({ project_id: PROJECT_ID })
    .order("timestamp", { ascending: false })
    .limit(20);

  if (!visits) {
    return <div>No visits found</div>;
  }

  return (
    <div className="">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Activity Log</h2>
          <p className="text-muted-foreground">
            The latest 20 AI bot activities
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bot Type</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Timestamp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visits.map((visit) => (
            <TableRow key={visit.id}>
              <TableCell className="font-medium">
                {visit.bot_type === "chatgpt" ? (
                  <div className="flex items-center gap-2">
                    <OpenAILogo className="size-4" />
                    ChatGPT
                  </div>
                ) : visit.bot_type === "perplexity" ? (
                  <div className="flex items-center gap-2">
                    <PerplexityLogo className="size-4" />
                    Perplexity
                  </div>
                ) : visit.bot_type === "gemini" ? (
                  <div className="flex items-center gap-2">
                    <GeminiLogo className="size-4" />
                    Gemini
                  </div>
                ) : (
                  visit.bot_type
                )}
              </TableCell>
              <TableCell className="font-mono text-sm">{visit.url}</TableCell>
              <TableCell>
                {new Date(visit.timestamp).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
