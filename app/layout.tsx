import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const crimson = Crimson_Pro({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-crimson" });

export const metadata: Metadata = {
  title: "YOUHUNT Algeria",
  description: "Authentic Algerian Expeditions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${crimson.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#050805]">
        {/* No Header/Footer here! */}
        {children}
      </body>
    </html>
  );
}