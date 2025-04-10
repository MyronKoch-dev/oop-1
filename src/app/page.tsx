// src/app/page.tsx (Corrected to render ChatContainer)
'use client'; // REQUIRED: Mark this as a Client Component for state and effects

import React, { useState, useEffect } from 'react'; // Import React hooks

// Import your main ChatContainer component using the correct path alias
import { ChatContainer } from '@/components/chat/chat-container';
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
    window.addEventListener('resize', checkWidth);

    // Clean up
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // On desktop, sidebar is always visible; on mobile it's not
  return isDesktop;
}

// The main functional component for the home page
export default function HomePage() {
  const isSidebarVisible = useIsSidebarVisible();

  return (
    // Main container with dark theme colors matching Andromeda app - anchored to top on mobile
    <main className="flex min-h-screen flex-col items-start justify-start p-4 md:p-6 lg:p-8 bg-black transition-all pt-6">
      {/* Andromeda logo and title above the chat - only show when sidebar is collapsed */}
      {!isSidebarVisible && (
        <div className="w-full max-w-3xl mx-auto mb-4 flex flex-col items-center">
          <img
            src="https://avatars.githubusercontent.com/u/86694044?s=200&v=4"
            width="70"
            height="70"
            alt="Andromeda Logo"
            className="rounded-full mb-2"
          />
          <h1 className="text-xl font-bold text-white mb-1">Andromeda Protocol</h1>
          <p className="text-gray-400 text-sm">Building the future of decentralized applications</p>
        </div>
      )}

      {/* Outer container with dark theme and blue accents - adjusted height for mobile */}
      <div className="w-full max-w-3xl mx-auto h-[75vh] md:h-[80vh] lg:h-[85vh] border border-[#333333] rounded-xl shadow-2xl bg-[#1a1a1a] dark:bg-[#1a1a1a] overflow-hidden">
        {/* Render the ChatContainer component with full height and dark theme */}
        <ChatContainer
          className="h-full"
          title="Onboarding Assistant"
          subtitle="Begin Your Journey With Andromeda Here."
        />
      </div>
      {/* You could add a small footer outside the chat container if needed */}
      {/* <footer className="mt-8 text-center text-xs text-gray-500">
          Powered by Andromeda
      </footer> */}
    </main>
  );
}