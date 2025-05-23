"use client";

import { CheckCircle, Clock, CircleDot, ChevronDown } from "lucide-react";

interface Mission {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
  type: "onboarding" | "community" | "rewards";
  completionDate?: string;
  progress?: number;
}

interface MissionCardProps {
  mission: Mission;
}

const getStatusIcon = (status: Mission["status"]) => {
  switch (status) {
    case "completed":
      return <CheckCircle className="w-5 h-5 text-green-700" />;
    case "in-progress":
      return <Clock className="w-5 h-5 text-blue-700" />;
    case "pending":
      return <CircleDot className="w-5 h-5 text-gray-700" />;
    default:
      return <CircleDot className="w-5 h-5 text-gray-700" />;
  }
};

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

const getTypeStyles = (type: Mission["type"]) => {
  switch (type) {
    case "onboarding":
      return "bg-gray-600 text-white";
    case "community":
      return "bg-blue-600 text-white";
    case "rewards":
      return "bg-orange-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

export function MissionCard({ mission }: MissionCardProps) {
  return (
    <div
      className={`
        relative p-6 rounded-xl
        ${getCardStyles(mission.status)}
        transition-all duration-200 hover:scale-[1.01]
        flex items-center justify-between
        w-full
      `}
    >
      {/* Left side - Content */}
      <div className="flex-1 flex items-center gap-4">
        {/* Status icon and type badge */}
        <div className="flex items-center gap-3">
          {getStatusIcon(mission.status)}
          <span
            className={`text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wide ${getTypeStyles(mission.type)}`}
          >
            {mission.type}
          </span>
        </div>

        {/* Title and description */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight">
            {mission.title}
          </h3>
        </div>
      </div>

      {/* Right side - Action button and dropdown */}
      <div className="flex items-center gap-3">
        <button
          className={`
            py-2 px-6 rounded-full text-sm font-semibold 
            transition-colors duration-200
            ${
              mission.status === "completed"
                ? "bg-green-500 text-white cursor-default"
                : "bg-black/20 text-black hover:bg-black/30"
            }
          `}
          disabled={mission.status === "completed"}
        >
          {getStatusText(mission.status)}
        </button>

        <ChevronDown className="w-5 h-5 text-gray-700" />
      </div>

      {/* Completion date (if completed) */}
      {mission.completionDate && (
        <div className="absolute bottom-2 right-6 text-xs text-gray-700 font-medium">
          ✓ Completed: {new Date(mission.completionDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
