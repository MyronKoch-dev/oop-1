"use client"

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface CampaignModalProps {
    children: React.ReactNode;
}

export function CampaignModal({ children }: CampaignModalProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-[#1a1a1a] border-purple-500/20 text-white">
                <div className="p-6">
                    <DialogHeader className="text-center mb-4">
                        <DialogTitle className="text-xl font-bold text-white text-center">
                            Deploy & Get Rewarded
                        </DialogTitle>
                    </DialogHeader>

                    {/* Animated gradient banner with subtle motion */}
                    <div className="h-20 relative overflow-hidden rounded-lg mb-4">
                        {/* Base gradient layer */}
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-black"></div>

                        {/* Animated gradient overlays */}
                        <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-700/30 to-transparent animate-pulse"
                            style={{
                                background: `linear-gradient(45deg, transparent, rgba(88, 28, 135, 0.3), transparent)`,
                                animation: 'subtleFlow 4s ease-in-out infinite'
                            }}
                        ></div>

                        <div
                            className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-900/20 to-transparent"
                            style={{
                                background: `linear-gradient(-45deg, transparent, rgba(30, 58, 138, 0.2), transparent)`,
                                animation: 'subtleFlow 6s ease-in-out infinite reverse'
                            }}
                        ></div>

                        {/* Subtle particle dots */}
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `radial-gradient(circle at 20% 50%, rgba(88, 28, 135, 0.4) 1px, transparent 1px),
                            radial-gradient(circle at 80% 30%, rgba(30, 58, 138, 0.3) 1px, transparent 1px),
                            radial-gradient(circle at 60% 80%, rgba(0, 0, 0, 0.5) 1px, transparent 1px)`,
                                backgroundSize: '40px 40px, 60px 60px, 30px 30px',
                                animation: 'subtleParticles 8s linear infinite'
                            }}
                        ></div>
                    </div>

                    <style jsx>{`
            @keyframes subtleFlow {
              0%, 100% { opacity: 0.3; transform: translateX(-20px); }
              50% { opacity: 0.6; transform: translateX(20px); }
            }
            
            @keyframes subtleParticles {
              0% { transform: translate(0, 0); }
              33% { transform: translate(5px, -3px); }
              66% { transform: translate(-3px, 5px); }
              100% { transform: translate(0, 0); }
            }
          `}</style>

                    <div className="space-y-4">
                        <DialogDescription className="text-gray-300 text-sm leading-relaxed text-left">
                            For a limited time, we&apos;re rewarding hackers who launch on aOS with 1,000 $ANDR for every ADO used in a completed and approved dApp. Whether you&apos;re creating a token, launching a marketplace, or building a full-on Web3 app, every active ADO you deploy stacks your rewards. Check out the ADOs below and start building.
                        </DialogDescription>

                        <DialogDescription className="text-gray-300 text-sm leading-relaxed text-left">
                            Not sure what to build? Complete one of our use cases and earn 2,000 $ANDR
                        </DialogDescription>

                        <div className="space-y-3 pt-2">
                            <button
                                onClick={() => window.open('https://youtu.be/tfY8ni9uJSE', '_blank')}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-3"
                            >
                                <span className="text-lg">▶</span>
                                <span>Watch NFT Marketplace</span>
                            </button>
                            <button
                                onClick={() => window.open('https://youtu.be/rOKXu_NNfyk', '_blank')}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-3"
                            >
                                <span className="text-lg">▶</span>
                                <span>Watch Crowdfunding App</span>
                            </button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 