import { BookOpen } from "lucide-react";
import { DiveInSection } from "@/components/ui/DiveInSection";

export const metadata = {
  title: "Explorer Path | Andromeda Protocol",
  description:
    "Explore Andromeda resources, tutorials, and learning materials. Find links, images, and videos here.",
};

export default function ExplorerPage() {
  return (
    <main className="min-h-screen bg-[#1a1a1a] text-white">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white flex items-center justify-center gap-2">
            🗺️ <BookOpen className="w-8 h-8 text-[#3498db]" /> Explorer 🗺️
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Hey, there, web3 and crypto explorers! Dive into the Andromeda
            ecosystem! Discover tutorials, guides, and learning resources to
            help you get started and grow your knowledge.
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 mb-8 text-center">
          <a
            href="https://andromedaprotocol.io/learn"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#3498db] text-white font-semibold rounded-md hover:bg-[#2980b9] transition-colors text-lg mb-4"
          >
            Andromeda Learn Portal
          </a>
          <div className="mt-6">
            <p className="text-gray-400">More resources coming soon!</p>
            {/* TODO: Add images and videos here */}
          </div>
        </div>
        <DiveInSection />
      </div>
    </main>
  );
}
