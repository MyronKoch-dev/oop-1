import { BookOpen } from "lucide-react";

export const metadata = {
    title: "Explorer Path | Andromeda Protocol",
    description:
        "Explore Andromeda resources, tutorials, and learning materials. Find links, images, and videos here.",
};

export default function ExplorerPage() {
    return (
        <main className="min-h-screen bg-black text-white">
            <div className="container mx-auto p-4 md:p-6">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-4 text-white flex items-center justify-center gap-2">
                        <BookOpen className="w-8 h-8 text-[#3FB6E4]" /> Explorer Path
                    </h1>
                    <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                        Dive into the Andromeda ecosystem! Discover tutorials, guides, and
                        learning resources to help you get started and grow your knowledge.
                    </p>
                </div>
                <div className="bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 mb-8 text-center">
                    <a
                        href="https://andromedaprotocol.io/learn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-6 py-3 bg-[#3FB6E4] text-black font-semibold rounded-md hover:bg-[#349fcf] transition-colors text-lg mb-4"
                    >
                        Andromeda Learn Portal
                    </a>
                    <div className="mt-6">
                        <p className="text-gray-400">More resources coming soon!</p>
                        {/* TODO: Add images and videos here */}
                    </div>
                </div>
                <div className="mt-10 flex flex-col items-center">
                    <div className="text-2xl font-bold text-[#A084F7] mb-2 flex items-center justify-center gap-2">
                        <span role="img" aria-label="sparkles">
                            ✨
                        </span>
                        Are you just ready to dive on in?
                        <span role="img" aria-label="sparkles">
                            ✨
                        </span>
                    </div>
                    <p className="text-lg text-white mb-6 max-w-xl text-center">
                        <a
                            href="https://www.keplr.app/get"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-[#3FB6E4] font-semibold hover:text-[#A084F7] transition-colors"
                        >
                            If you already have a Keplr wallet and the Chrome extension
                        </a>
                        , you can get some testnet <span className="font-semibold">$ANDR</span> tokens from the <span className="font-semibold">FAUCET</span>, then head directly to the <span className="font-semibold">WEB APP</span> and <span className="font-semibold">BUILD</span> something!
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl justify-center">
                        <a
                            href="https://andromeda-testnet-faucet.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-6 py-3 bg-[#A084F7] text-black font-semibold rounded-md hover:bg-[#8a6be7] transition-colors text-lg flex items-center justify-center gap-2 shadow"
                        >
                            <span role="img" aria-label="faucet">
                                🚰
                            </span>
                            Get Testnet $ANDR (Faucet)
                        </a>
                        <a
                            href="https://app.testnet.andromedaprotocol.io/flex-builder"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 px-6 py-3 bg-[#3FB6E4] text-black font-semibold rounded-md hover:bg-[#349fcf] transition-colors text-lg flex items-center justify-center gap-2 shadow"
                        >
                            <span role="img" aria-label="rocket">
                                🚀
                            </span>
                            Go to Testnet Web App
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}
