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
                <div className="bg-background min-h-screen flex flex-col">
                  <a 
                    href="#main-content" 
                    className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-background focus:text-foreground top-0 left-0"
                  >
                    Skip to main content
                  </a>
                  <main id="main-content" className="flex-1 flex flex-col min-w-0">
                    {children}
                  </main>
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
