"use client";

import { useState, useEffect, useRef } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/Sidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { Menu, PanelRight, Rocket } from "lucide-react";
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
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rocketBtnRef = useRef<HTMLDivElement>(null);

  // Handle window resize to detect mobile/desktop
  useEffect(() => {
    const checkIfMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);

      // Always keep the right sidebar closed by default (changed from !mobile)
      setIsRightSidebarOpen(false);
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

  // Mouse enter handler for rocket button
  const handleMouseEnter = () => {
    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setIsHovering(true);

    // Set a small delay before opening the sidebar to prevent accidental triggers
    hoverTimerRef.current = setTimeout(() => {
      setIsRightSidebarOpen(true);
    }, 200);
  };

  // Mouse leave handler for rocket button and sidebar
  const handleMouseLeave = () => {
    // Clear any existing timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    setIsHovering(false);

    // Add a delay before closing the sidebar
    hoverTimerRef.current = setTimeout(() => {
      // Only close if we're still not hovering
      if (!isHovering) {
        setIsRightSidebarOpen(false);
      }
    }, 300);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

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

          {/* Right Sidebar toggle button - visible only on mobile */}
          <button
            className="sidebar-toggle fixed top-4 right-4 z-50 p-2 rounded-md bg-[#1a1a1a] border border-[#333333] text-white hover:bg-[#333333] transition-colors lg:hidden"
            onClick={toggleRightSidebar}
            aria-label="Toggle right sidebar"
          >
            <PanelRight className="w-5 h-5" />
          </button>

          {/* Rocket button for desktop hover action */}
          <div
            ref={rocketBtnRef}
            className="fixed top-4 right-4 z-50 p-2 rounded-md bg-[#1a1a1a] border border-[#333333] text-white hover:bg-[#333333] transition-colors hidden lg:flex items-center justify-center cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={toggleRightSidebar}
            aria-label="Show developer launchpad"
          >
            <Rocket className="w-5 h-5 text-amber-500" />
          </div>

          <Sidebar isOpen={isLeftSidebarOpen} onClose={toggleLeftSidebar} />
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <RightSidebar isOpen={isRightSidebarOpen} onClose={toggleRightSidebar} />
          </div>

          <main className={`
            transition-all duration-300 ease-in-out 
            lg:pl-64 ${isRightSidebarOpen ? 'lg:pr-96' : 'lg:pr-0'}
            ${(isLeftSidebarOpen || isRightSidebarOpen) && isMobile ? 'opacity-50 blur-sm pointer-events-none' : ''}
          `}>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
