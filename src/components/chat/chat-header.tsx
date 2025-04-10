import { Progress } from "@/components/ui/progress"

interface ChatHeaderProps {
    title: string
    subtitle?: string
    currentStep?: number
    totalSteps?: number
    className?: string
}

export function ChatHeader({
    title = "Chat",
    subtitle,
    currentStep = 0,
    totalSteps = 12, // Default to 12 steps for your questionnaire
    className = "",
}: ChatHeaderProps) {
    // Ensure currentStep doesn't exceed totalSteps and calculate progress percentage
    const normalizedStep = Math.min(currentStep, totalSteps);
    const progressPercentage = Math.min(Math.round((normalizedStep / totalSteps) * 100), 100);

    // Show "Complete" instead of step number when at 100%
    const stepText = progressPercentage === 100
        ? "Complete"
        : `Step ${normalizedStep} of ${totalSteps}`;

    return (
        <div className={`border-b border-[#333333] dark:border-[#333333] p-4 bg-[#1a1a1a] dark:bg-[#1a1a1a] text-white ${className}`}>
            <div className="flex flex-col items-center space-y-1.5">
                <h2 className="text-lg font-semibold text-white text-center">{title}</h2>
                {subtitle && <p className="text-sm text-gray-300 dark:text-gray-300 text-center">{subtitle}</p>}
            </div>
            <div className="mt-3">
                <Progress value={progressPercentage} className="h-2 bg-[#2a2a2a]" />
                <div className="flex justify-between mt-1 text-xs text-gray-300 dark:text-gray-300">
                    <span>
                        {stepText}
                    </span>
                    <span>{progressPercentage}% complete</span>
                </div>
            </div>
        </div>
    )
}

