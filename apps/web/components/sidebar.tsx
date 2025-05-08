"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@workspace/ui/components/sidebar";
import {
  SquareTerminal,
  SquareKanban,
  Settings,
  ChevronsUpDown,
  Quote,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { signOut } from "@/app/login/actions";
import { LogoutButton } from "./logout-button";
import { siteConfig } from "@/lib/config";
import { usePostHog } from "posthog-js/react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: SquareKanban,
  },
  {
    name: "Logs",
    href: "/dashboard/log",
    icon: SquareTerminal,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar({
  user,
}: {
  user: {
    avatar_url: string;
    id: string;
    name: string | null;
    email: string | null;
  };
}) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();
  const posthog = usePostHog();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 pt-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border">
            <Quote className="size-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">{siteConfig.name}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 transition-colors",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      <span className="h-6 w-6">
                        <item.icon />
                      </span>
                      {item.name}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto p-2 space-y-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar_url} alt={user.name ?? ""} />
                    <AvatarFallback className="rounded-lg">
                      {user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user?.avatar_url}
                        alt={user?.name ?? ""}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs">{user.email}</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <form
                    action={async () => {
                      await signOut();
                      posthog.reset();
                    }}
                  >
                    <LogoutButton />
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
