import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talent Hub - Talent Acquisition Platform",
  description: "Platform for Talent Acquisition to manage candidates and applications",
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
