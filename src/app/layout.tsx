"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { Menu } from "lucide-react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {/* Sidebar toggle button - visible only on mobile */}
          <button
            className="sidebar-toggle fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1a1a1a] border border-[#333333] text-white hover:bg-[#333333] transition-colors lg:hidden"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Sidebar isOpen={isOpen} onClose={toggleSidebar} />

          <main className={`
            transition-all duration-300 ease-in-out 
            ${isMobile ? '' : 'lg:pl-64'} 
            ${isOpen && isMobile ? 'max-lg:pl-0 max-lg:pr-0' : ''} 
            ${isOpen && isMobile ? 'max-lg:opacity-50' : ''}
          `}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
