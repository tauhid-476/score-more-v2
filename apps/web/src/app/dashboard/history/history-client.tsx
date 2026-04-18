"use client";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@score-more-finale/ui/components/card";
import { Button } from "@score-more-finale/ui/components/button";

export default function HistoryClient() {
  const router = useRouter();
  const { data, isLoading } = useQuery(orpc.analysis.list.queryOptions());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="container max-w-3xl mx-auto py-10 mt-10 text-center">
        <p className="text-muted-foreground">No analyses yet. Upload your first exam paper!</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard")}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto py-10 mt-10">
      <h1 className="text-2xl font-semibold mb-6">Past Analyses</h1>
      <div className="space-y-4">
        {data.map((analysis) => (
          <Card
            key={analysis.id}
            className="cursor-pointer hover:border-primary transition-colors"
            onClick={() => router.push(`/dashboard/analysis/${analysis.id}` as any)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{analysis.subject}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {analysis.paperCount} papers •{" "}
                {new Date(analysis.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </CardHeader>
            {analysis.files.length > 0 && (
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {analysis.files.map((f) => f.name).join(", ")}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}