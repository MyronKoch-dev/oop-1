import { Suspense } from "react";
import { fetchGitHubIssues } from "@/lib/github";
import { IssueCard } from "@/components/cards/IssueCard";
import { IssueCardSkeleton } from "@/components/cards/IssueCardSkeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Hacker Hub | Andromeda Protocol",
  description:
    "Browse open bounties, hacking challenges, and access building tools with Andromeda Protocol",
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

export default async function HackersPage() {
  // Fetch issues from GitHub
  const issues = await fetchGitHubIssues(
    "andromedaprotocol",
    "hackerboard_tasks",
    "open",
  );

  return (
    <main className="container mx-auto p-4 md:p-6 max-w-7xl min-h-screen bg-[#1a1a1a] text-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          🔥 Hacker Command Center 🔥
        </h1>
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 mb-12 max-w-3xl mx-auto">
          <p className="text-white mb-4">
            Congratulations! We&apos;ve determined that you have elite
            hacker-grade skills, and can start building immediately!
          </p>
          <p className="text-gray-400">
            This page will provide several options, including diving into our
            toolset or tackling bounties and challenges (when they are posted).
          </p>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Build with aOS
        </h2>
        <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 mb-8 max-w-4xl mx-auto">
          <p className="text-gray-300 mb-4">
            Andromeda&apos;s vision is that aOS makes Web3 development
            accessible to everyone. Whether you&apos;re a seasoned hacker or
            just getting started, you can use pre-built, customizable modules to
            launch real on-chain apps, fast! It&apos;s intuitive,
            permissionless, and chain-agnostic.
          </p>
          <p className="text-gray-300 mb-4">
            No smart contract experience needed. Just an idea, a browser, and
            aOS.
          </p>
          <p className="text-white font-medium">
            Check out different ways to get started on aOS today:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6">
            <h3 className="text-xl font-bold text-white mb-4">
              🎥 Watch the Intro Videos
            </h3>
            <p className="text-gray-400 mb-4">
              New to modular Web3 development? See what makes the Andromeda
              Operating System (aOS) the easiest way to launch smart, scalable
              dApps, without writing your own smart contracts.
            </p>
            <div className="mt-4 space-y-3">
              <h4 className="text-lg font-medium text-white">
                Some refreshers on aOS:
              </h4>
              <div className="space-y-2">
                <a
                  href="https://youtu.be/RhQfZnurGXo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:underline"
                >
                  • aOS Introduction Video
                </a>
                <a
                  href="https://youtu.be/2ktG307EqEA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:underline"
                >
                  • aOS Core Concepts
                </a>
                <a
                  href="https://youtu.be/uvvqX91VFS4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:underline"
                >
                  • Getting Started with aOS
                </a>
              </div>

              <h4 className="text-lg font-medium text-white mt-6">
                Tutorials to try:
              </h4>
              <div className="space-y-2">
                <a
                  href="https://youtu.be/QxMC-cygMaI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:underline"
                >
                  • Building Your First App with aOS
                </a>
                <a
                  href="https://youtu.be/jV9XrStVBog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-400 hover:underline"
                >
                  • Advanced aOS Features
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Builder
              </h3>
              <p className="text-gray-400 mb-4">
                New to Web3? Discover how Andromeda OS (aOS) simplifies launching smart dApps without coding your own contracts!
              </p>
              <a
                href="https://app.andromedaprotocol.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Launch Builder
              </a>
            </div>

            <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Docs
              </h3>
              <p className="text-gray-400 mb-4">
                Want to learn about aOS? Our docs have simple guides for building NFT marketplaces and DAOs. Dive in!
              </p>
              <a
                href="https://docs.andromedaprotocol.io/guides/guides-and-examples/ado-builder/building-your-first-app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View Docs
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12 max-w-4xl mx-auto">
        <div className="bg-[#232060] rounded-lg border-2 border-[#4D3DF7] p-6 shadow-[0_0_15px_rgba(77,61,247,0.4)]">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            🚀 Ready to turn your hack into $ANDR?
          </h2>
          <p className="text-gray-200 mb-4">
            For a limited time, we&apos;re rewarding hackers who launch on aOS
            with 1,000 $ANDR for every ADO used in a completed and approved
            dApp. Whether you&apos;re creating a token, launching a marketplace,
            or building a full-on Web3 app, every active ADO you deploy stacks
            your rewards. Check out the ADOs below and start building.
          </p>
          <p className="text-gray-200 mb-6">
            Not sure what to build? Complete one of our use cases and earn 2,000
            $ANDR
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <a
              href="https://youtu.be/tfY8ni9uJSE"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1a1a1a] hover:bg-[#252525] p-4 rounded-lg border border-[#333333] text-blue-400 flex items-center justify-center transition-colors"
            >
              <span className="mr-2">🎬</span> NFT Marketplace Use Case
            </a>
            <a
              href="https://youtu.be/rOKXu_NNfyk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#1a1a1a] hover:bg-[#252525] p-4 rounded-lg border border-[#333333] text-blue-400 flex items-center justify-center transition-colors"
            >
              <span className="mr-2">🎬</span> Crowdfunding App
            </a>
          </div>
          <p className="text-center text-white font-medium text-lg">
            Start hacking, start earning.
          </p>
        </div>
      </div>

      <div className="mb-12 max-w-4xl mx-auto">
        <details className="bg-[#1a1a1a] rounded-lg border border-[#333333] cursor-pointer group">
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

      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-6">
          💻 HackerBoard 💻
        </h2>
        <p className="text-gray-400 max-w-3xl mx-auto mb-8">
          Hey hackers! Want to try your hand at coding and creation challenges
          with Andromeda Protocol, and possibly earn some scratch? Browse these
          open bounties and hacking challenges. They are tasks that reward
          successful completion with various and sundry rewards.
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
                No Open Bounties Available
              </h3>
              <p className="text-gray-400 text-center max-w-md">
                There are currently no open bounties available. Please check
                back later or explore other opportunities in the Andromeda
                ecosystem.
              </p>
            </div>
          )}
        </Suspense>
      </ErrorBoundary>

      <div className="mt-10 pt-6 border-t border-[#333333] text-sm text-gray-500 text-center max-w-3xl mx-auto">
        <p>
          Data sourced directly from the{" "}
          <a
            href="https://github.com/andromedaprotocol/hackerboard_tasks"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            andromedaprotocol/hackerboard_tasks
          </a>{" "}
          GitHub repository.
        </p>
      </div>
    </main>
  );
}
