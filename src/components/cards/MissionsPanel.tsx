"use client";

import { useState } from "react";
import { MissionCard } from "./MissionCard";
import Confetti from "react-confetti";

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
    const [showConfetti, setShowConfetti] = useState(false);
    const [showCongrats, setShowCongrats] = useState(false);

    // Function to mark a mission as complete
    const markMissionComplete = (missionId: number) => {
        setCompletedMissions(prev => {
            const newCompleted = new Set([...prev, missionId]);

            // Check if this completion means all missions are done
            if (newCompleted.size === missions.length && !prev.has(missionId)) {
                // Trigger celebration
                setShowConfetti(true);
                setShowCongrats(true);

                // Auto-hide confetti after 5 seconds
                setTimeout(() => setShowConfetti(false), 5000);
                // Auto-hide congrats message after 4 seconds
                setTimeout(() => setShowCongrats(false), 4000);
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
            {/* Confetti Animation */}
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    numberOfPieces={200}
                    recycle={false}
                    colors={['#00c951', '#bfffaa', '#4ade80', '#22c55e', '#16a34a', '#15803d']}
                />
            )}

            {/* Congratulations Message */}
            {showCongrats && (
                <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl transform animate-bounce">
                        <div className="text-center">
                            <div className="text-2xl font-bold mb-2">🎉 Congratulations! 🎉</div>
                            <div className="text-lg">You&apos;ve completed all your missions!</div>
                            <div className="text-sm opacity-90 mt-1">Welcome to the Andromeda ecosystem!</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Missions Panel Container */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white">Your Missions</h2>
                    <div className={`px-4 py-2 rounded-full transition-colors duration-300 ${allCompleted
                        ? "bg-gradient-to-r from-green-500 to-green-600"
                        : "bg-gray-800/50"
                        }`}>
                        <span className={`text-sm font-medium ${allCompleted ? "text-white" : "text-[#99a1af]"
                            }`}>
                            {completedMissions.size} of {missions.length} completed
                            {allCompleted && " ✨"}
                        </span>
                    </div>
                </div>

                <p className="text-[#99a1af] mb-6">
                    {allCompleted
                        ? "🎯 Amazing work! You've mastered the basics of Andromeda OS. Ready to build something incredible?"
                        : "Just starting with Web3? Check out how Andromeda OS (aOS) makes it super easy to launch smart, scalable dApps without needing to code your own smart contracts!"
                    }
                </p>

                {/* Scrollable missions container - fixed height to show ~4 tasks */}
                <div className="h-80 overflow-y-auto space-y-4 pr-2">
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