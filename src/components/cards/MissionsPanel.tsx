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

    // Function to mark a mission as complete
    const markMissionComplete = (missionId: number) => {
        setCompletedMissions(prev => new Set([...prev, missionId]));
    };

    // Update missions status based on completion state
    const updatedMissions = missions.map(mission => ({
        ...mission,
        status: completedMissions.has(mission.id) ? "completed" as const : "pending" as const
    }));

    return (
        <div className="mb-16">
            {/* Missions Panel Container */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-white">Your Missions</h2>
                    <div className="bg-gray-800/50 px-4 py-2 rounded-full">
                        <span className="text-[#99a1af] text-sm font-medium">
                            {completedMissions.size} of {missions.length} completed
                        </span>
                    </div>
                </div>

                <p className="text-[#99a1af] mb-6">
                    Just starting with Web3? Check out how Andromeda OS (aOS) makes it super easy to launch smart, scalable dApps without needing to code your own smart contracts!
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