import React from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MdPreviewProps {
  source: string;
  className?: string;
}

const EnhancedMarkdownPreview = ({
  source,
  className = "",
}: MdPreviewProps) => {
  const cleanedSource = source.replace(/\\n/g, "\n");

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ ...props }) => (
            <h2
              {...props}
              className="text-xl font-bold text-foreground mb-3 mt-4 pb-2 border-b-2 border-primary"
            />
          ),
          h4: ({ ...props }) => (
            <h4
              {...props}
              className="text-lg font-semibold text-foreground mb-2 pb-1 border-b border-border"
            />
          ),
          strong: ({ ...props }) => (
            <strong {...props} className="font-bold text-foreground" />
          ),
          ul: ({ ...props }) => (
            <ul
              {...props}
              className="list-disc list-inside space-y-1 ml-4 text-muted-foreground"
            />
          ),
          ol: ({ ...props }) => (
            <ol
              {...props}
              className="list-decimal list-inside space-y-1 ml-4 text-muted-foreground"
            />
          ),
          li: ({ ...props }) => <li {...props} className="pl-2 mb-1" />,
          p: ({ ...props }) => (
            <p
              {...props}
              className="mb-3 text-muted-foreground leading-relaxed"
            />
          ),
          code: ({ ...props }) => (
            <code
              {...props}
              className="bg-secondary/20 text-secondary-foreground rounded px-1 py-0.5 text-sm font-mono"
            />
          ),
          // --- NEW TABLE STYLES BELOW ---
          table: ({ ...props }) => (
            <div className="my-6 w-full overflow-x-auto rounded-lg border border-border/60 shadow-sm">
              <table
                {...props}
                className="w-full text-sm text-left border-collapse"
              />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead
              {...props}
              className="bg-muted/50 text-foreground border-b border-border/60"
            />
          ),
          tbody: ({ ...props }) => (
            <tbody {...props} className="divide-y divide-border/60" />
          ),
          tr: ({ ...props }) => (
            <tr {...props} className="transition-colors hover:bg-muted/20" />
          ),
          th: ({ ...props }) => (
            <th
              {...props}
              className="px-4 py-3 font-semibold border-r border-border/60 last:border-r-0 align-middle"
            />
          ),
          td: ({ ...props }) => (
            <td
              {...props}
              className="px-4 py-3 text-muted-foreground border-r border-border/60 last:border-r-0 align-top leading-relaxed"
            />
          ),
        }}
      >
        {cleanedSource}
      </ReactMarkdown>
    </div>
  );
};

export const MarkdownPreview = EnhancedMarkdownPreview;
