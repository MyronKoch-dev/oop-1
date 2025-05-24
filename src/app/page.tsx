// src/app/page.tsx (Corrected to render ChatContainer)
"use client"; // REQUIRED: Mark this as a Client Component for state and effects

import React, { useState, useEffect, useMemo } from "react"; // Import React hooks
import { useRouter } from "next/navigation";

// Import your main ChatContainer component using the correct path alias
import { ChatContainer } from "@/components/chat/chat-container";
// NOTE: Ensure ChatContainer is EXPORTED from its file, e.g.:
// export function ChatContainer() { ... } OR export default function ChatContainer() { ... }

// Custom hook to detect if on mobile/sidebar is visible
function useIsSidebarVisible() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Initial check
    const checkWidth = () => {
      const width = window.innerWidth;
      setIsDesktop(width >= 1024); // lg breakpoint in Tailwind
    };

    // Set initial value
    checkWidth();

    // Add event listener for window resize
    window.addEventListener("resize", checkWidth);

    // Clean up
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  // On desktop, sidebar is always visible; on mobile it's not
  return isDesktop;
}

// The main functional component for the home page
export default function HomePage() {
  const router = useRouter();
  const isSidebarVisible = useIsSidebarVisible();
  const [shouldRedirect, setShouldRedirect] = useState<boolean | null>(null);

  // Create a truly stable instance ID that only gets set once
  const stableInstanceId = useMemo(() => {
    return `andromeda-chat-instance-stable`;
  }, []);

  // Check if this is a first-time visitor and redirect to welcome page
  useEffect(() => {
    // Only run this check on the client side
    if (typeof window !== "undefined") {
      const hasVisited = localStorage.getItem("hasVisitedAndromeda");

      if (!hasVisited) {
        // Mark as visited so they don't see welcome page again
        localStorage.setItem("hasVisitedAndromeda", "true");
        setShouldRedirect(true);
        router.push("/welcome");
      } else {
        // User has visited before, don't redirect
        setShouldRedirect(false);
      }
    }
  }, []); // Remove router dependency to prevent re-runs on navigation

  // Show loading state while checking redirect status
  if (shouldRedirect === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Don't render the main content if we're redirecting
  if (shouldRedirect === true) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a1a1a]">
        <div className="text-white">Redirecting to welcome page...</div>
      </div>
    );
  }

  return (
    // Main container with dark theme colors matching Andromeda app - anchored to top on mobile
    <main className="flex min-h-screen flex-col items-start justify-start p-4 md:p-6 lg:p-8 bg-[#1a1a1a] transition-all pt-6">
      {/* Andromeda logo and title above the chat - only show when sidebar is collapsed */}
      {!isSidebarVisible && (
        <div className="w-full max-w-[80%] mx-auto mb-4 flex flex-col items-center text-center">
          <img
            src="https://avatars.githubusercontent.com/u/86694044?s=200&v=4"
            width="70"
            height="70"
            alt="Andromeda Logo"
            className="rounded-full mb-2"
          />
          <h1 className="text-xl font-bold text-white mb-1">
            Andromeda Protocol
          </h1>
          <p className="text-gray-400 text-sm">
            Building the future of decentralized applications
          </p>
        </div>
      )}

      {/* Outer container with dark theme and blue accents - full height for top scrolling */}
      <div
        id="chat-main-container"
        className="mx-auto h-[85vh] md:h-[90vh] lg:h-[95vh] rounded-xl bg-[#1a1a1a] dark:bg-[#1a1a1a] overflow-hidden"
        style={{
          width: "80vw",
          maxWidth: "80vw",
          minWidth: "300px",
          margin: "0 auto",
        }}
        data-chat-container="main"
      >
        {/* Render the ChatContainer component with full height and dark theme */}
        <ChatContainer
          className="h-full w-full"
          key={stableInstanceId} // Use the stable instance ID as key
        />
      </div>
      {/* You could add a small footer outside the chat container if needed */}
      {/* <footer className="mt-8 text-center text-xs text-gray-500">
          Powered by Andromeda
      </footer> */}
    </main>
  );
}
