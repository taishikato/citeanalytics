"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/types/supabase";
import { OpenAILogo, PerplexityLogo, GeminiLogo } from "@/components/logo";
import { Button } from "@workspace/ui/components/button";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";

type Visit = Tables<"ai_visits">;
type VisitRow = Pick<Visit, "id" | "bot_type" | "url" | "timestamp">;

const pageSize = 20;

export function VisitsTable() {
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const fetchVisits = async () => {
      try {
        // First get total count
        const { count: totalRecords } = await supabase
          .from("ai_visits")
          .select("id", { count: "exact", head: true });

        if (totalRecords !== null) {
          setTotalCount(totalRecords);
        }

        // Then fetch paginated data
        const { data, error } = await supabase
          .from("ai_visits")
          .select("id, bot_type, url, timestamp")
          .order("timestamp", { ascending: false })
          .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

        if (error) throw error;
        setVisits(data || []);
      } catch (err) {
        console.error("Error fetching visits:", err);
        setError("Failed to load visits");
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, [currentPage, pageSize]);

  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleting(id);
      const supabase = createClient();
      const { error } = await supabase.from("ai_visits").delete().eq("id", id);

      if (error) throw error;

      // Update local state
      setVisits((prev) => prev.filter((visit) => visit.id !== id));
      setTotalCount((prev) => prev - 1);

      // If we deleted the last item on the current page, go to previous page
      if (visits.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    } catch (err) {
      console.error("Error deleting visit:", err);
      setError("Failed to delete visit");
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (visits.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No visits recorded yet</p>
        <p className="text-sm mt-2">
          AI visits will appear here when they occur
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bot Type</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Timestamp</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
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
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-destructive"
                      disabled={deleting === visit.id}
                    >
                      <Trash2 className="size-4" />
                      <span className="sr-only">Delete visit</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Visit Record</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this visit record? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(visit.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalCount)} of {totalCount} entries
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
