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
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "in-progress":
      return <Clock className="w-5 h-5 text-blue-600" />;
    case "pending":
      return <CircleDot className="w-5 h-5 text-gray-500" />;
    default:
      return <CircleDot className="w-5 h-5 text-gray-500" />;
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
      return "bg-green-100 border-green-300";
    case "in-progress":
      return "bg-blue-100 border-blue-300";
    case "pending":
      return "bg-yellow-100 border-yellow-300";
    default:
      return "bg-gray-100 border-gray-300";
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
        relative p-6 rounded-xl border-2 
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

          {/* Progress bar for in-progress missions */}
          {mission.status === "in-progress" && mission.progress && (
            <div className="mb-2 max-w-md">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span className="font-medium">Progress</span>
                <span className="font-bold">{mission.progress}%</span>
              </div>
              <div className="w-full bg-white rounded-full h-2 border border-gray-300">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${mission.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Action button and dropdown */}
      <div className="flex items-center gap-3">
        <button
          className={`
            py-2 px-6 rounded-lg text-sm font-semibold 
            transition-colors duration-200
            ${
              mission.status === "completed"
                ? "bg-green-500 text-white cursor-default"
                : "bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            }
          `}
          disabled={mission.status === "completed"}
        >
          {getStatusText(mission.status)}
        </button>

        <ChevronDown className="w-5 h-5 text-gray-500" />
      </div>

      {/* Completion date (if completed) */}
      {mission.completionDate && (
        <div className="absolute bottom-2 right-6 text-xs text-gray-500 font-medium">
          ✓ Completed: {new Date(mission.completionDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}
