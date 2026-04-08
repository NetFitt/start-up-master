import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import NextTopLoader from 'nextjs-toploader';
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const crimson = Crimson_Pro({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-crimson" });

export const metadata: Metadata = {
  title: "YOUHUNT Algeria",
  description: "Authentic Algerian Expeditions",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${crimson.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#050805]">
        {/* No Header/Footer here! */}
        
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader 
            color="#22c55e" 
            initialPosition={0.08} 
            crawlSpeed={200} 
            height={3} 
            showSpinner={false} 
            easing="ease" 
            speed={200} 
            shadow="0 0 10px #22c55e,0 0 5px #22c55e"
          />
          {children}
          {/* 🚀 Step 2: Add the Toaster here */}
          {/* position="top-right" is standard for dashboards */}
          {/* richColors makes Success green and Error red */}
          <Toaster position="top-right" richColors theme="dark" closeButton />
        </ThemeProvider>
        
      </body>
    </html>
  );
}