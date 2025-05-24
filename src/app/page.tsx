// src/app/page.tsx (Corrected to render ChatContainer)
"use client"; // REQUIRED: Mark this as a Client Component for state and effects

import React, { useState, useEffect, useMemo } from "react"; // Import React hooks
import { useRouter } from "next/navigation";

// Import your main ChatContainer component using the correct path alias
import { ChatContainer } from "@/components/chat/chat-container";
// NOTE: Ensure ChatContainer is EXPORTED from its file, e.g.:
// export function ChatContainer() { ... } OR export default function ChatContainer() { ... }

// The main functional component for the home page
export default function HomePage() {
  const router = useRouter();
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
    // Main container optimized for mobile-first design like ChatGPT
    <main className="flex min-h-screen flex-col items-start justify-start p-2 md:p-4 lg:p-6 bg-[#1a1a1a] transition-all pt-16 pb-2">
      {/* Chat container with mobile-optimized dimensions */}
      <div
        id="chat-main-container"
        className="mx-auto h-[85vh] md:h-[88vh] lg:h-[90vh] rounded-lg bg-[#1a1a1a] dark:bg-[#1a1a1a] overflow-hidden mt-2"
        style={{
          width: "96vw",
          maxWidth: "96vw",
          minWidth: "320px",
          margin: "0.5rem auto 0 auto",
        }}
        data-chat-container="main"
      >
        {/* Render the ChatContainer component with full height and dark theme */}
        <ChatContainer
          className="h-full w-full"
          key={stableInstanceId} // Use the stable instance ID as key
        />
      </div>
    </main>
  );
}
