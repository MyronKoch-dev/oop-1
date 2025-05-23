import { Suspense } from "react";
import { fetchGitHubIssues } from "@/lib/github";
import { IssueCard } from "@/components/cards/IssueCard";
import { IssueCardSkeleton } from "@/components/cards/IssueCardSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MissionCard } from "@/components/cards/MissionCard";
import VideoCarousel from "@/components/VideoCarousel";

export const metadata = {
  title: "Contractor Hub | Andromeda Protocol",
  description:
    "Browse open contractor bidding opportunities and access building tools with Andromeda Protocol",
  other: {
    "Content-Security-Policy": "img-src 'self' data: https://img.youtube.com https://i.ytimg.com https://*.youtube.com;"
  }
};

// Video data for the carousel
const generalVideos = [
  {
    id: "1",
    title: "aOS Introduction Video",
    url: "https://youtu.be/RhQfZnurGXo",
    description: "New to modular Web3 development? Learn about the Andromeda Operating System."
  },
  {
    id: "2",
    title: "aOS Core Concepts",
    url: "https://youtu.be/2ktG307EqEA",
    description: "Understanding the fundamental concepts behind aOS architecture."
  },
  {
    id: "3",
    title: "Getting Started with aOS",
    url: "https://youtu.be/uvvqX91VFS4",
    description: "Your first steps into the Andromeda ecosystem."
  }
];

const tutorialVideos = [
  {
    id: "4",
    title: "Building Your First App with aOS",
    url: "https://youtu.be/QxMC-cygMaI",
    description: "Step-by-step tutorial to create your first application on aOS."
  },
  {
    id: "5",
    title: "Advanced aOS Features",
    url: "https://youtu.be/jV9XrStVBog",
    description: "Explore advanced features and capabilities of the Andromeda OS."
  },
  {
    id: "6",
    title: "NFT Marketplace Use Case",
    url: "https://youtu.be/tfY8ni9uJSE",
    description: "Learn how to build an NFT marketplace using aOS."
  },
  {
    id: "7",
    title: "Crowdfunding App",
    url: "https://youtu.be/rOKXu_NNfyk",
    description: "Create a crowdfunding application with Andromeda tools."
  }
];

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

// Mission data - these would typically come from an API or database
const missions = [
  {
    id: 1,
    title: "Join the Andromeda Developer Program",
    description:
      "Join our Telegram to become part of the Andromeda Developer Program. Connect with fellow developers, get support, and unlock exclusive resources to accelerate your journey with Andromeda.",
    status: "completed" as const,
    type: "onboarding" as const,
    completionDate: "2024-01-15",
    link: "https://t.me/andromedaprotocol/3776",
    linkText: "Join Andromeda Dev Telegram",
  },
  {
    id: 2,
    title: "Introduce Yourself in the Telegram",
    description:
      "Once you're a member, introduce yourself by sharing your background and what you aim to achieve. This helps you connect with the community, find collaborators, and get real-time support for your projects.",
    status: "pending" as const,
    type: "community" as const,
    link: "https://t.me/andromedaprotocol/3776",
    linkText: "Introduce yourself",
  },
  {
    id: 3,
    title: "Master ADO Building",
    description:
      "Master Andromeda Digital Objects (ADOs) by completing these 8 guides. Understanding ADOs is key to building powerful, modular, and upgradeable applications on Andromeda.",
    status: "pending" as const,
    type: "onboarding" as const,
    link: "https://docs.andromedaprotocol.io/guides/guides-and-examples/ado-builder",
    linkText: "Start ADO Builder Guides",
  },
  {
    id: 4,
    title: "Build Your First App",
    description:
      "Use the Andromeda App Builder to create your first functional application, like an NFT Auction Marketplace. This hands-on experience will show you how quickly you can bring ideas to life on Andromeda.",
    status: "pending" as const,
    type: "rewards" as const,
    link: "https://docs.andromedaprotocol.io/guides/guides-and-examples/app-builder/nft-auction-marketplace",
    linkText: "Explore App Builder Guide",
  },
  {
    id: 5,
    title: "Explore Embeddables",
    description:
      "Discover Andromeda Embeddables – reusable UI components that can be easily integrated into any webpage. Learn to create them and add powerful Andromeda functionality to existing sites or new projects.",
    status: "pending" as const,
    type: "rewards" as const,
    link: "https://docs.andromedaprotocol.io/guides/guides-and-examples/embeddables/nft-auction",
    linkText: "Try Embeddables Guide",
  },
  {
    id: 6,
    title: "Share Your Success",
    description:
      "Share your projects and achievements with the Andromeda community in our main Telegram channel. Get valuable feedback, inspire others, and gain recognition for your work!",
    status: "pending" as const,
    type: "community" as const,
    link: "https://t.me/andromedaprotocol/3776",
    linkText: "Post in Main Telegram Channel",
  },
  {
    id: 7,
    title: "Launch Your Project",
    description:
      "Ready to make an impact? Visit our Hackerboard to find real-world challenges and bounties. Contribute to the Andromeda ecosystem, solve problems, and get rewarded for your skills.",
    status: "pending" as const,
    type: "rewards" as const,
    link: "https://github.com/andromedaprotocol/hackerboard_tasks/issues",
    linkText: "Visit The 🔗🪓 Hackerboard",
  },
];

