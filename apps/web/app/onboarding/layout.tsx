import { type Metadata } from "next";

export const metadata: Metadata = {
  robots: "noindex, nofollow",
};

export default async function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="container mx-auto max-w-3xl py-8">{children}</div>;
}
