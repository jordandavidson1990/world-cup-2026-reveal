import "./globals.css";
import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";

const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "World Cup 2026 Sweep Reveal",
  description: "Presentation app for sweepstake reveal",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bebas.variable} ${inter.variable}`}>
        <main
          style={{ maxWidth: "900px", margin: "0 auto", padding: "60px 20px" }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
