"use client";

import { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { Menu, PanelRight } from "lucide-react";
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
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
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

  // Toggle functions for sidebars
  const toggleLeftSidebar = () => {
    setIsLeftSidebarOpen(prev => !prev);
    // Close right sidebar when opening left sidebar on mobile
    if (isMobile) {
      setIsRightSidebarOpen(false);
    }
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarOpen(prev => !prev);
    // Close left sidebar when opening right sidebar on mobile
    if (isMobile) {
      setIsLeftSidebarOpen(false);
    }
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {/* Left Sidebar toggle button - visible only on mobile */}
          <button
            className="sidebar-toggle fixed top-4 left-4 z-50 p-2 rounded-md bg-[#1a1a1a] border border-[#333333] text-white hover:bg-[#333333] transition-colors lg:hidden"
            onClick={toggleLeftSidebar}
            aria-label="Toggle left sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Right Sidebar toggle button */}
          <button
            className="sidebar-toggle fixed top-4 right-4 z-50 p-2 rounded-md bg-[#1a1a1a] border border-[#333333] text-white hover:bg-[#333333] transition-colors"
            onClick={toggleRightSidebar}
            aria-label="Toggle right sidebar"
          >
            <PanelRight className="w-5 h-5" />
          </button>

          <Sidebar isOpen={isLeftSidebarOpen} onClose={toggleLeftSidebar} />
          <RightSidebar isOpen={isRightSidebarOpen} onClose={toggleRightSidebar} />

          <main className={`
            transition-all duration-300 ease-in-out 
            lg:pl-64 
            ${isRightSidebarOpen ? 'lg:pr-80' : 'lg:pr-0'} 
            ${(isLeftSidebarOpen || isRightSidebarOpen) && isMobile ? 'opacity-50 blur-sm pointer-events-none' : ''}
          `}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
