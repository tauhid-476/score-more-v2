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
    subject: "Computer Networks",
    paperCount: 4,
    totalQuestions: 60,
  },
  hot: {
    questions: [
      {
        question:
          "Compare the OSI reference model with the TCP/IP reference model.",
        marks: 10,
        frequency: "4_OF_4_PAPERS",
        solution:
          "1. Both OSI and TCP/IP are layered communication models.\\n2. OSI has 7 layers, while TCP/IP has 4 (or 5) layers.\\n3. OSI layers: Physical, Data Link, Network, Transport, Session, Presentation, Application.\\n4. TCP/IP layers: Network Access, Internet, Transport, Application.\\n5. OSI is a conceptual model, whereas TCP/IP is a practical, client-server model used for the Internet.\\n6. OSI clearly distinguishes between services, interfaces, and protocols.\\n7. TCP/IP does not clearly distinguish these concepts.\\n8. In OSI, the Network layer supports both connectionless and connection-oriented communication.\\n9. In TCP/IP, the Internet layer supports only connectionless communication.\\n10. TCP/IP is more reliable for real-world networking, while OSI is mainly a reference tool.",
      },
      {
        question:
          "Explain the functioning of IPv4 addressing and sub-netting with a suitable example.",
        marks: 10,
        frequency: "3_OF_4_PAPERS",
        solution:
          "1. IPv4 addresses are 32-bit logical addresses assigned to devices on a network.\\n2. They are represented in dotted-decimal notation (e.g., 192.168.1.1).\\n3. The address space is divided into classes: A, B, C, D, and E.\\n4. Class A is for large networks, B for medium, C for small, D for multicast, E for experimental.\\n5. Subnetting is the process of dividing a larger network into smaller, manageable sub-networks.\\n6. This is done by borrowing bits from the host portion of the IP address to create a subnet mask.\\n7. Example: A Class C address 192.168.1.0 with a default mask of /24 (255.255.255.0).\\n8. If we borrow 2 bits for subnetting, the new mask is /26 (255.255.255.192).\\n9. This creates 4 subnets (2^2) with 62 usable hosts each (2^6 - 2).\\n10. Subnetting reduces broadcast domains and improves network security and performance.",
      },
    ],
  },
  cool: {
    questions: [
      {
        question:
          "Describe the Distance Vector Routing Protocol with an example. What is the count-to-infinity problem?",
        marks: 10,
        frequency: "2_OF_4_PAPERS",
        solution:
          "1. Distance Vector Routing (DVR) is a dynamic routing algorithm.\\n2. Routers share their entire routing table with immediate neighbors at regular intervals.\\n3. It uses the Bellman-Ford algorithm to calculate the shortest path.\\n4. 'Distance' refers to the cost (e.g., hop count), and 'Vector' is the direction (next-hop router).\\n5. Example: Routing Information Protocol (RIP) uses DVR with hop count as the metric.\\n6. Each router maintains a table showing the best known distance to each destination.\\n7. The Count-to-Infinity problem occurs when a link goes down, and routers continuously update each other with incorrect, increasing metrics.\\n8. This creates routing loops where packets bounce back and forth.\\n9. Solutions to Count-to-Infinity include Split Horizon.\\n10. Another solution is Route Poisoning, where the failed route is advertised with an infinite metric (e.g., 16 hops in RIP).",
      },
    ],
  },
  extras: {
    questions: [
      {
        question: "Differentiate between CSMA/CD and CSMA/CA.",
        marks: 5,
        frequency: "1_OF_4_PAPERS",
        solution:
          "1. CSMA/CD stands for Carrier Sense Multiple Access with Collision Detection.\\n2. CSMA/CA stands for Carrier Sense Multiple Access with Collision Avoidance.\\n3. CSMA/CD is used in wired networks like Ethernet (IEEE 802.3).\\n4. CSMA/CA is used in wireless networks like Wi-Fi (IEEE 802.11).\\n5. In CSMA/CD, devices transmit data and listen for collisions; if detected, they stop and retransmit later.\\n6. In CSMA/CA, devices use techniques like inter-frame space (IFS) and back-off timers to avoid collisions before they happen.\\n7. CSMA/CD can effectively detect collisions because simultaneous transmission and reception are possible on wired media.\\n8. CSMA/CA cannot easily detect collisions due to the hidden terminal problem and signal attenuation in wireless media.\\n9. CSMA/CA often uses RTS/CTS (Request to Send / Clear to Send) control frames to reserve the channel.\\n10. CSMA/CD focuses on recovery after a collision, while CSMA/CA focuses on preventing them proactively.",
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
