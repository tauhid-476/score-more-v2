import { db } from "@score-more-finale/db";
import {
  analyses,
  questions,
  uploadedFiles,
} from "@score-more-finale/db/schema/analysis";
import { env } from "@score-more-finale/env/server";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../index";
import { generateExamAnalysisPrompt } from "../lib/prompt";
import { convertToProperJson } from "../lib/to-json";
import type { ExamAnalysisError, ExamAnalysisResponse } from "../lib/types";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const MOCK_RESPONSE: ExamAnalysisResponse = {
  metadata: {
    subject: "Artificial Intelligence",
    paperCount: 4,
    totalQuestions: 60,
  },
  hot: {
    questions: [
      {
        question:
          "Compare Informed (Heuristic) Search and Uninformed (Blind) Search strategies with examples.",
        marks: 10,
        frequency: "4_OF_4_PAPERS",
        solution:
          "### Search Strategies Comparison\n\nHere is the detailed comparison between Informed and Uninformed search approaches:\n\n| Feature | Informed (Heuristic) Search | Uninformed (Blind) Search |\n| :--- | :--- | :--- |\n| **Definition** | Uses domain-specific knowledge to guide the search towards the goal. | Uses no information other than the problem definition. |\n| **Efficiency** | Generally faster and highly efficient. | Time-consuming and requires large memory allocation. |\n| **Mechanism** | Uses a heuristic function, e.g., $f(n) = g(n) + h(n)$ | No heuristic evaluation function is used. |\n| **Completeness** | Not always complete (depends heavily on the heuristic). | Generally complete (e.g., Breadth-First Search). |\n| **Algorithms** | A* Search, Greedy Best-First Search. | BFS, DFS, Uniform Cost Search. |\n\n**Conclusion:** Informed search is heavily preferred for complex, large state-space problems like chess or route planning, whereas uninformed search is suited for smaller, simpler graph traversals.",
      },
      {
        question:
          "Explain the concept of Alpha-Beta Pruning in the context of the Minimax algorithm.",
        marks: 10,
        frequency: "3_OF_4_PAPERS",
        solution:
          "### Alpha-Beta Pruning\n\nAlpha-beta pruning is a mathematical optimization technique for the minimax algorithm used heavily in adversarial game playing (like Chess or Tic-Tac-Toe).\n\n* **Alpha ($\\alpha$):** The best (highest-value) choice found so far at any choice point along the path for the **MAX** player.\n* **Beta ($\\beta$):** The best (lowest-value) choice found so far at any choice point along the path for the **MIN** player.\n\n**Pruning Conditions:**\n1.  **Beta Pruning:** Search can be stopped below a MIN node if its $\\beta$ value is less than or equal to the $\\alpha$ value of any of its MAX ancestors.\n2.  **Alpha Pruning:** Search can be stopped below a MAX node if its $\\alpha$ value is greater than or equal to the $\\beta$ value of any of its MIN ancestors.\n\n> **Note:** Alpha-beta pruning **does not** change the final optimal decision of the minimax algorithm; it strictly reduces the number of leaf nodes evaluated, drastically improving time complexity.",
      },
    ],
  },
  cool: {
    questions: [
      {
        question:
          "Describe the primary components of an Expert System architecture.",
        marks: 8,
        frequency: "2_OF_4_PAPERS",
        solution:
          '### Architecture of an Expert System\n\nAn Expert System is designed to solve complex problems by reasoning through bodies of knowledge. It consists of three primary components:\n\n1.  **Knowledge Base:**\n    * The core database containing domain-specific, high-quality knowledge.\n    * Stores rules, facts, and heuristics (typically structured as `IF-THEN` rules).\n2.  **Inference Engine:**\n    * The "brain" of the system.\n    * Applies logical rules to the knowledge base to deduce new information and arrive at conclusions.\n    * Operates using either **Forward Chaining** (data-driven) or **Backward Chaining** (goal-driven) methodologies.\n3.  **User Interface:**\n    * Allows non-expert human users to interact with the system.\n    * Accepts natural language queries and displays conclusions or explanations.\n\n**Ancillary Modules:**\n* **Knowledge Acquisition Facility:** Assists in extracting and formatting knowledge from human experts.\n* **Explanation Module:** Transparently explains *how* and *why* a particular conclusion was reached by the engine.',
      },
    ],
  },
  extras: {
    questions: [
      {
        question:
          "Differentiate between Supervised and Unsupervised Machine Learning.",
        marks: 5,
        frequency: "1_OF_4_PAPERS",
        solution:
          "### Supervised vs. Unsupervised Learning\n\n| Aspect | Supervised Learning | Unsupervised Learning |\n| :--- | :--- | :--- |\n| **Input Data** | Trained on **labeled** data (Input variables + Known Target). | Trained on **unlabeled** data (Input variables only). |\n| **Core Objective** | Predict outcomes or classify new, unseen data accurately. | Discover hidden patterns, structures, or groupings. |\n| **Feedback Loop** | Explicit feedback is provided during training to calculate loss. | No explicit feedback mechanism or supervisor exists. |\n| **Common Algorithms** | Linear Regression, SVM, Random Forests. | K-Means Clustering, Principal Component Analysis (PCA). |\n| **Complexity** | Conceptually simpler, but requires expensive labeled datasets. | Computationally complex as the system learns structures independently. |",
      },
    ],
  },
};

