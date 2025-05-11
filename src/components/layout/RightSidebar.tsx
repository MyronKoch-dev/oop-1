"use client";

import { cn } from "@/lib/utils";
import { Layers, ChevronDown } from "lucide-react";
import React, { useState } from "react";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      {/* Overlay that appears behind the sidebar on mobile when it's open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "fixed top-0 right-0 h-full w-96 bg-[#121212] border-l border-[#333333] z-40 transition-transform duration-300 ease-in-out transform shadow-xl overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full",
          "lg:shadow-none", // Only keep shadow-none for large screens
        )}
      >
        <div className="p-6">
          <div className="card bg-[#1a1a1a] rounded-lg border border-[#333333] p-5">
            <div className="header-section mb-4 text-center">
              <h2 className="header-title text-xl font-bold text-white flex items-center justify-center gap-2">
                Developer <span className="rocket-icon">🚀</span> Launchpad
              </h2>
              <p className="onboard-check text-gray-400 text-sm mt-1">
                Already onboarded?
              </p>
              <div className="warning mt-3 flex items-center gap-2 bg-[#262626] p-3 rounded-md">
                <Layers className="w-5 h-5 text-amber-500" />
                <h1 className="header-subtitle text-amber-500 text-sm font-semibold">
                  DO THIS AFTER ONBOARDING
                </h1>
              </div>
            </div>

            <ol className="launchpad-list space-y-6">
              {[
                {
                  number: "⭐",
                  title:
                    "COMPLETE ALL OF THE FOLLOWING TASKS TO JOIN THE ANDROMEDA FLIGHT CREW 👽",
                  description: null,
                  link: null,
                },
                {
                  number: "1",
                  title: "Join the Andromeda Developer Program",
                  description:
                    "Join our Telegram to become part of the Andromeda Developer Program. Connect with fellow developers, get support, and unlock exclusive resources to accelerate your journey with Andromeda.",
                  link: {
                    href: "https://t.me/andromedaprotocol/3776",
                    text: "Join Andromeda Dev Telegram",
                  },
                },
                {
                  number: "2",
                  title: "Introduce Yourself in the Telegram",
                  description:
                    "Once you're a member, introduce yourself by sharing your background and what you aim to achieve. This helps you connect with the community, find collaborators, and get real-time support for your projects.",
                  link: null,
                },
                {
                  number: "3",
                  title: "Master ADO Building",
                  description:
                    "Master Andromeda Digital Objects (ADOs) by completing these 8 guides. Understanding ADOs is key to building powerful, modular, and upgradeable applications on Andromeda.",
                  link: {
                    href: "https://docs.andromedaprotocol.io/guides/guides-and-examples/ado-builder",
                    text: "Start ADO Builder Guides",
                  },
                },
                {
                  number: "4",
                  title: "Build Your First App",
                  description:
                    "Use the Andromeda App Builder to create your first functional application, like an NFT Auction Marketplace. This hands-on experience will show you how quickly you can bring ideas to life on Andromeda.",
                  link: {
                    href: "https://docs.andromedaprotocol.io/guides/guides-and-examples/app-builder/nft-auction-marketplace",
                    text: "Explore App Builder Guide",
                  },
                },
                {
                  number: "5",
                  title: "Explore Embeddables",
                  description: "Discover Andromeda Embeddables – reusable UI components that can be easily integrated into any webpage. Learn to create them and add powerful Andromeda functionality to existing sites or new projects.",
                  link: {
                    href: "https://docs.andromedaprotocol.io/guides/guides-and-examples/embeddables/nft-auction",
                    text: "Try Embeddables Guide",
                  },
                },
                {
                  number: "6",
                  title: "Share Your Success",
                  description:
                    "Share your projects and achievements with the Andromeda community in our main Telegram channel. Get valuable feedback, inspire others, and gain recognition for your work!",
                  link: {
                    href: "https://t.me/andromedaprotocol/3776",
                    text: "Post in Main Telegram Channel",
                  },
                },
                {
                  number: "7",
                  title: "Launch Your Project",
                  description:
                    "Ready to make an impact? Visit our Hackerboard to find real-world challenges and bounties. Contribute to the Andromeda ecosystem, solve problems, and get rewarded for your skills.",
                  link: {
                    href: "https://github.com/andromedaprotocol/hackerboard_tasks/issues",
                    text: "Visit The 🔗🪓 Hackerboard",
                  },
                },
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="launchpad-item bg-[#262626] p-4 rounded-md border border-[#333333] cursor-pointer transition-all duration-200 outline-none"
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  tabIndex={0}
                  aria-expanded={openIndex === idx}
                  aria-label={item.title}
                >
                  <div className="flex gap-3 items-center">
                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold">
                      {item.number}
                    </div>
                    <div className="launchpad-title text-white font-semibold text-base flex-1 break-words">
                      {item.title}
                    </div>
                    {idx !== 0 && (
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 ml-2 transition-transform duration-200 ${openIndex === idx ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${openIndex === idx ? "max-h-96 mt-2" : "max-h-0"}`}
                  >
                    {item.description && (
                      <div className="launchpad-description text-gray-300 text-sm text-center">
                        {idx === 2 ? (
                          <>
                            <a
                              href="https://t.me/andromedaprotocol/3776"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:underline font-medium"
                            >
                              Once you&apos;re a member, introduce yourself
                            </a>
                            {
                              ", by sharing your background and what you aim to achieve. This helps you connect with the community, find collaborators, and get real-time support for your projects."
                            }
                          </>
                        ) : (
                          item.description
                        )}
                      </div>
                    )}
                    {item.link && (
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-400 hover:underline text-center font-medium mt-3 transition"
                      >
                        {item.link.text}
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
