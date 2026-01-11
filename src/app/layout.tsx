import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/frontend/providers/react-query-provider";
import { ThemeProvider } from "@/frontend/providers/theme-provider";
import { AuthProvider } from "@/frontend/providers/auth-provider";
import { Navbar } from "@/frontend/components/fragments/navbar";
import { Toaster } from "@/frontend/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emasku - Gold Portfolio Tracker",
  description: "Track your physical gold holdings with high precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background min-h-screen pb-16 md:pb-0 md:pt-16`}>
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <Navbar />
              {children}
              <Toaster position="top-right" />
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}

