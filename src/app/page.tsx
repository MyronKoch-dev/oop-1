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
    // Main container for the page, centers content and takes full height
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6 lg:p-8 bg-gray-100 dark:bg-gray-950">
      {/* Outer container takes more vertical space with height constraints removed */}
      <div className="w-full max-w-3xl h-[85vh] border rounded-xl shadow-2xl bg-white dark:bg-gray-900 overflow-hidden">
        {/* Render the ChatContainer component with full height */}
        <ChatContainer
          className="h-full" // Make chat container take full height of parent
        />
      </div>
      {/* You could add a small footer outside the chat container if needed */}
      {/* <footer className="mt-8 text-center text-xs text-gray-500">
          Powered by Andromeda
      </footer> */}
    </main>
  );
}