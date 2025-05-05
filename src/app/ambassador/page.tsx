import { Award } from "lucide-react";

export const metadata = {
  title: "Ambassador Path | Andromeda Protocol",
  description:
    "Become an Andromeda Ambassador and help grow the community. Find resources, links, and media here.",
};

export default function AmbassadorPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-white flex items-center justify-center gap-2">
            <Award className="w-8 h-8 text-[#FFB300]" /> Ambassador Path
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Become an Andromeda Ambassador! Help grow the community, spread the
            word, and earn rewards. Explore the resources below to get started.
          </p>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 mb-8 text-center">
          <a
            href="https://zealy.io/cw/andromedacommunity/questboard/ff856265-3649-4b5f-a41f-c19eadfaf2e0/36c50401-4e44-452a-9539-94b9f2451f3d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-[#FFB300] text-black font-semibold rounded-md hover:bg-[#e6a700] transition-colors text-lg mb-4"
          >
            Ambassador Questboard
          </a>
          <div className="mt-6">
            <p className="text-gray-400">More resources coming soon!</p>
            {/* TODO: Add images and videos here */}
          </div>
        </div>
      </div>
    </main>
  );
}
