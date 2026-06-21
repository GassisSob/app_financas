import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Transaction } from "@/lib/types";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <DashboardClient
      email={user.email ?? ""}
      transactions={(transactions ?? []) as Transaction[]}
    />
  );
}
