"use client";

import { cn } from "@/lib/utils";
import { Layers } from "lucide-react";
import React, { useState } from "react";

interface RightSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
                    "lg:translate-x-0 lg:shadow-none" // Always show on large screens, matching left sidebar
                )}
            >
                <div className="p-6">
                    <div className="card bg-[#1a1a1a] rounded-lg border border-[#333333] p-5">
                        <div className="header-section mb-4 text-center">
                            <h2 className="header-title text-xl font-bold text-white flex items-center justify-center gap-2">
                                Developer <span className="rocket-icon">🚀</span> Launchpad
                            </h2>
                            <p className="onboard-check text-gray-400 text-sm mt-1">Already onboarded?</p>
                            <div className="warning mt-3 flex items-center gap-2 bg-[#262626] p-3 rounded-md">
                                <Layers className="w-5 h-5 text-amber-500" />
                                <h1 className="header-subtitle text-amber-500 text-sm font-semibold">DO THIS AFTER ONBOARDING</h1>
                            </div>
                        </div>

                        <ol className="launchpad-list space-y-6">
                            {[
                                {
                                    number: "⭐",
                                    title: "COMPLETE ALL OF THE FOLLOWING TASKS TO JOIN THE ANDROMEDA FLIGHT CREW 👽",
                                    description: null,
                                    link: null,
                                },
                                {
                                    number: "1",
                                    title: "Join the Andromeda Developer Program",
                                    description: "Joining our telegram is the first step in becoming a part of the Andromeda Developer Program. Here You will connect with like-minded individuals and gain access to exclusive resources.",
                                    link: { href: "https://t.me/andromedaprotocol/3776", text: "Join Andromeda Dev Telegram" },
                                },
                                {
                                    number: "2",
                                    title: "Introduce Yourself in the Telegram",
                                    description: "Once you're a member, introduce yourself by sharing your background and aspirations. Here, you'll make friends and receive real-time support from the community.",
                                    link: null,
                                },
                                {
                                    number: "3",
                                    title: "Master ADO Building",
                                    description: "Complete 8 comprehensive guides to understand the fundamentals of ADO development.",
                                    link: { href: "https://docs.andromedaprotocol.io/guides/guides-and-examples/ado-builder", text: "Start ADO Builder Guides" },
                                },
                                {
                                    number: "4",
                                    title: "Build Your First App",
                                    description: "Create a functional application using the Andromeda App Builder.",
                                    link: { href: "https://docs.andromedaprotocol.io/guides/guides-and-examples/app-builder/nft-auction-marketplace", text: "Explore App Builder Guide" },
                                },
                                {
                                    number: "5",
                                    title: "Explore Embeddables",
                                    description: "Learn how to create Andromeda embeddables.",
                                    link: { href: "https://docs.andromedaprotocol.io/guides/guides-and-examples/embeddables/nft-auction", text: "Try Embeddables Guide" },
                                },
                                {
                                    number: "6",
                                    title: "Share Your Success",
                                    description: "Showcase your achievements and get recognition from the community.",
                                    link: { href: "https://t.me/andromedaprotocol/3776", text: "Post in Main Telegram Channel" },
                                },
                                {
                                    number: "7",
                                    title: "Launch Your Project",
                                    description: "Take on real-world challenges and contribute to the ecosystem.",
                                    link: { href: "https://github.com/andromedaprotocol/hackerboard_tasks/issues", text: "Visit The 🔗�� 🪓 Hackerboard" },
                                },
                            ].map((item, idx) => (
                                <li
                                    key={idx}
                                    className="launchpad-item bg-[#262626] p-4 rounded-md border border-[#333333] cursor-pointer transition-all duration-200"
                                    onMouseEnter={() => setHoveredIndex(idx)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    <div className="flex gap-3 items-center">
                                        <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold">{item.number}</div>
                                        <div className="launchpad-title text-white font-semibold text-base flex-1 break-words">{item.title}</div>
                                    </div>
                                    <div className={`transition-all duration-300 overflow-hidden ${hoveredIndex === idx ? 'max-h-96 mt-2' : 'max-h-0'}`}>
                                        {item.description && (
                                            <div className="launchpad-description text-gray-300 text-sm text-center">{item.description}</div>
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