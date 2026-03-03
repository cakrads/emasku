import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import ReactQueryProvider from "@/frontend/providers/react-query-provider";
import { ThemeProvider } from "@/frontend/providers/theme-provider";
import { AuthProvider } from "@/frontend/providers/auth-provider";
import { Toaster } from "@/frontend/components/ui/sonner";
import { LanguageProvider } from "@/frontend/context/language-context";

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
      <body className={inter.className}>
        <NextTopLoader color="#D4AF37" showSpinner={false} />
        <ReactQueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <LanguageProvider>
                <div className="bg-background min-h-screen">
                  {children}
                </div>
                <Toaster position="top-right" />
              </LanguageProvider>
            </AuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
