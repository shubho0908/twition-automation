import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Twition - Documentation",
  description: "Simple one-endpoint API for automating Twitter posts from Notion tasks using AI",
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}