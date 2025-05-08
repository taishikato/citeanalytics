"use client";

import { AppSidebar } from "./sidebar";

export function SidebarWrapper({
  user,
}: {
  user: {
    avatar_url: string;
    id: string;
    name: string | null;
    email: string | null;
  };
}) {
  return <AppSidebar user={user} />;
}
