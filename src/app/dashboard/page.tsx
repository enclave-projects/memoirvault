import { auth } from "@clerk/nextjs/server";
// Dashboard page - server component that redirects to client component
import { redirect } from "next/navigation";
import DashboardClient from "@/components/DashboardClient";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return <DashboardClient />;
}