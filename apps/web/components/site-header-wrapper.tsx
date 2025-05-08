"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "Logs",
    href: "/dashboard/log",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
  },
] as const;

type NavigationItem = (typeof navigation)[number];

export function SiteHeaderWrapper() {
  const pathname = usePathname();
  const currentPage: NavigationItem =
    navigation.find((item) => item.href === pathname) ?? navigation[0];

  return <SiteHeader title={currentPage.name} />;
}
