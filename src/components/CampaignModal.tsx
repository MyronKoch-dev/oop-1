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
            <DialogContent className="sm:max-w-md bg-[#1a1a1a] border-purple-500/20 text-white">
                <div className="p-6">
                    <DialogHeader className="text-left mb-4">
                        <DialogTitle className="text-xl font-bold text-white text-left">
                            Deploy & Get Rewarded
                        </DialogTitle>
                    </DialogHeader>

                    {/* Purple gradient banner inside content */}
                    <div className="h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden rounded-lg mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/40 to-purple-800/50"></div>
                    </div>

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
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-3 text-left"
                            >
                                <span className="text-lg">▶</span>
                                <span>Watch NFT Marketplace</span>
                            </button>
                            <button
                                onClick={() => window.open('https://youtu.be/rOKXu_NNfyk', '_blank')}
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-3 text-left"
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