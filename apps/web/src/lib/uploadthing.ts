// utils/uploadthing.ts (or wherever your upload helpers are)
import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Add this line to generate the hook
export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
