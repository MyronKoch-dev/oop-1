"use client";

interface MissionProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function MissionProgress({
  currentStep,
  totalSteps,
  className = "",
}: MissionProgressProps) {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div
      className={`bg-[#1a1a1a] rounded-lg border border-[#333333] p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Mission Progress</h3>
        <span className="text-sm text-gray-400">
          {currentStep} of {totalSteps} completed
        </span>
      </div>

      <div className="w-full bg-[#333333] rounded-full h-3 mb-4">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-gray-400">
        <span>Keep up the great work!</span>
        <span>{Math.round(progressPercentage)}% complete</span>
      </div>

      {currentStep < totalSteps && (
        <div className="mt-4 p-3 bg-[#232323] rounded-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-300">
            <span className="font-medium text-blue-400">Next:</span> Complete
            your current missions to unlock new opportunities and earn rewards!
          </p>
        </div>
      )}

      {currentStep === totalSteps && (
        <div className="mt-4 p-3 bg-green-900/20 rounded-md border-l-4 border-green-500">
          <p className="text-sm text-green-300">
            🎉 <span className="font-medium">Congratulations!</span> You&apos;ve
            completed all available missions. Check back for more opportunities!
          </p>
        </div>
      )}
    </div>
  );
}
