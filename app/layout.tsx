import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Walk-Away Guardian — Stop Revenge Trading",
  description: "The Chrome extension that locks your trading screen after losses, protects profits, and provides AI coaching. Works on TradingView, ThinkorSwim, Tradovate, and Webull.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