export default async function ContractorsPage() {
  // Fetch issues from GitHub
  const issues = await fetchGitHubIssues(
    "andromedaprotocol",
    "Contractor_bidding",
    "open",
  );

  return (
    <main className="container mx-auto p-4 md:p-6 max-w-full min-h-screen bg-[#1a1a1a] text-white">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Contractor Command Center
        </h1>
        <div className="bg-[#1a1a1a] rounded-lg p-6 mb-12 w-full">
          <p className="text-gray-400">
            Hey there! Welcome to our learning dashboard. This is your go-to spot for missions, guides, and docs -- everything you need to dive into Andromeda smoothly.
          </p>
        </div>
      </div>

      {/* Main Layout: Left Content + Right Sidebar */}
      <div className="flex gap-6">
        {/* Left Content - Main Content Area (3/4 width) */}
        <div className="w-3/4">
          {/* Your Missions Section */}
          <div className="mb-16">
            {/* Missions Panel Container */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">Your Missions</h2>
                <div className="bg-gray-800/50 px-4 py-2 rounded-full">
                  <span className="text-[#99a1af] text-sm font-medium">
                    1 of {missions.length} completed
                  </span>
                </div>
              </div>

              <p className="text-[#99a1af] mb-6">
                Just starting with Web3? Check out how Andromeda OS (aOS) makes it super easy to launch smart, scalable dApps without needing to code your own smart contracts!
              </p>

              {/* Scrollable missions container - fixed height to show ~4 tasks */}
              <div className="h-80 overflow-y-auto space-y-4 pr-2">
                {missions.map((mission) => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </div>
          </div>

          {/* Videos Section */}
          <div className="mb-16">
            <VideoCarousel
              generalVideos={generalVideos}
              tutorialVideos={tutorialVideos}
            />
          </div>

          <div className="mb-12">
            <div className="bg-[#232060] rounded-lg border-2 border-[#4D3DF7] p-6 shadow-[0_0_15px_rgba(77,61,247,0.4)]">
              <h2 className="text-2xl font-bold text-white mb-4 text-center">
                🚀 Ready to turn your build into $ANDR?
              </h2>
              <p className="text-gray-200 mb-4">
                For a limited time, we&apos;re rewarding builders who launch on aOS
                with 1,000 $ANDR for every ADO used in a completed and approved
                dApp. Whether you&apos;re creating a token, launching a marketplace,
                or building a full-on Web3 app, every active ADO you deploy stacks
                your rewards. Check out the ADOs below and start building.
              </p>
              <p className="text-gray-200 mb-6">
                Not sure what to build? Complete one of our uses cases and earn
                2,000 $ANDR
              </p>
              <div className="text-center mb-6">
                <p className="text-gray-200 text-sm">
                  Check out our video tutorials above to see examples of NFT Marketplaces and Crowdfunding apps!
                </p>
              </div>
              <p className="text-center text-white font-medium text-lg">
                Start building, start earning.
              </p>
            </div>
          </div>

          <div className="mb-12">
            <details className="bg-[#1a1a1a] rounded-lg cursor-pointer group">
              <summary className="p-6 text-xl font-bold text-white hover:text-blue-400 transition-colors flex items-center justify-center">
                🧩 What ADOs are available right now, and what do they do? Click
                here to find out!
                <span className="ml-2 transform group-open:rotate-180 transition-transform duration-200">
                  ▼
                </span>
              </summary>
              <div className="p-6 pt-0 space-y-6 border-t border-[#333333]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">CW20 (v2.1.0)</h3>
                    <p className="text-gray-400 my-2">
                      Launch your own custom CW20 token in minutes, perfect for
                      community tokens, DAOs, or utility assets.
                    </p>
                    <p className="text-blue-400 italic">
                      → Ready to mint your vision? Start building today.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      CW20 Exchange (v2.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Easily set up a decentralized exchange for your CW20 tokens.
                      Define your rates and start swapping instantly.
                    </p>
                    <p className="text-blue-400 italic">
                      → Power your own on-chain economy, build with the CW20
                      Exchange ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      CW20 Staking (v2.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Create a tailored staking program for any CW20 token.
                      Customize lock-up periods, reward structures, and more.
                    </p>
                    <p className="text-blue-400 italic">
                      → Engage your token holders, launch your staking app now.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">CW721 (v2.1.0)</h3>
                    <p className="text-gray-400 my-2">
                      Deploy custom NFT collections with full control over minting
                      and metadata. Ideal for art, gaming, and collectibles.
                    </p>
                    <p className="text-blue-400 italic">
                      → Bring your NFT project to life, start building with CW721.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Fixed Amount Splitter (v1.2.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Distribute funds automatically to multiple addresses with
                      precision and transparency.
                    </p>
                    <p className="text-blue-400 italic">
                      → Simplify payouts, build with the Fixed Amount Splitter ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">Graph (v0.1.0)</h3>
                    <p className="text-gray-400 my-2">
                      Store and manage coordinate data on-chain. Great for mapping,
                      location-based apps, and gaming logic.
                    </p>
                    <p className="text-blue-400 italic">
                      → Plot your path forward, build with the Graph ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">Curve (v0.2.0)</h3>
                    <p className="text-gray-400 my-2">
                      Define dynamic logic over time or input values, ideal for
                      progressive pricing, reward scaling, and more.
                    </p>
                    <p className="text-blue-400 italic">
                      → Shape your Web3 logic, build smarter with the Curve ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Address List (v2.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Control access to your dApps and ADOs with whitelist and
                      blacklist functionality.
                    </p>
                    <p className="text-blue-400 italic">
                      → Build with security in mind, start using Address List today.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      App Contract (v1.2.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Launch full Web3 apps in one go, no smart contract experience
                      required. Bundle ADOs into powerful dApps.
                    </p>
                    <p className="text-blue-400 italic">
                      → One-click deploy your next big idea with the App ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Auction (v2.2.5)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Run customizable English auctions for NFTs with features like
                      starting price, duration, and whitelists.
                    </p>
                    <p className="text-blue-400 italic">
                      → Turn your NFTs into events, start building auctions now.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Lockdrop (v2.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Run a fair, decentralized token sale with Lockdrop, buyers
                      receive tokens based on proportional contributions, not fixed
                      prices.
                    </p>
                    <p className="text-blue-400 italic">
                      → Launch your next token the smart way, build with Lockdrop.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Marketplace (v2.3.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Create your own NFT marketplace and list digital assets for
                      direct purchase with full pricing control.
                    </p>
                    <p className="text-blue-400 italic">
                      → Take your NFTs to market, start building with the
                      Marketplace ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Validator Staking (v1.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Enable staking directly to validators and support your network
                      while earning rewards.
                    </p>
                    <p className="text-blue-400 italic">
                      → Power up validator engagement, deploy Validator Staking
                      today.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Vesting (v3.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Design flexible vesting schedules for token allocations, ideal
                      for teams, investors, or community rewards.
                    </p>
                    <p className="text-blue-400 italic">
                      → Keep token distribution secure and strategic, build with the
                      Vesting ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Merkle Airdrop (v2.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Deliver CW20 tokens safely and efficiently with transparent
                      Merkle-based airdrops.
                    </p>
                    <p className="text-blue-400 italic">
                      → Airdrop with confidence, launch your campaign using the
                      Airdrop ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">Point (v0.1.0)</h3>
                    <p className="text-gray-400 my-2">
                      Record and reference single on-chain coordinates, simple yet
                      essential for mapping logic and data.
                    </p>
                    <p className="text-blue-400 italic">
                      → Build precise and geo-aware apps—start with the Point ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Primitive (v2.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Store essential on-chain data with customizable access,
                      strings, numbers, addresses, booleans, and more.
                    </p>
                    <p className="text-blue-400 italic">
                      → Bring structure to your dApp, build with the versatile
                      Primitive ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">Rates (v2.0.4)</h3>
                    <p className="text-gray-400 my-2">
                      Add customizable royalties and taxes to NFT sales across your
                      dApps for seamless revenue sharing.
                    </p>
                    <p className="text-blue-400 italic">
                      → Monetize your marketplace with built-in royalties, add the
                      Rates ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Splitter (v2.3.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Automatically distribute funds to multiple wallets based on
                      custom percentages, great for teams, DAOs, and revenue-sharing
                      apps.
                    </p>
                    <p className="text-blue-400 italic">
                      → Streamline fund distribution, build with the Splitter ADO.
                    </p>
                  </div>

                  <div className="bg-[#232323] p-4 rounded-lg border border-[#444444]">
                    <h3 className="text-lg font-bold text-white">
                      Timelock (v2.1.0)
                    </h3>
                    <p className="text-gray-400 my-2">
                      Securely lock funds until a future date or condition is met,
                      perfect for escrows, delayed payments, and more.
                    </p>
                    <p className="text-blue-400 italic">
                      → Add trust to your transactions, launch with the Timelock
                      ADO.
                    </p>
                  </div>
                </div>
              </div>
            </details>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              💼 Contractor Bidding ��
            </h2>
            <p className="text-gray-400 mb-8">
              Browse these open contractor bidding opportunities with Andromeda
              Protocol, and apply to any of them. These are tasks designed for
              skilled contributors to take on contract work.
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
                <div className="flex flex-col items-center justify-center py-12 px-4 bg-[#1a1a1a] rounded-lg">
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

          <div className="mt-10 pt-6 border-t border-[#333333] text-sm text-gray-500 text-center">
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
        </div>

        {/* Right Sidebar (1/4 width) */}
        <div className="w-1/4 space-y-6">
          {/* Docs Section */}
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-3">Docs</h3>
            <p className="text-gray-400 text-sm mb-3">
              Want to learn about aOS? Our docs have simple guides for building NFT marketplaces and DAOs. Dive in!
            </p>
            <a
              href="https://docs.andromedaprotocol.io/guides/guides-and-examples/ado-builder/building-your-first-app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-[#444444] transition-colors text-center text-sm flex items-center justify-center gap-2"
            >
              View Docs
              <span>→</span>
            </a>
          </div>

          {/* Builder Section */}
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <h3 className="text-lg font-bold text-white mb-3">Builder</h3>
            <p className="text-gray-400 text-sm mb-3">
              New to Web3? Discover how Andromeda OS (aOS) simplifies launching smart dApps without coding your own contracts!
            </p>
            <a
              href="https://app.andromedaprotocol.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-[#444444] transition-colors text-center text-sm flex items-center justify-center gap-2"
            >
              Launch Builder
              <span>→</span>
            </a>
          </div>

          {/* Deploy, Hack and get rewarded Section */}
          <div className="bg-gradient-to-br from-black/95 to-gray-900/95 rounded-lg p-4 relative overflow-hidden">
            {/* Particle tornado background */}
            <div className="absolute inset-0 opacity-80">
              {/* Back layer - lightest colors (furthest from viewer) */}
              <div
                className="absolute top-1/2 left-1/2 w-[140vw] h-[140vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 30% 40%, #522eaf 1px, transparent 1px),
                               radial-gradient(circle at 70% 20%, #7a30a8 1px, transparent 1px),
                               radial-gradient(circle at 20% 80%, #522eaf 1.5px, transparent 1.5px),
                               radial-gradient(circle at 80% 60%, #7a30a8 1px, transparent 1px),
                               radial-gradient(circle at 50% 10%, #522eaf 1.5px, transparent 1.5px),
                               radial-gradient(circle at 10% 50%, #7a30a8 1px, transparent 1px)`,
                  backgroundSize: '24px 24px, 32px 32px, 28px 28px, 36px 36px, 20px 20px, 40px 40px',
                  animationDuration: '117s'
                }}
              ></div>

              {/* Second layer - lighter purples */}
              <div
                className="absolute top-1/2 left-1/2 w-[120vw] h-[120vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 25% 35%, #7a30a8 1.5px, transparent 1.5px),
                               radial-gradient(circle at 75% 25%, #522eaf 1px, transparent 1px),
                               radial-gradient(circle at 15% 75%, #7a30a8 1px, transparent 1px),
                               radial-gradient(circle at 85% 65%, #522eaf 2px, transparent 2px),
                               radial-gradient(circle at 55% 15%, #7a30a8 1.5px, transparent 1.5px)`,
                  backgroundSize: '20px 20px, 28px 28px, 24px 24px, 32px 32px, 16px 16px',
                  animationDuration: '73s',
                  animationDirection: 'reverse'
                }}
              ></div>

              {/* Third layer - medium purples */}
              <div
                className="absolute top-1/2 left-1/2 w-[100vw] h-[100vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 20% 30%, #492ca4 1px, transparent 1px),
                               radial-gradient(circle at 80% 20%, #7a30a8 2px, transparent 2px),
                               radial-gradient(circle at 10% 70%, #492ca4 1.5px, transparent 1.5px),
                               radial-gradient(circle at 90% 80%, #7a30a8 1px, transparent 1px),
                               radial-gradient(circle at 60% 10%, #492ca4 1.5px, transparent 1.5px)`,
                  backgroundSize: '16px 16px, 24px 24px, 20px 20px, 28px 28px, 12px 12px',
                  animationDuration: '91s',
                  animationDirection: 'reverse'
                }}
              ></div>

              {/* Fourth layer - dark grays */}
              <div
                className="absolute top-1/2 left-1/2 w-[110vw] h-[110vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 30% 40%, #2a2a2a 1.5px, transparent 1.5px),
                               radial-gradient(circle at 70% 30%, #492ca4 1px, transparent 1px),
                               radial-gradient(circle at 20% 80%, #2a2a2a 2px, transparent 2px),
                               radial-gradient(circle at 80% 70%, #492ca4 1px, transparent 1px)`,
                  backgroundSize: '12px 12px, 20px 20px, 16px 16px, 24px 24px',
                  animationDuration: '47s'
                }}
              ></div>

              {/* Black particle layer 1 */}
              <div
                className="absolute top-1/2 left-1/2 w-[130vw] h-[130vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 15% 25%, #000000 1px, transparent 1px),
                               radial-gradient(circle at 65% 15%, #1a1a1a 1.5px, transparent 1.5px),
                               radial-gradient(circle at 35% 75%, #000000 1px, transparent 1px),
                               radial-gradient(circle at 85% 85%, #1a1a1a 1px, transparent 1px)`,
                  backgroundSize: '18px 18px, 26px 26px, 22px 22px, 30px 30px',
                  animationDuration: '83s',
                  animationDirection: 'reverse'
                }}
              ></div>

              {/* Black particle layer 2 */}
              <div
                className="absolute top-1/2 left-1/2 w-[105vw] h-[105vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 45% 35%, #000000 1.5px, transparent 1.5px),
                               radial-gradient(circle at 25% 65%, #1a1a1a 1px, transparent 1px),
                               radial-gradient(circle at 75% 45%, #000000 2px, transparent 2px),
                               radial-gradient(circle at 55% 85%, #1a1a1a 1px, transparent 1px)`,
                  backgroundSize: '14px 14px, 20px 20px, 16px 16px, 24px 24px',
                  animationDuration: '39s'
                }}
              ></div>

              {/* Dark blue-grey layer */}
              <div
                className="absolute top-1/2 left-1/2 w-[125vw] h-[125vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 35% 20%, #1a1a2e 1px, transparent 1px),
                               radial-gradient(circle at 80% 40%, #16213e 1.5px, transparent 1.5px),
                               radial-gradient(circle at 20% 70%, #1a1a2e 1px, transparent 1px),
                               radial-gradient(circle at 70% 80%, #16213e 1px, transparent 1px),
                               radial-gradient(circle at 50% 30%, #1a1a2e 2px, transparent 2px)`,
                  backgroundSize: '22px 22px, 30px 30px, 18px 18px, 26px 26px, 34px 34px',
                  animationDuration: '67s',
                  animationDirection: 'reverse'
                }}
              ></div>

              {/* Dark grey layer */}
              <div
                className="absolute top-1/2 left-1/2 w-[108vw] h-[108vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 40% 45%, #374151 1.5px, transparent 1.5px),
                               radial-gradient(circle at 15% 25%, #1f2937 1px, transparent 1px),
                               radial-gradient(circle at 85% 65%, #374151 1px, transparent 1px),
                               radial-gradient(circle at 60% 85%, #1f2937 2px, transparent 2px)`,
                  backgroundSize: '16px 16px, 24px 24px, 20px 20px, 28px 28px',
                  animationDuration: '53s'
                }}
              ></div>

              {/* Very dark blue layer */}
              <div
                className="absolute top-1/2 left-1/2 w-[118vw] h-[118vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 25% 55%, #0f172a 1px, transparent 1px),
                               radial-gradient(circle at 75% 25%, #111827 1.5px, transparent 1.5px),
                               radial-gradient(circle at 45% 75%, #0f172a 2px, transparent 2px),
                               radial-gradient(circle at 85% 45%, #111827 1px, transparent 1px),
                               radial-gradient(circle at 15% 85%, #0f172a 1px, transparent 1px)`,
                  backgroundSize: '12px 12px, 20px 20px, 16px 16px, 24px 24px, 18px 18px',
                  animationDuration: '79s',
                  animationDirection: 'reverse'
                }}
              ></div>

              {/* Front layer - darkest colors (closest to viewer) */}
              <div
                className="absolute top-1/2 left-1/2 w-[115vw] h-[115vh] -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `radial-gradient(circle at 25% 25%, #2a2a41 1px, transparent 1px),
                               radial-gradient(circle at 75% 25%, #2a2a2a 1.5px, transparent 1.5px),
                               radial-gradient(circle at 25% 75%, #2a2a41 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, #2a2a2a 1px, transparent 1px)`,
                  backgroundSize: '8px 8px, 16px 16px, 12px 12px, 20px 20px',
                  animationDuration: '31s',
                  animationDirection: 'reverse'
                }}
              ></div>

              {/* Core tornado eye */}
              <div
                className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
                style={{
                  background: 'radial-gradient(circle, #2a2a2a 0%, transparent 100%)'
                }}
              ></div>

              {/* Swirling particle streams */}
              <div
                className="absolute top-1/2 left-1/2 w-40 h-40 -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `conic-gradient(from 0deg, transparent, #2a2a41, transparent, #492ca4, transparent, #7a30a8, transparent)`,
                  mask: `radial-gradient(circle at 20% 20%, #2a2a41 1px, transparent 1px),
                          radial-gradient(circle at 60% 40%, #492ca4 1px, transparent 1px),
                          radial-gradient(circle at 40% 80%, #7a30a8 1px, transparent 1px),
                          radial-gradient(circle at 80% 60%, #522eaf 1px, transparent 1px)`,
                  maskSize: '20px 20px, 24px 24px, 18px 18px, 22px 22px',
                  animationDuration: '25s'
                }}
              ></div>

              {/* Additional particle stream */}
              <div
                className="absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 animate-spin"
                style={{
                  background: `conic-gradient(from 180deg, transparent, #522eaf, transparent, #2a2a2a, transparent)`,
                  mask: `radial-gradient(circle at 30% 30%, #522eaf 1.5px, transparent 1.5px),
                          radial-gradient(circle at 70% 50%, #2a2a2a 1.5px, transparent 1.5px),
                          radial-gradient(circle at 50% 70%, #7a30a8 1.5px, transparent 1.5px)`,
                  maskSize: '16px 16px, 20px 20px, 14px 14px',
                  animationDuration: '18s',
                  animationDirection: 'reverse'
                }}
              ></div>
            </div>

            {/* Content with relative positioning to stay above background */}
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-3">Deploy, Hack and get rewarded!</h3>
              <p className="text-gray-300 text-sm mb-3">
                We&apos;re giving away 1,000 $ANDR for every ADO used in a dApp on aOS!
              </p>
              <p className="text-gray-300 text-sm mb-4">
                Want to dive into coding and tackle some fun challenges with Andromeda Protocol? Check out these open bounties and hacking challenges!
              </p>
              <button className="w-full bg-gray-600/40 hover:bg-gray-500/50 text-gray-200 px-4 py-2 rounded-lg text-sm transition-colors mb-3 backdrop-blur-sm">
                Learn about the campaign
              </button>
              <button className="w-full bg-gray-600/40 hover:bg-gray-500/50 text-gray-200 px-4 py-2 rounded-lg text-sm transition-colors backdrop-blur-sm">
                View Hackerboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
