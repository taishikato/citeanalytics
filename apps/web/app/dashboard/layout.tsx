import { SidebarWrapper } from "@/components/sidebar-wrapper";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SiteHeaderWrapper } from "@/components/site-header-wrapper";
import { type Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: user } = await supabase
    .from("users")
    .select("id, name, email")
    .single();

  if (!user) {
    redirect("/login");
  }

  const userProp = {
    ...user,
    avatar_url: "",
  };

  return (
    <SidebarProvider>
      <SidebarWrapper user={userProp} />
      <SidebarInset>
        <SiteHeaderWrapper />
        <main className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-4 lg:px-6">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
