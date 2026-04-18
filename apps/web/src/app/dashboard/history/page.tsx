import { auth } from "@score-more-finale/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HistoryClient from "./history-client";

export default async function HistoryPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return <HistoryClient />;
}
