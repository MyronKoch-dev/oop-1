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

                // Auto-hide celebration after 6 seconds
                setTimeout(() => setShowCelebration(false), 6000);
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
            {/* CSS-based Celebration Animation */}
            {showCelebration && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    {/* Floating Emojis Animation */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="animate-bounce delay-100 absolute top-20 left-1/4 text-4xl">🎉</div>
                        <div className="animate-bounce delay-200 absolute top-32 right-1/4 text-4xl">✨</div>
                        <div className="animate-bounce delay-300 absolute top-16 left-1/3 text-3xl">🚀</div>
                        <div className="animate-bounce delay-400 absolute top-28 right-1/3 text-3xl">⭐</div>
                        <div className="animate-bounce delay-500 absolute top-24 left-1/5 text-3xl">🎊</div>
                        <div className="animate-bounce delay-600 absolute top-36 right-1/5 text-3xl">💫</div>
                        <div className="animate-pulse delay-700 absolute top-20 left-2/3 text-4xl">🌟</div>
                        <div className="animate-pulse delay-800 absolute top-32 right-2/3 text-4xl">🎆</div>
                    </div>

                    {/* Central Congratulations Message */}
                    <div className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white px-12 py-8 rounded-3xl shadow-2xl transform animate-pulse border-4 border-green-300">
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-4 animate-bounce">🎉 CONGRATULATIONS! 🎉</div>
                            <div className="text-xl mb-2">You&apos;ve completed all your missions!</div>
                            <div className="text-lg opacity-90 mb-4">Welcome to the Andromeda ecosystem!</div>
                            <div className="flex justify-center space-x-2 text-2xl animate-bounce">
                                <span className="animate-spin">⭐</span>
                                <span className="animate-pulse">🚀</span>
                                <span className="animate-spin">⭐</span>
                            </div>
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
                <div className="h-96 overflow-y-auto space-y-4 pr-2">
                    {updatedMissions.map((mission) => (
                        <MissionCard
                            key={mission.id}
                            mission={mission}
                            onComplete={markMissionComplete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
} 