export const analysisRouter = {
  // Create a new analysis from uploaded file URLs
  create: protectedProcedure
    .input(
      z.object({
        files: z
          .array(
            z.object({
              url: z.string().url(),
              name: z.string(),
            }),
          )
          .min(1)
          .max(4),
      }),
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Fetch each PDF from Uploadthing URL and convert to base64
      // const contentParts: (string | Part)[] = [];
      // for (const file of input.files) {
      //   const res = await fetch(file.url);
      //   const buffer = await res.arrayBuffer();
      //   const base64 = Buffer.from(buffer).toString("base64");
      //   contentParts.push({
      //     inlineData: {
      //       data: base64,
      //       mimeType: "application/pdf",
      //     },
      //   });
      // }

      // const dynamicPrompt = generateExamAnalysisPrompt(input.files.length);
      // contentParts.push({ text: dynamicPrompt });

      // // Call Gemini
      // const result = await model.generateContent(contentParts);
      // const parsed = convertToProperJson(result.response.text());

      // // If Gemini returned an error object
      // if ("error" in parsed && parsed.error) {
      //   throw new Error((parsed as unknown as ExamAnalysisError).message);
      // }

      // const data = parsed as ExamAnalysisResponse;
      const data = MOCK_RESPONSE; // Use mock response for testing without API calls

      // Save analysis to DB
      const [analysis] = await db
        .insert(analyses)
        .values({
          userId,
          subject: data.metadata.subject,
          paperCount: data.metadata.paperCount,
        })
        .returning();

      if (!analysis) {
        throw new Error("Failed to create analysis");
      }

      // Save uploaded file metadata
      await db.insert(uploadedFiles).values(
        input.files.map((f) => ({
          analysisId: analysis.id,
          url: f.url,
          name: f.name,
        })),
      );

      // Flatten and save all questions
      const allQuestions = [
        ...data.hot.questions.map((q) => ({ ...q, category: "hot" as const })),
        ...data.cool.questions.map((q) => ({
          ...q,
          category: "cool" as const,
        })),
        ...data.extras.questions.map((q) => ({
          ...q,
          category: "extras" as const,
        })),
      ];

      await db.insert(questions).values(
        allQuestions.map((q) => ({
          analysisId: analysis.id,
          question: q.question,
          marks: q.marks ?? null,
          frequency: q.frequency,
          solution: q.solution,
          category: q.category,
        })),
      );

      return { analysisId: analysis.id };
    }),

  // Get a single analysis with all questions and files
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const analysis = await db.query.analyses.findFirst({
        where: eq(analyses.id, input.id),
        with: {
          questions: true,
          files: true,
        },
      });

      if (!analysis) throw new Error("Analysis not found");
      if (analysis.userId !== userId) throw new Error("Unauthorized");

      // Reshape into the ExamAnalysisResponse shape your frontend expects
      return {
        metadata: {
          subject: analysis.subject,
          paperCount: analysis.paperCount,
          totalQuestions: analysis.questions.length,
        },
        files: analysis.files,
        hot: {
          questions: analysis.questions.filter((q) => q.category === "hot"),
        },
        cool: {
          questions: analysis.questions.filter((q) => q.category === "cool"),
        },
        extras: {
          questions: analysis.questions.filter((q) => q.category === "extras"),
        },
      };
    }),

  // List all analyses for the logged-in user
  list: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;

    const userAnalyses = await db.query.analyses.findMany({
      where: eq(analyses.userId, userId),
      orderBy: (analyses, { desc }) => [desc(analyses.createdAt)],
      with: {
        files: true,
      },
    });

    return userAnalyses.map((a) => ({
      id: a.id,
      subject: a.subject,
      paperCount: a.paperCount,
      createdAt: a.createdAt,
      files: a.files,
    }));
  }),
};
