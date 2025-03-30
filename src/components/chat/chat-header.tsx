import { Progress } from "@/components/ui/progress"

interface ChatHeaderProps {
    title: string
    subtitle?: string
    currentStep?: number
    totalSteps?: number
    className?: string
}

export function ChatHeader({
    title,
    subtitle,
    currentStep = 0,
    totalSteps = 12, // Default to 12 steps for your questionnaire
    className = "",
}: ChatHeaderProps) {
    // Calculate progress percentage
    const progressPercentage = Math.min(Math.round((currentStep / totalSteps) * 100), 100)

    return (
        <div className={`border-b border-gray-200 p-4 bg-white ${className}`}>
            <div className="flex flex-col space-y-1.5">
                <h2 className="text-lg font-semibold">{title}</h2>
                {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <div className="mt-3">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>
                        Step {currentStep} of {totalSteps}
                    </span>
                    <span>{progressPercentage}% complete</span>
                </div>
            </div>
        </div>
    )
}

