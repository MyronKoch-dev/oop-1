import React from "react";

interface DiveInSectionProps {
  className?: string;
}

export function DiveInSection({ className = "" }: DiveInSectionProps) {
  return (
    <div className={`mt-10 flex flex-col items-center ${className}`}>
      <div className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
        <span role="img" aria-label="sparkles">
          ✨
        </span>
        Are you ready to dive on in?
        <span role="img" aria-label="sparkles">
          ✨
        </span>
      </div>
      <p className="text-lg text-gray-400 mb-6 max-w-xl text-center">
        <a
          href="https://www.keplr.app/get"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-[#3498db] font-semibold hover:text-[#2980b9] transition-colors"
        >
          If you already have a Keplr wallet and the Chrome extension
        </a>
        , you can get some testnet <span className="font-semibold">$ANDR</span>{" "}
        tokens from the <span className="font-semibold">FAUCET</span>, then head
        directly to the <span className="font-semibold">WEB APP</span> and{" "}
        <span className="font-semibold">BUILD</span> something!
      </p>
      <div className="flex flex-col md:flex-row gap-4 w-full max-w-xl justify-center">
        <a
          href="https://andromeda-testnet-faucet.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-6 py-3 bg-[#3498db] text-white font-semibold rounded-md hover:bg-[#2980b9] transition-colors text-lg flex items-center justify-center gap-2 shadow"
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
          className="flex-1 px-6 py-3 bg-[#1a2b4a] text-[#6bbbff] font-semibold rounded-md hover:bg-[#213459] transition-colors text-lg flex items-center justify-center gap-2 shadow"
        >
          <span role="img" aria-label="rocket">
            🚀
          </span>
          Go to Testnet Web App
        </a>
      </div>
    </div>
  );
}
