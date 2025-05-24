"use client";

import { useState } from "react";
import { MissionCard } from "./MissionCard";

interface Mission {
    id: number;
    title: string;
    description: string;
    status: "completed" | "in-progress" | "pending";
    type: "onboarding" | "community" | "rewards";
    completionDate?: string;
    progress?: number;
    link?: string;
    linkText?: string;
}

interface MissionsPanelProps {
    missions: Mission[];
}

export function MissionsPanel({ missions }: MissionsPanelProps) {
    // State to track mission completion
    const [completedMissions, setCompletedMissions] = useState<Set<number>>(
        new Set() // No missions completed by default
    );

    // State for celebration
    const [showCelebration, setShowCelebration] = useState(false);

    // Function to mark a mission as complete
    const markMissionComplete = (missionId: number) => {
        setCompletedMissions(prev => {
            const newCompleted = new Set([...prev, missionId]);

            // Check if this completion means all missions are done
            if (newCompleted.size === missions.length && !prev.has(missionId)) {
                // Trigger celebration
                setShowCelebration(true);
            }

            return newCompleted;
        });
    };

    // Update missions status based on completion state
    const updatedMissions = missions.map(mission => ({
        ...mission,
        status: completedMissions.has(mission.id) ? "completed" as const : "pending" as const
    }));

    // Check if all missions are completed
    const allCompleted = completedMissions.size === missions.length && missions.length > 0;

    return (
        <div className="mb-16 relative">
            <style dangerouslySetInnerHTML={{
                __html: `
                    .mission-scroll::-webkit-scrollbar {
                        width: 8px;
                    }
                    .mission-scroll::-webkit-scrollbar-track {
                        background: #1F2937;
                        border-radius: 4px;
                    }
                    .mission-scroll::-webkit-scrollbar-thumb {
                        background: #4B5563;
                        border-radius: 4px;
                    }
                    .mission-scroll::-webkit-scrollbar-thumb:hover {
                        background: #6B7280;
                    }
                `
            }} />
            {/* Clean Professional Celebration */}
            {showCelebration && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
                    onClick={() => setShowCelebration(false)}
                >
                    <div
                        className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h3 className="text-2xl font-bold text-white">
                                Congratulations! 🎯
                            </h3>

                            <p className="text-gray-300 text-lg">
                                You&apos;ve completed all missions.
                            </p>

                            <p className="text-green-400 font-semibold text-xl">
                                Welcome to the Andromeda ecosystem!
                            </p>

                            <div className="pt-4 border-t border-gray-700">
                                <p className="text-gray-400 text-sm">
                                    You&apos;re now ready to build amazing dApps with aOS
                                </p>
                            </div>

                            <a
                                href="https://app.andromedaprotocol.io"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
                            >
                                Continue Building
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Missions Panel Container */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white">Your Missions</h2>
                    <div className={`px-4 py-2 rounded-full transition-all duration-500 ${allCompleted
                        ? "bg-gradient-to-r from-green-500 to-green-600 animate-pulse shadow-lg shadow-green-500/30"
                        : "bg-gray-800/50"
                        }`}>
                        <span className={`text-sm font-medium transition-colors duration-300 ${allCompleted ? "text-white" : "text-[#99a1af]"
                            }`}>
                            {completedMissions.size} of {missions.length} completed
                            {allCompleted && " ✨"}
                        </span>
                    </div>
                </div>

                <p className="text-[#99a1af] mb-6 transition-all duration-500">
                    {allCompleted
                        ? "🎯 Amazing work! You&apos;ve mastered the basics of Andromeda OS. Ready to build something incredible?"
                        : "Just starting with Web3? Check out how Andromeda OS (aOS) makes it super easy to launch smart, scalable dApps without needing to code your own smart contracts!"
                    }
                </p>

                {/* Scrollable missions container - fixed height to show 4 tasks */}
                <div className="relative">
                    <div
                        className="h-96 overflow-y-auto space-y-4 pr-2 mission-scroll"
                        style={{
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#4B5563 #1F2937'
                        }}
                    >
                        {updatedMissions.map((mission) => (
                            <MissionCard
                                key={mission.id}
                                mission={mission}
                                onComplete={markMissionComplete}
                            />
                        ))}
                    </div>

                    {/* Bottom fade gradient to indicate more content */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#2a2a2a] to-transparent pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
} 