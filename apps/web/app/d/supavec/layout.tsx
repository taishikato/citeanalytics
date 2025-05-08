import { Navbar } from "@/components/sections/navbar";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard of Supavec",
  description: "Dashboard of Supavec",
};

export default function SupavecLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main className="mt-12">{children}</main>
    </div>
  );
}
