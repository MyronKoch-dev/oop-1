"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

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

interface MissionCardProps {
  mission: Mission;
  onComplete?: (missionId: number) => void;
}

const getStatusText = (status: Mission["status"]) => {
  switch (status) {
    case "completed":
      return "Completed ✓";
    case "in-progress":
      return "Mark as complete";
    case "pending":
      return "Mark as complete";
    default:
      return "Mark as complete";
  }
};

const getCardStyles = (status: Mission["status"]) => {
  switch (status) {
    case "completed":
      return "bg-[#bfffaa]";
    case "in-progress":
      return "bg-[#aadeff]";
    case "pending":
      return "bg-[#aadeff]";
    default:
      return "bg-[#aadeff]";
  }
};

export function MissionCard({ mission, onComplete }: MissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMarkComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mission.status !== "completed" && onComplete) {
      onComplete(mission.id);
    }
  };

  return (
    <div
      className={`
        relative p-6 rounded-xl
        ${getCardStyles(mission.status)}
        transition-all duration-200 hover:scale-[1.01]
        w-full cursor-pointer
      `}
      onClick={toggleExpanded}
    >
      {/* Main content - always visible */}
      <div className="flex items-center justify-between">
        {/* Left side - Title */}
        <div className="flex-1">
          <h3
            className={`text-lg text-gray-900 leading-tight ${
              mission.status === "completed" ? "line-through" : ""
            }`}
          >
            {mission.title}
          </h3>
        </div>

        {/* Right side - Action button and dropdown */}
        <div className="flex items-center gap-3">
          <button
            className={`
              py-2 px-6 rounded-full text-sm font-semibold 
              transition-colors duration-200
              ${
                mission.status === "completed"
                  ? "bg-[#00c951] text-white cursor-default"
                  : "bg-black/20 text-black hover:bg-black/30"
              }
            `}
            disabled={mission.status === "completed"}
            onClick={handleMarkComplete}
          >
            {getStatusText(mission.status)}
          </button>

          <ChevronDown
            className={`w-5 h-5 text-gray-700 transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-6 pt-4 border-t border-black/10">
          <p className="text-sm text-gray-800 leading-relaxed mb-4">
            {mission.description}
          </p>

          {/* Link if available */}
          {mission.link && mission.linkText && (
            <a
              href={mission.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              🔗 {mission.linkText}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
