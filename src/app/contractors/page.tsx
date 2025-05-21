import { Suspense } from "react";
import { fetchGitHubIssues } from "@/lib/github";
import { IssueCard } from "@/components/cards/IssueCard";
import { IssueCardSkeleton } from "@/components/cards/IssueCardSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Contractor Hub | Andromeda Protocol",
  description:
    "Browse open contractor bidding opportunities and access building tools with Andromeda Protocol",
};

// Skeleton grid for loading state
function IssueCardsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, index) => (
          <IssueCardSkeleton key={index} />
        ))}
    </div>
  );
}

export default async function ContractorsPage() {
  // Fetch issues from GitHub
  const issues = await fetchGitHubIssues(
    "andromedaprotocol",
    "Contractor_bidding",
    "open",
  );

  return (
    <main className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen bg-black text-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          🚀 Contractor Command Center 🚀
        </h1>
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 mb-12 max-w-3xl mx-auto">
          <p className="text-white mb-4">
            Congratulations! We&apos;ve determined that you have a contractor-grade set of skills, and can start building immediately!
          </p>
          <p className="text-gray-400">
            This page will provide several options, Including diving into our toolset or tackling a contract for bid (when they are posted).
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Build with aOS</h2>
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 mb-8 max-w-4xl mx-auto">
          <p className="text-gray-300 mb-4">
            Andromeda&apos;s vision is that aOS makes Web3 development accessible to everyone. Whether you&apos;re a seasoned dev or just getting started, you can use pre-built, customizable modules to launch real on-chain apps, fast! It&apos;s intuitive, permissionless, and chain-agnostic.
          </p>
          <p className="text-gray-300 mb-4">
            No smart contract experience needed. Just an idea, a browser, and aOS.
          </p>
          <p className="text-white font-medium">
            Check out different ways to get started on aOS today:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6">
            <h3 className="text-xl font-bold text-white mb-4">🎥 Watch the Intro Videos</h3>
            <p className="text-gray-400 mb-4">
              New to modular Web3 development? See what makes the Andromeda Operating System (aOS) the easiest way to launch smart, scalable dApps, without writing your own smart contracts.
            </p>
            <div className="mt-4 space-y-3">
              <h4 className="text-lg font-medium text-white">Some refreshers on aOS:</h4>
              <div className="space-y-2">
                <a href="https://youtu.be/RhQfZnurGXo" target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline">
                  • aOS Introduction Video
                </a>
                <a href="https://youtu.be/2ktG307EqEA" target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline">
                  • aOS Core Concepts
                </a>
                <a href="https://youtu.be/uvvqX91VFS4" target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline">
                  • Getting Started with aOS
                </a>
              </div>

              <h4 className="text-lg font-medium text-white mt-6">Tutorials to try:</h4>
              <div className="space-y-2">
                <a href="https://youtu.be/QxMC-cygMaI" target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline">
                  • Building Your First App with aOS
                </a>
                <a href="https://youtu.be/jV9XrStVBog" target="_blank" rel="noopener noreferrer" className="block text-blue-400 hover:underline">
                  • Advanced aOS Features
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6">
              <h3 className="text-xl font-bold text-white mb-4">🛠 Log On and Start Building</h3>
              <p className="text-gray-400 mb-4">
                aOS lets you build full-stack Web3 applications fast—using plug-and-play ADOs (Andromeda Digital Objects) for tokens, staking, marketplaces, and more.
              </p>
              <p className="text-gray-400 mb-4">
                No setup, no code barriers—just log on and launch.
              </p>
              <a
                href="https://app.andromedaprotocol.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Launch aOS Builder
              </a>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6">
              <h3 className="text-xl font-bold text-white mb-4">📚 Explore the Docs</h3>
              <p className="text-gray-400 mb-4">
                Want to know how aOS actually works? Our docs walk you through every ADO, with step-by-step guides for building everything from NFT marketplaces to crowdfunds and DAOs.
              </p>
              <p className="text-gray-400 mb-4">
                Dive in and start experimenting!
              </p>
              <a
                href="https://docs.andromedaprotocol.io/guides/guides-and-examples/ado-builder/building-your-first-app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Read the Docs
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">💼 Contractor Bidding 💼</h2>
        <p className="text-gray-400 max-w-3xl mx-auto mb-8">
          Browse these open contractor bidding opportunities with Andromeda Protocol, and apply to any of them. These are tasks designed for skilled contributors to take on contract work.
        </p>
      </div>

      <ErrorBoundary>
        <Suspense fallback={<IssueCardsLoading />}>
          {issues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard key={issue.id} issue={issue} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#1a1a1a] rounded-lg border border-[#333333] max-w-3xl mx-auto">
              <h3 className="text-xl font-medium text-white mb-2 text-center">
                No Open Contracts Available
              </h3>
              <p className="text-gray-400 text-center max-w-md">
                There are currently no open contracts available for bidding.
                Please check back later or explore other opportunities in the
                Andromeda ecosystem.
              </p>
            </div>
          )}
        </Suspense>
      </ErrorBoundary>

      <div className="mt-10 pt-6 border-t border-[#333333] text-sm text-gray-500 text-center max-w-3xl mx-auto">
        <p>
          Data sourced directly from the{" "}
          <a
            href="https://github.com/andromedaprotocol/Contractor_bidding"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            andromedaprotocol/Contractor_bidding
          </a>{" "}
          GitHub repository.
        </p>
      </div>
    </main>
  );
}
