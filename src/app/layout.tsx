import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Breakout",
  description: "A calm trading journal for tracking performance, process, and risk.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
