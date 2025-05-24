"use client";

import React from "react";
import { Progress } from "./progress";
import { ArrowLeft } from "lucide-react";

interface TopProgressPanelProps {
  currentStep?: number;
  totalSteps?: number;
  onRestart?: () => void;
  onBack?: () => void;
  isComplete?: boolean;
  className?: string;
}

export function TopProgressPanel({
  currentStep = 0,
  totalSteps = 12,
  onRestart,
  onBack,
  isComplete = false,
  className = "",
}: TopProgressPanelProps) {
  // Calculate progress percentage
  const normalizedStep = Math.min(currentStep, totalSteps);
  const progressPercentage = Math.min(
    Math.round((normalizedStep / totalSteps) * 100),
    100,
  );

  return (
    <div
      className={`fixed top-6 left-16 right-4 lg:top-4 lg:left-auto lg:right-4 z-50 flex items-center justify-end lg:justify-start gap-3 ${className}`}
    >
      {/* Back button */}
      {onBack && currentStep > 0 && !isComplete && (
        <button
          onClick={onBack}
          className="px-3 py-2 rounded-md bg-[#232323] text-sm text-gray-300 border border-[#444] hover:bg-[#333] hover:text-white transition-colors flex items-center gap-1"
          aria-label="Go Back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      )}

      {/* Restart button */}
      {onRestart && (
        <button
          onClick={onRestart}
          className="px-4 py-2 rounded-md bg-[#232323] text-sm text-gray-300 border border-[#444] hover:bg-[#333] hover:text-white transition-colors"
          aria-label="Restart Onboarding"
        >
          Restart
        </button>
      )}

      {/* Progress panel - extended length */}
      <div className="bg-[#2a2a2a]/95 border border-[#404040] rounded-full px-4 py-2.5 flex items-center gap-3 shadow-lg backdrop-blur-sm min-w-[280px] max-w-[380px] transition-all duration-200 ease-in-out hover:bg-[#333333]/95">
        <span className="text-white text-sm font-medium">Completion</span>
        <div className="flex items-center gap-2 flex-1">
          <Progress
            value={progressPercentage}
            className="flex-1 h-2 bg-[#404040] [&>[data-slot=progress-indicator]]:bg-gray-300"
          />
          <span className="text-white text-sm font-semibold min-w-[30px] text-right">
            {progressPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
