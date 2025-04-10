import { Suspense } from "react";
import { fetchGitHubIssues } from '@/lib/github';
import { IssueCard } from '@/components/cards/IssueCard';
import { IssueCardSkeleton } from '@/components/cards/IssueCardSkeleton';
import { Metadata } from 'next';
import { GitHubIssue } from "@/lib/github";
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
    title: "AI Initiatives | Andromeda Protocol",
    description: "Explore and contribute to AI initiatives within the Andromeda Protocol ecosystem.",
};

// Force dynamic rendering and revalidate every 10 minutes
export const dynamic = 'force-dynamic';
export const revalidate = 600;

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

export default async function AINavigatorsPage() {
    let issues: GitHubIssue[] = [];
    let fetchError = null;

    try {
        // Fetch OPEN issues for the AI initiatives repository
        issues = await fetchGitHubIssues('andromedaprotocol', 'ai_initiatives', 'open');
    } catch (error) {
        console.error("Failed to fetch AI initiatives issues:", error);
        fetchError = error instanceof Error ? error.message : "Unknown error loading initiatives.";
    }

    return (
        <main className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen bg-black text-white">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">AI Initiatives</h1>
                <p className="text-gray-400 max-w-3xl mx-auto">
                    Discover and contribute to AI-focused projects and bounties within the Andromeda Protocol ecosystem.
                    Join the AI revolution in the Andromeda ecosystem.
                </p>
            </div>

            {fetchError && (
                <div className="p-4 bg-red-900/30 border border-red-700 rounded-md text-red-400 mb-6 max-w-3xl mx-auto">
                    <p className="text-center">Error loading initiatives: {fetchError}</p>
                    <p className="text-sm mt-2 text-center">Please try again later or check the repository directly.</p>
                </div>
            )}

            <ErrorBoundary>
                <Suspense fallback={<IssueCardsLoading />}>
                    {!fetchError && issues.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {issues.map((issue) => (
                                <IssueCard key={issue.id} issue={issue} />
                            ))}
                        </div>
                    ) : (
                        !fetchError && (
                            <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#1a1a1a] rounded-lg border border-[#333333]">
                                <h3 className="text-xl font-medium text-white mb-2">No Open AI Initiatives Available</h3>
                                <p className="text-gray-400 text-center max-w-md">
                                    There are currently no open AI initiatives available. Please check back later or
                                    explore other opportunities in the Andromeda ecosystem.
                                </p>
                            </div>
                        )
                    )}
                </Suspense>
            </ErrorBoundary>

            <div className="mt-10 pt-6 border-t border-[#333333] text-sm text-gray-500 text-center max-w-3xl mx-auto">
                <p>
                    Data sourced directly from the{' '}
                    <a
                        href="https://github.com/andromedaprotocol/ai_initiatives"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline"
                    >
                        andromedaprotocol/ai_initiatives
                    </a>{' '}
                    GitHub repository.
                </p>
            </div>
        </main>
    );
} 