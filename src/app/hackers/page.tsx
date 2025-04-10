import { Suspense } from "react";
import { fetchGitHubIssues } from "@/lib/github";
import { IssueCard } from "@/components/cards/IssueCard";
import { IssueCardSkeleton } from "@/components/cards/IssueCardSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
    title: 'HackerBoard Bounties | Andromeda Protocol',
    description: 'Browse open bounties and hacking challenges with Andromeda Protocol',
};

// Skeleton grid for loading state
function IssueCardsLoading() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
                <IssueCardSkeleton key={index} />
            ))}
        </div>
    );
}

export default async function HackersPage() {
    // Fetch issues from GitHub
    const issues = await fetchGitHubIssues('andromedaprotocol', 'hackerboard_tasks', 'open');

    return (
        <main className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen bg-black text-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">HackerBoard Bounties</h1>
                <p className="text-gray-400">
                    Browse open bounties and hacking challenges with Andromeda Protocol.
                    These are tasks that reward successful completion with bounties.
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
                        <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#1a1a1a] rounded-lg border border-[#333333]">
                            <h3 className="text-xl font-medium text-white mb-2">No Open Bounties Available</h3>
                            <p className="text-gray-400 text-center max-w-md">
                                There are currently no open bounties available. Please check back later or
                                explore other opportunities in the Andromeda ecosystem.
                            </p>
                        </div>
                    )}
                </Suspense>
            </ErrorBoundary>

            <div className="mt-10 pt-6 border-t border-[#333333] text-sm text-gray-500">
                <p>
                    Data sourced directly from the{' '}
                    <a
                        href="https://github.com/andromedaprotocol/hackerboard_tasks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        andromedaprotocol/hackerboard_tasks
                    </a>{' '}
                    GitHub repository.
                </p>
            </div>
        </main>
    );
} 