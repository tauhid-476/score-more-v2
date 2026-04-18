"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@score-more-finale/ui/components/card";
import { Button } from "@score-more-finale/ui/components/button";
import { Loader2 } from "lucide-react";
import { client } from "@/utils/orpc";
import FileUpload from "@/components/FileUpload";

export default function Dashboard() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<
    { url: string; name: string }[]
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMutation = useMutation({
    mutationFn: (files: { url: string; name: string }[]) =>
      client.analysis.create({ files }),
    onSuccess: (data) => {
      toast.success("Analysis complete!");
      router.push(`/dashboard/analysis/${data.analysisId}` as any);
    },
    onError: (error) => {
      toast.error(error.message || "Analysis failed. Please try again.");
      setIsAnalyzing(false);
    },
  });

  const handleAnalyze = () => {
    if (!uploadedFiles.length) {
      toast.error("Please upload at least one PDF");
      return;
    }
    setIsAnalyzing(true);
    analyzeMutation.mutate(uploadedFiles);
  };

  return (
    <div className="container max-w-3xl mx-auto py-10 mt-10">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-center text-xl md:text-2xl">
            Exam Question Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center mb-6">
            Upload 1–4 exam papers (PDF, max 5MB each) to analyze frequently
            asked questions.
          </p>

          {!isAnalyzing ? (
            <>
              <FileUpload
                onFilesUploaded={(files) => {
                  // 'files' is exactly what your old UploadDropzone generated:
                  // [{ url: "https://utfs.io/f/...", name: "math_exam.pdf" }]
                  setUploadedFiles(files);
                  // You can immediately trigger your next step here
                  // analyzeExamPapers(files);
                }}
              />

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    {uploadedFiles.length} file(s) ready:
                  </p>
                  <ul className="text-sm space-y-1 mb-6">
                    {uploadedFiles.map((f) => (
                      <li key={f.url} className="text-foreground">
                        📄 {f.name}
                      </li>
                    ))}
                  </ul>
                  <Button onClick={handleAnalyze} className="w-full">
                    Analyze Papers
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground text-center">
                Analyzing your papers... this usually takes 30–60 seconds.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
