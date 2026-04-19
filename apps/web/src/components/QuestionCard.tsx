import { useState } from "react";
// import { Badge } from "@score-more-finale/ui/components/badge";
import { ChevronDown } from "lucide-react";
import { MarkdownPreview } from "./RTE";
import { cn } from "@score-more-finale/ui/lib/utils";

interface Question {
  question: string;
  marks: number | null;
  frequency: string;
  solution: string;
}

interface QuestionCardProps {
  question: Question;
  type: "hot" | "cool" | "extra";
  index: number;
}

const typeConfig = {
  hot: {
    border: "border-l-[3px] border-l-red-500",
    badgeClass: "border-red-500/60 text-red-400 bg-red-500/10",

  },
  cool: {
    border: "border-l-[3px] border-l-blue-500",
    badgeClass: "border-blue-500/60 text-blue-400 bg-blue-500/10",

  },
  extra: {
    border: "border-l-[3px] border-l-[#b6de3f]",
    badgeClass: "border-[#b6de3f]/60 text-[#b6de3f] bg-[#b6de3f]/10",

  },
};

const getFrequencyText = (frequency: string): string => {
  const map: Record<string, string> = {
    "1_OF_3_PAPERS": "1 of 3 papers",
    "1_OF_4_PAPERS": "1 of 4 papers",
    "2_OF_3_PAPERS": "2 of 3 papers",
    "2_OF_4_PAPERS": "2 of 4 papers",
    "3_OF_3_PAPERS": "3 of 3 papers",
    "3_OF_4_PAPERS": "3 of 4 papers",
    "4_OF_4_PAPERS": "4 of 4 papers",
  };
  return map[frequency] ?? frequency.replace(/_/g, " ").toLowerCase();
};

const preprocessMarkdown = (text: string): string => {
  const lines = text.split("\n");
  let output = "";
  let inList = false;

  lines.forEach((line) => {
    if (!inList && !line.match(/^\d+\./)) {
      output += line + "\n";
    } else if (line.match(/^\d+\./)) {
      inList = true;
      output += line + "\n";
    } else if (line.match(/^\s*\*\s/)) {
      output += line.replace(/^\s*\*\s/, "  - ") + "\n";
    } else if (line.trim() && inList) {
      output += "  " + line + "\n";
    } else {
      output += "\n";
    }
  });

  return output.trim();
};

export function QuestionCard({ question, type, index }: QuestionCardProps) {
  const [expanded, setExpanded] = useState(false);
  const config = typeConfig[type];

  return (
    <div
      className={cn(
        "group relative rounded-xl bg-transparent border border-border/40 overflow-hidden",
        "transition-all duration-300 ease-out",
        "animate-fade-in-up",
        config.border,

      )}
      style={{ animationDelay: `${index * 0.08}s`, animationFillMode: "both" }}
    >
      {/* Question header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-medium leading-relaxed text-foreground">
            {question.question}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {question.marks !== null && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border border-border/60 text-muted-foreground bg-muted/40">
                {question.marks} marks
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border",
                config.badgeClass,
              )}
            >
              {getFrequencyText(question.frequency)}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <div className="shrink-0 mt-0.5">
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-300",
              expanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Expandable solution */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-out",
          expanded ? "max-h-2499.75 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-5 pb-5 border-t border-border/40">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4 mb-3">
            Solution
          </p>
          <MarkdownPreview
            source={preprocessMarkdown(question.solution)}
            className={cn(
              "prose prose-base max-w-none",
              "prose-p:text-[15px] prose-p:leading-7 prose-p:text-foreground/90",
              "prose-li:text-[15px] prose-li:leading-7 prose-li:text-foreground/90",
              "prose-strong:text-foreground prose-strong:font-semibold",
              "prose-headings:text-foreground prose-headings:font-semibold",
              "prose-headings:text-base",
              "dark:prose-invert",
            )}
          />
        </div>
      </div>
    </div>
  );
}
