import type { Metadata } from "next";
import "./globals.css";
import { TopBar } from "@/components/TopBar";
import { QuoteProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Quote · Production Batches Prototype",
  description: "Clickable prototype for quote-level production batches",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <QuoteProvider>
          <TopBar />
          {children}
        </QuoteProvider>
      </body>
    </html>
  );
}
