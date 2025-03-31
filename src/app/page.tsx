// src/app/page.tsx (Corrected to render ChatContainer)
'use client'; // REQUIRED: Mark this as a Client Component for state and effects

import React from 'react'; // Import React (good practice, though sometimes optional in newer Next.js)

// Import your main ChatContainer component using the correct path alias
import { ChatContainer } from '@/components/chat/chat-container';
// NOTE: Ensure ChatContainer is EXPORTED from its file, e.g.:
// export function ChatContainer() { ... } OR export default function ChatContainer() { ... }

// The main functional component for the home page
export default function HomePage() {
  return (
    // Main container with dark theme colors matching Andromeda app
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6 lg:p-8 bg-[#0f0f0f] dark:bg-[#111111]">
      {/* Outer container with dark theme and blue accents */}
      <div className="w-full max-w-3xl h-[85vh] border border-[#333333] rounded-xl shadow-2xl bg-[#1a1a1a] dark:bg-[#1a1a1a] overflow-hidden">
        {/* Render the ChatContainer component with full height and dark theme */}
        <ChatContainer
          className="h-full"
          title="Onboarding Assistant"
          subtitle="Answer a few questions to get started"
        />
      </div>
      {/* You could add a small footer outside the chat container if needed */}
      {/* <footer className="mt-8 text-center text-xs text-gray-500">
          Powered by Andromeda
      </footer> */}
    </main>
  );
}