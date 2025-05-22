"use client";

import { useState, useEffect } from "react";
import { Poppins, Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import "./globals.css";
import { SidebarContext } from "@/context/SidebarContext";

// Load Poppins with multiple weights for better typography
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

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
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Toggle function for left sidebar
  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen((prev) => !prev);
  };

  // Provide empty implementation for openRightSidebar to maintain API compatibility
  const openRightSidebar = () => {
    // Empty implementation - sidebar is removed
    console.log("Right sidebar has been removed per design changes");
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-black font-poppins`}
      >
        <SidebarContext.Provider
          value={{ openRightSidebar, isRightSidebarOpen: false }}
        >
          <ThemeProvider>
            {/* Left Sidebar toggle button - visible only on mobile */}
            <button
              className="sidebar-toggle fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1a1a1a] border border-[#333333] text-white hover:bg-[#333333] transition-colors lg:hidden"
              onClick={toggleLeftSidebar}
              aria-label="Toggle left sidebar"
            >
              <span className="w-5 h-5 text-2xl flex items-center justify-center">
                🚀
              </span>
            </button>

            <Sidebar isOpen={isLeftSidebarOpen} onClose={toggleLeftSidebar} />

            <main
              className={`flex justify-center transition-all duration-300 ease-in-out lg:pl-64 ${"lg:pr-0"} ${(isLeftSidebarOpen) && isMobile ? "opacity-50 blur-sm pointer-events-none" : ""}`}
            >
              {children}
            </main>
          </ThemeProvider>
        </SidebarContext.Provider>
      </body>
    </html>
  );
}
