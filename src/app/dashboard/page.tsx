import { auth } from "@clerk/nextjs/server";
import { UserButton, SignedIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <DashboardClient />;
}