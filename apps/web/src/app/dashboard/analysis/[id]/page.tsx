import { auth } from "@score-more-finale/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AnalysisClient from "./analysis-client";

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { id } = await params;
  return <AnalysisClient id={id} />;
}
