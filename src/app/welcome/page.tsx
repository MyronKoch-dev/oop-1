"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WelcomePage() {
  const router = useRouter();

  // Set page metadata dynamically
  useEffect(() => {
    document.title = "Welcome | Andromeda Protocol";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Welcome to Andromeda Protocol - Discover your perfect role in the Web3 ecosystem",
      );
    }
  }, []);

  const handleStartNow = () => {
    // Navigate to the questionnaire
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex items-center justify-center w-full">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Andromeda Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <img
              src="https://avatars.githubusercontent.com/u/86694044?s=200&v=4"
              alt="Andromeda Logo"
              className="w-full h-full rounded-full object-cover"
              style={{
                mixBlendMode: "screen",
                filter: "contrast(1.2) brightness(1.1)",
              }}
            />
          </div>
        </div>

        {/* Welcome Message */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Hey! Can we start?
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-12 leading-relaxed">
          We&apos;d love to hear about your crypto experiences and help you
          figure out the best role for your web3 career.
        </p>

        {/* Start Now Button */}
        <button
          onClick={handleStartNow}
          className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start now
        </button>
      </div>
    </div>
  );
}
