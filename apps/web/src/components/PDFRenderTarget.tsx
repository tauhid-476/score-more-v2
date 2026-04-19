import type {
  ExamAnalysisResponse,
  ExamQuestion,
} from "@score-more-finale/api/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PDFRenderTargetProps {
  data: ExamAnalysisResponse;
}

const typeConfig = {
  hot: { label: "🔥 Hot Topics", color: "#ef4444", bg: "#fef2f2" },
  cool: { label: "❄️ Cool Topics", color: "#3b82f6", bg: "#eff6ff" },
  extra: { label: "⭐ Extra Topics", color: "#65a30d", bg: "#f7fee7" },
};

function PDFQuestion({
  question,
  index,
  type,
}: {
  question: ExamQuestion;
  index: number;
  type: keyof typeof typeConfig;
}) {
  const config = typeConfig[type];
  return (
    <div
      style={{
        marginBottom: "24px",
        borderLeft: `4px solid ${config.color}`,
        borderRadius: "8px",
        border: `1px solid #e5e7eb`,
        borderLeftWidth: "4px",
        borderLeftColor: config.color,
        overflow: "hidden",
      }}
    >
      {/* Question header */}
      <div style={{ padding: "16px 20px", background: "#f9fafb" }}>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#6b7280",
              background: "#e5e7eb",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            Q{index + 1}
          </span>
          {question.marks && (
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "#6b7280",
                background: "#e5e7eb",
                padding: "2px 8px",
                borderRadius: "4px",
              }}
            >
              {question.marks} marks
            </span>
          )}
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: config.color,
              background: config.bg,
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            {question.frequency.replace(/_/g, " ").toLowerCase()}
          </span>
        </div>
        <p
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "#111827",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          {question.question}
        </p>
      </div>

      {/* Solution */}
      <div style={{ padding: "16px 20px", background: "#ffffff" }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#6b7280",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "12px",
          }}
        >
          Solution
        </p>
        <div style={{ fontSize: "14px", lineHeight: 1.7, color: "#1f2937" }}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    margin: "16px 0 8px",
                    color: "#111827",
                  }}
                >
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    margin: "14px 0 6px",
                    color: "#111827",
                  }}
                >
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    margin: "12px 0 4px",
                    color: "#111827",
                  }}
                >
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p style={{ margin: "0 0 10px", lineHeight: 1.7 }}>
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul style={{ paddingLeft: "20px", margin: "0 0 10px" }}>
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol style={{ paddingLeft: "20px", margin: "0 0 10px" }}>
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: "4px", lineHeight: 1.6 }}>
                  {children}
                </li>
              ),
              strong: ({ children }) => (
                <strong style={{ fontWeight: 700, color: "#111827" }}>
                  {children}
                </strong>
              ),
              code: ({ children, className }) => {
                const isBlock = className?.includes("language-");
                return isBlock ? (
                  <pre
                    style={{
                      background: "#f3f4f6",
                      padding: "12px",
                      borderRadius: "6px",
                      overflow: "auto",
                      fontSize: "13px",
                      margin: "8px 0",
                    }}
                  >
                    <code>{children}</code>
                  </pre>
                ) : (
                  <code
                    style={{
                      background: "#f3f4f6",
                      padding: "2px 5px",
                      borderRadius: "3px",
                      fontSize: "13px",
                      fontFamily: "monospace",
                    }}
                  >
                    {children}
                  </code>
                );
              },
              table: ({ children }) => (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "10px 0",
                    fontSize: "13px",
                  }}
                >
                  {children}
                </table>
              ),
              th: ({ children }) => (
                <th
                  style={{
                    border: "1px solid #d1d5db",
                    padding: "6px 10px",
                    background: "#f3f4f6",
                    fontWeight: 600,
                    textAlign: "left",
                  }}
                >
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td
                  style={{ border: "1px solid #d1d5db", padding: "6px 10px" }}
                >
                  {children}
                </td>
              ),
              blockquote: ({ children }) => (
                <blockquote
                  style={{
                    borderLeft: "3px solid #d1d5db",
                    paddingLeft: "12px",
                    margin: "8px 0",
                    color: "#6b7280",
                    fontStyle: "italic",
                  }}
                >
                  {children}
                </blockquote>
              ),
            }}
          >
            {question.solution}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function PDFRenderTarget({ data }: PDFRenderTargetProps) {
  return (
    <div
      style={{
        fontFamily: "Georgia, serif",
        padding: "40px",
        background: "#ffffff",
        color: "#000000",
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "32px",
          borderBottom: "2px solid #16a34a",
          paddingBottom: "16px",
        }}
      >
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#111827",
            margin: "0 0 4px",
          }}
        >
          {data.metadata.subject}
        </h1>
        <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
          {data.metadata.paperCount} papers analyzed •{" "}
          {data.metadata.totalQuestions} questions found
        </p>
      </div>

      {/* Warning */}
      <div
        style={{
          background: "#fefce8",
          border: "1px solid #fde047",
          borderRadius: "8px",
          padding: "10px 14px",
          marginBottom: "28px",
          fontSize: "13px",
          color: "#854d0e",
        }}
      >
        ⚠️ Solutions are for guidance only and should not be considered final.
      </div>

      {/* Sections */}
      {(["hot", "cool", "extras"] as const).map((sectionKey) => {
        const questions =
          sectionKey === "extras"
            ? data.extras.questions
            : data[sectionKey].questions;
        const typeKey = sectionKey === "extras" ? "extra" : sectionKey;
        if (!questions.length) return null;
        return (
          <div key={sectionKey} style={{ marginBottom: "36px" }}>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "16px",
                color: typeConfig[typeKey].color,
              }}
            >
              {typeConfig[typeKey].label} ({questions.length})
            </h2>
            {questions.map((q, i) => (
              <PDFQuestion key={i} question={q} index={i} type={typeKey} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
