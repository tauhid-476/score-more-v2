"use client";
import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";
import { AlertTriangle, Download, Loader2 } from "lucide-react";
import { Button } from "@score-more-finale/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@score-more-finale/ui/components/card";
import { toast } from "sonner";

// Import your existing components from MVP
import { QuesCardSec } from "@/components/QuesCardSec";
import { generatePDF } from "@/lib/pdf-generator";

export default function AnalysisClient({ id }: { id: string }) {
  const { data, isLoading, error } = useQuery(
    orpc.analysis.getById.queryOptions({ input: { id } }),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-destructive">Failed to load analysis.</p>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    try {
      generatePDF({
        subject: data.metadata.subject,
        hot: data.hot,
        cool: data.cool,
        extras: data.extras,
      });
      toast.success("PDF downloaded!");
    } catch {
      toast.error("Failed to generate PDF.");
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-10 mt-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">
            {data.metadata.subject}
          </CardTitle>
          <p className="text-muted-foreground">
            {data.metadata.paperCount} papers analyzed •{" "}
            {data.metadata.totalQuestions} questions found
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-yellow-100 text-yellow-800 rounded-md mb-6">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span>
              Solutions are for guidance only and should not be considered
              final.
            </span>
          </div>

          {/* Uploaded papers */}
          {data.files.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Uploaded Papers:</p>
              <ul className="text-sm space-y-1">
                {data.files.map((f) => (
                  <li key={f.id}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary underline"
                    >
                      📄 {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Plug in your QuesCardSec here */}
          <QuesCardSec data={data} />

          <div className="mt-8 flex justify-center">
            <Button onClick={handleDownloadPDF} className="gap-2">
              <Download className="h-4 w-4" />
              Download as PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
