import { Suspense } from "react";
import { fetchGitHubIssues } from "@/lib/github";
import { IssueCard } from "@/components/cards/IssueCard";
import { IssueCardSkeleton } from "@/components/cards/IssueCardSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Contractor Bids | Andromeda Protocol",
  description:
    "Browse open contractor bidding opportunities with Andromeda Protocol",
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
          💼 Contractor Bidding 💼
        </h1>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Browse these open contractor bidding opportunities with Andromeda Protocol, and apply to any of them. These are tasks designed for skilled contributors to take on contract work.,

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
