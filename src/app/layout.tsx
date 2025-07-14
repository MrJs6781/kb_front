import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { WatchlistProvider } from "@/context/WatchlistContext";

const vazirmatn = Vazirmatn({
  subsets: ["latin", "arabic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Koala Blockchain",
  description: "Live cryptocurrency prices and trades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} antialiased`}>
        <WatchlistProvider>
          <main className="min-h-screen">{children}</main>
        </WatchlistProvider>
      </body>
    </html>
  );
}
