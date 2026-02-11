import type { Metadata } from "next";
import "./globals.css";
import ThemeRegistry from "@/components/providers/ThemeRegistry";

export const metadata: Metadata = {
  title: "AI Travel Agent — Smart Itinerary Planner",
  description:
    "Turn your preferences into a day-by-day travel itinerary with costs and must-do experiences, powered by a multi-step AI agent workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
