"use client";

import { cn } from "@/lib/utils";
import { Layers, ExternalLink, Rocket } from "lucide-react";

interface RightSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RightSidebar({ isOpen, onClose }: RightSidebarProps) {
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
                    "lg:shadow-none" // Removed "lg:translate-x-0" to allow collapsing on desktop
                )}
            >
                <div className="p-6">
                    <div className="card bg-[#1a1a1a] rounded-lg border border-[#333333] p-5">
                        <div className="header-section mb-4 text-center">
                            <h2 className="header-title text-xl font-bold text-white flex items-center justify-center gap-2">
                                Developer <Rocket className="w-6 h-6 text-amber-500" /> Launchpad
                            </h2>
                            <p className="onboard-check text-gray-400 text-sm mt-1">Already onboarded?</p>
                            <div className="warning mt-3 flex items-center gap-2 bg-[#262626] p-3 rounded-md">
                                <Layers className="w-5 h-5 text-amber-500" />
                                <h1 className="header-subtitle text-amber-500 text-sm font-semibold">DO THIS AFTER ONBOARDING</h1>
                            </div>
                        </div>

                        <ol className="launchpad-list space-y-6">
                            <li className="launchpad-item bg-[#262626] p-4 rounded-md">
                                <div className="flex gap-3">
                                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold">⭐</div>
                                    <p className="launchpad-description text-white font-medium">
                                        COMPLETE ALL OF THE FOLLOWING TASKS TO JOIN THE ANDROMEDA FLIGHT CREW 👽
                                    </p>
                                </div>
                            </li>

                            <li className="launchpad-item bg-[#262626] p-4 rounded-md">
                                <div className="flex gap-3">
                                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold">1</div>
                                    <div className="content">
                                        <h4 className="launchpad-title text-white font-semibold">Join the Andromeda Developer Program</h4>
                                        <p className="launchpad-description text-gray-300 text-sm mt-1">
                                            Joining our telegram is the first step in becoming a part of the Andromeda Developer Program.
                                            Here You will connect with like-minded individuals and gain access to exclusive resources.
                                        </p>
                                        <a href="https://t.me/andromedaprotocol/3776"
                                            className="launchpad-link mt-3 inline-flex items-center justify-center px-4 py-2 bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff] rounded-md transition-colors gap-2"
                                            target="_blank" rel="noopener noreferrer">
                                            Join Andromeda Dev Telegram
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li className="launchpad-item bg-[#262626] p-4 rounded-md">
                                <div className="flex gap-3">
                                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-amber-400 font-bold">2</div>
                                    <div className="content">
                                        <h4 className="launchpad-title text-white font-semibold">Introduce Yourself in the Telegram</h4>
                                        <p className="launchpad-description text-gray-300 text-sm mt-1 italic font-medium">
                                            Once you&apos;re a member, introduce yourself by sharing your background and aspirations.
                                            Here, you&apos;ll make friends and receive real-time support from the community.
                                        </p>
                                    </div>
                                </div>
                            </li>

                            <li className="launchpad-item p-4 rounded-md border border-[#333333]">
                                <div className="flex gap-3">
                                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-gray-400 font-bold">3</div>
                                    <div className="content">
                                        <h4 className="launchpad-title text-white font-semibold">Master ADO Building</h4>
                                        <p className="launchpad-description text-gray-300 text-sm mt-1">
                                            Complete 8 comprehensive guides to understand the fundamentals of ADO development.
                                        </p>
                                        <a href="https://docs.andromedaprotocol.io/guides/guides-and-examples/ado-builder"
                                            className="launchpad-link mt-3 inline-flex items-center justify-center px-4 py-2 bg-[#2a2a2a] text-white rounded-md hover:bg-[#333333] transition-colors gap-2"
                                            target="_blank" rel="noopener noreferrer">
                                            Start ADO Builder Guides
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li className="launchpad-item p-4 rounded-md border border-[#333333]">
                                <div className="flex gap-3">
                                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-gray-400 font-bold">4</div>
                                    <div className="content">
                                        <h4 className="launchpad-title text-white font-semibold">Build Your First App</h4>
                                        <p className="launchpad-description text-gray-300 text-sm mt-1">
                                            Create a functional application using the Andromeda App Builder.
                                        </p>
                                        <a href="https://docs.andromedaprotocol.io/guides/guides-and-examples/app-builder/nft-auction-marketplace"
                                            className="launchpad-link mt-3 inline-flex items-center justify-center px-4 py-2 bg-[#2a2a2a] text-white rounded-md hover:bg-[#333333] transition-colors gap-2"
                                            target="_blank" rel="noopener noreferrer">
                                            Explore App Builder Guide
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li className="launchpad-item p-4 rounded-md border border-[#333333]">
                                <div className="flex gap-3">
                                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-gray-400 font-bold">5</div>
                                    <div className="content">
                                        <h4 className="launchpad-title text-white font-semibold">Explore Embeddables</h4>
                                        <p className="launchpad-description text-gray-300 text-sm mt-1">
                                            Learn how to create Andromeda embeddables.
                                        </p>
                                        <a href="https://docs.andromedaprotocol.io/guides/guides-and-examples/embeddables/nft-auction"
                                            className="launchpad-link mt-3 inline-flex items-center justify-center px-4 py-2 bg-[#2a2a2a] text-white rounded-md hover:bg-[#333333] transition-colors gap-2"
                                            target="_blank" rel="noopener noreferrer">
                                            Try Embeddables Guide
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li className="launchpad-item p-4 rounded-md border border-[#333333]">
                                <div className="flex gap-3">
                                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-gray-400 font-bold">6</div>
                                    <div className="content">
                                        <h4 className="launchpad-title text-white font-semibold">Share Your Success</h4>
                                        <p className="launchpad-description text-gray-300 text-sm mt-1">
                                            Showcase your achievements and get recognition from the community.
                                        </p>
                                        <a href="https://t.me/andromedaprotocol/3776"
                                            className="launchpad-link mt-3 inline-flex items-center justify-center px-4 py-2 bg-[#2a2a2a] text-white rounded-md hover:bg-[#333333] transition-colors gap-2"
                                            target="_blank" rel="noopener noreferrer">
                                            Post in Main Telegram Channel
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </li>

                            <li className="launchpad-item p-4 rounded-md border border-[#333333]">
                                <div className="flex gap-3">
                                    <div className="launchpad-number flex-shrink-0 bg-[#333333] w-8 h-8 rounded-full flex items-center justify-center text-gray-400 font-bold">7</div>
                                    <div className="content">
                                        <h4 className="launchpad-title text-white font-semibold">Launch Your Project</h4>
                                        <p className="launchpad-description text-gray-300 text-sm mt-1">
                                            Take on real-world challenges and contribute to the ecosystem.
                                        </p>
                                        <a href="https://github.com/andromedaprotocol/hackerboard_tasks/issues"
                                            className="launchpad-link mt-3 inline-flex items-center justify-center px-4 py-2 bg-[#2a2a2a] text-white rounded-md hover:bg-[#333333] transition-colors gap-2"
                                            target="_blank" rel="noopener noreferrer">
                                            Visit The 🔗🔗 🪓 Hackerboard
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ol>
                    </div>
                </div>
            </div>
        </>
    );
} 