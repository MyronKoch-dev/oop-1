import { Suspense } from "react";
import { fetchGitHubIssues } from "@/lib/github";
import { IssueCard } from "@/components/cards/IssueCard";
import { IssueCardSkeleton } from "@/components/cards/IssueCardSkeleton";
import { Metadata } from "next";
import { GitHubIssue } from "@/lib/github";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Wrench, // For AI Tooling & Frameworks
  Brain, // For AI & Web3 Concepts
  ShieldCheck, // For Ethical AI
  MessageSquare, // For General AI Chat
  Cpu, // For LLM & Agent Development
  Sparkles // For Project Showcases
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Navigator Path | Andromeda Protocol",
  description:
    "Explore, discuss, and contribute to AI initiatives within the Andromeda Protocol ecosystem.",
};

// Force dynamic rendering and revalidate every 10 minutes
export const dynamic = "force-dynamic";
export const revalidate = 600;

// Skeleton grid for loading state
function IssueCardsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(3) // Show 3 skeletons for issues section
        .fill(0)
        .map((_, index) => (
          <IssueCardSkeleton key={`issue-skeleton-${index}`} />
        ))}
    </div>
  );
}

export default async function AINavigatorsPage() {
  let issues: GitHubIssue[] = [];
  let fetchError = null;
  const baseDiscussionUrl = "https://github.com/andromedaprotocol/ai_initiatives/discussions/new?category=";

  const discussionCategories = [
    {
      slug: "ai-ideas",
      title: "AI Ideas & Innovations",
      description: "Propose and discuss novel AI concepts for Andromeda and Web3.",
      icon: Lightbulb,
      buttonText: "Share AI Idea",
      colorScheme: "amber"
    },
    {
      slug: "llm-agent-development",
      title: "LLM & Agent Development",
      description: "Discuss building and integrating LLMs or AI agents within the ecosystem.",
      icon: Cpu,
      buttonText: "Discuss Development",
      colorScheme: "sky"
    },
    {
      slug: "ai-tooling-frameworks",
      title: "AI Tooling & Frameworks",
      description: "Share and explore tools, libraries, and frameworks for AI development.",
      icon: Wrench,
      buttonText: "Explore Tools",
      colorScheme: "indigo"
    },
    {
      slug: "ai-web3-concepts",
      title: "AI & Web3 Concepts",
      description: "Delve into the intersection of AI and Web3, exploring new possibilities.",
      icon: Brain,
      buttonText: "Explore Concepts",
      colorScheme: "teal"
    },
    {
      slug: "project-showcases-ai",
      title: "AI Project Showcases",
      description: "Share your AI-powered projects built with or for Andromeda.",
      icon: Sparkles,
      buttonText: "Showcase Project",
      colorScheme: "rose"
    },
    {
      slug: "ethical-ai-in-blockchain",
      title: "Ethical AI in Blockchain",
      description: "Discuss responsible AI development and ethical considerations in Web3.",
      icon: ShieldCheck,
      buttonText: "Discuss Ethics",
      colorScheme: "lime"
    },
    {
      slug: "general-ai-chat",
      title: "General AI Chat",
      description: "Open forum for any other AI-related topics, questions, or discussions.",
      icon: MessageSquare,
      buttonText: "Start Chatting",
      colorScheme: "gray"
    },
  ];

  try {
    issues = await fetchGitHubIssues(
      "andromedaprotocol",
      "ai_initiatives",
      "open",
    );
  } catch (error) {
    console.error("Failed to fetch AI Navigator issues:", error);
    fetchError =
      error instanceof Error
        ? error.message
        : "Unknown error loading AI Navigator tasks.";
  }

  const getColorClasses = (scheme: string) => {
    switch (scheme) {
      case "amber": return { text: "text-amber-400", bg: "bg-amber-500 hover:bg-amber-600", border: "border-amber-500" };
      case "sky": return { text: "text-sky-400", bg: "bg-sky-500 hover:bg-sky-600", border: "border-sky-500" };
      case "indigo": return { text: "text-indigo-400", bg: "bg-indigo-500 hover:bg-indigo-600", border: "border-indigo-500" };
      case "teal": return { text: "text-teal-400", bg: "bg-teal-500 hover:bg-teal-600", border: "border-teal-500" };
      case "rose": return { text: "text-rose-400", bg: "bg-rose-500 hover:bg-rose-600", border: "border-rose-500" };
      case "lime": return { text: "text-lime-400", bg: "bg-lime-500 hover:bg-lime-600", border: "border-lime-500" };
      default: return { text: "text-gray-400", bg: "bg-gray-500 hover:bg-gray-600", border: "border-gray-500" };
    }
  };


  return (
    <main className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen bg-black text-white">
      <div className="mb-12 text-center"> {/* Increased bottom margin */}
        <h1 className="text-4xl font-bold text-white mb-3">AI Navigator Path</h1> {/* Slightly larger title */}
        <p className="text-lg text-gray-400 max-w-3xl mx-auto"> {/* Slightly larger paragraph */}
          Discover, discuss, and contribute to AI-focused projects, ideas, and bounties within the
          Andromeda Protocol ecosystem.
        </p>
      </div>

      {/* New Discussions Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold text-white mb-2 text-center">Join AI Discussions</h2>
        <p className="text-gray-400 text-center mb-8 max-w-2xl mx-auto">
          Engage with the community, share your insights, and explore the future of AI in Web3.
          Select a category to start or join a discussion on GitHub.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {discussionCategories.map((category) => {
            const IconComponent = category.icon;
            const colors = getColorClasses(category.colorScheme);
            return (
              <div key={category.slug} className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 flex flex-col hover:shadow-lg hover:border-gray-500 transition-all duration-300">
                <div className={`mb-4 ${colors.text}`}>
                  <IconComponent className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{category.title}</h3>
                <p className="text-gray-400 mb-6 flex-grow text-sm">{category.description}</p>
                <Button asChild className={`w-full ${colors.bg} text-white`}>
                  <a
                    href={`${baseDiscussionUrl}${category.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.buttonText}</span>
                  </a>
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Existing Issues Section */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold text-white mb-2">AI Initiatives & Bounties</h2>
        <p className="text-gray-400 max-w-3xl mx-auto">
          Find your path as an AI Navigator by contributing to these open tasks and projects.
        </p>
      </div>

      {fetchError && (
        <div className="p-4 bg-red-900/30 border border-red-700 rounded-md text-red-400 mb-6 max-w-3xl mx-auto">
          <p className="text-center">Error loading initiatives: {fetchError}</p>
          <p className="text-sm mt-2 text-center">
            Please try again later or check the repository directly.
          </p>
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
                <h3 className="text-xl font-medium text-white mb-2">
                  No Open AI Navigator Tasks Available
                </h3>
                <p className="text-gray-400 text-center max-w-md">
                  There are currently no open AI Navigator tasks available. Please
                  check back later or explore other opportunities in the
                  Andromeda ecosystem.
                </p>
              </div>
            )
          )}
        </Suspense>
      </ErrorBoundary>

      <div className="mt-10 pt-6 border-t border-[#333333] text-sm text-gray-500 text-center max-w-3xl mx-auto">
        <p>
          Issue data sourced directly from the{" "}
          <a
            href="https://github.com/andromedaprotocol/ai_initiatives"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            andromedaprotocol/ai_initiatives
          </a>{" "}
          GitHub repository.
        </p>
      </div>
    </main>
  );
}
