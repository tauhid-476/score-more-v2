import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@score-more-finale/auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  examPaperUploader: f({
    pdf: { maxFileSize: "4MB", maxFileCount: 4 },
  })
    .middleware(async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user) throw new Error("Unauthorized");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.url, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
