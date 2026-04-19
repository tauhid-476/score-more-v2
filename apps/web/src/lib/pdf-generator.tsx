import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Font,
} from "@react-pdf/renderer";
import Html from "react-pdf-html"; // <-- NEW IMPORT
import { marked } from "marked"; // <-- NEW IMPORT
import type { ExamQuestion } from "@score-more-finale/api/lib/types";

// Register a better default font (Roboto) for a modern look
// Register a better default font (Roboto) for a modern look, including italics!
Font.register({
  family: "Roboto",
  fonts: [
    // Normal / Upright fonts
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },

    // NEW: Italic fonts required for Markdown parsing
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bolditalic-webfont.ttf",
      fontWeight: 700,
      fontStyle: "italic",
    },
  ],
});

export interface PDFData {
  subject: string;
  hot: { questions: ExamQuestion[] };
  cool: { questions: ExamQuestion[] };
  extras: { questions: ExamQuestion[] };
}

const getFrequencyText = (frequency: string) => {
  switch (frequency) {
    case "1_OF_3_PAPERS":
      return "1 of 3 papers";
    case "2_OF_3_PAPERS":
      return "2 of 3 papers";
    case "3_OF_3_PAPERS":
      return "All 3 papers";
    default:
      return frequency;
  }
};

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Roboto",
    backgroundColor: "#F9FAFB",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 400,
    color: "#6B7280",
  },
  section: {
    // marginBottom removed so page breaks handle spacing
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#FFFFFF",
  },
  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20, // Added margin for breathing room
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: 700,
    marginRight: 8,
    minWidth: 28,
    flexShrink: 0,
  },
  questionText: {
    fontSize: 12,
    fontWeight: 500,
    color: "#1F2937",
    flex: 1,
    lineHeight: 1.4,
  },
  questionMeta: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 10,
    fontWeight: 500,
    color: "#4B5563",
  },
  solutionBox: {
    borderLeftWidth: 3,
    borderLeftColor: "#D1D5DB",
    paddingLeft: 10,
    marginTop: 5,
  },
  solutionLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#9CA3AF",
  },
});

// --- UPDATED: Strict HTML Styles to prevent overlap and huge fonts ---
const htmlStyles = StyleSheet.create({
  body: {
    fontSize: 11,
    fontFamily: "Roboto",
    color: "#4B5563",
    lineHeight: 1.6,
  },
  p: { fontSize: 11, marginBottom: 8, lineHeight: 1.6 },
  ul: { marginBottom: 8, marginLeft: 12 },
  ol: { marginBottom: 8, marginLeft: 12 },
  li: { fontSize: 11, marginBottom: 4, lineHeight: 1.6 },
  h1: {
    fontSize: 16,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
    marginTop: 12,
    lineHeight: 1.4,
  },
  h2: {
    fontSize: 14,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
    marginTop: 12,
    lineHeight: 1.4,
  },
  h3: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
    marginTop: 12,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: 11,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
    marginTop: 12,
    lineHeight: 1.4,
  },
  strong: { fontWeight: 700, color: "#111827" },
  em: { fontStyle: "italic" },
  table: {
    width: "100%",
    marginBottom: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  th: {
    backgroundColor: "#F3F4F6",
    padding: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontWeight: 700,
    color: "#111827",
    fontSize: 10,
  },
  td: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 10,
    lineHeight: 1.5,
  },
});
// ---------------------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------------------

// Extracting a single Question Card to keep the code DRY
// ---------------------------------------------------------------------------
// COMPONENTS
// ---------------------------------------------------------------------------

const QuestionCard = ({
  q,
  index,
  color,
}: {
  q: ExamQuestion;
  index: number;
  color: string;
}) => {
  const cleanedSolution = q.solution.replace(/\\n/g, "\n");
  const htmlContent = marked.parse(cleanedSolution, { async: false }) as string;

  return (
    // REMOVED wrap={false}. If a solution is 2 pages long, it will gracefully span across them!
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        <Text style={[styles.questionNumber, { color }]}>Q{index + 1}.</Text>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>

      <View style={styles.questionMeta}>
        <Text style={styles.metaText}>
          {q.marks ? `${q.marks} Marks` : "Marks N/A"} •{" "}
          {getFrequencyText(q.frequency)}
        </Text>
      </View>

      <View style={styles.solutionBox}>
        <Text style={styles.solutionLabel}>Solution</Text>
        <Html stylesheet={htmlStyles}>{htmlContent}</Html>
      </View>
    </View>
  );
};

const QuestionSection = ({
  title,
  questions,
  color,
  isFirstSection, // We pass this to know if we should break the page before the section
}: {
  title: string;
  questions: ExamQuestion[];
  color: string;
  isFirstSection?: boolean;
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    // If it's NOT the very first section on the title page, push the section to a new page!
    <View style={styles.section} break={!isFirstSection}>
      {/* Header and Question 1 share the same page */}
      <View style={[styles.sectionHeader, { backgroundColor: color }]}>
        <Text style={styles.sectionTitle}>
          {title} ({questions.length})
        </Text>
      </View>
      <QuestionCard q={questions[0]} index={0} color={color} />

      {/* Every subsequent question is forced onto a brand new page */}
      {questions.slice(1).map((q, index) => (
        <View key={index + 1} break>
          <QuestionCard q={q} index={index + 1} color={color} />
        </View>
      ))}
    </View>
  );
};

const ExamDocument = ({ data }: { data: PDFData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>{data.subject}</Text>
        <Text style={styles.subtitle}>
          Detailed Question Analysis & Solutions
        </Text>
      </View>

      {/* We pass isFirstSection={true} to the first available section so it stays on page 1 */}
      {data.hot.questions.length > 0 && (
        <QuestionSection
          title="Hot Questions"
          questions={data.hot.questions}
          color="#EF4444"
          isFirstSection={true}
        />
      )}
      {data.cool.questions.length > 0 && (
        <QuestionSection
          title="Cool Questions"
          questions={data.cool.questions}
          color="#3B82F6"
          isFirstSection={!data.hot.questions.length}
        />
      )}
      {data.extras.questions.length > 0 && (
        <QuestionSection
          title="Extra Questions"
          questions={data.extras.questions}
          color="#8B5CF6"
          isFirstSection={
            !data.hot.questions.length && !data.cool.questions.length
          }
        />
      )}

      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Page ${pageNumber} of ${totalPages}`
        }
        fixed
      />
    </Page>
  </Document>
);

// ---------------------------------------------------------------------------
// EXPORTED GENERATION FUNCTION
// ---------------------------------------------------------------------------
export const generatePDF = async (data: PDFData) => {
  const blob = await pdf(<ExamDocument data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${data.subject.replace(/\s+/g, "-").toLowerCase()}-analysis.pdf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
