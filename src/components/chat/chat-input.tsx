"use client"

import { useState, type KeyboardEvent, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send } from "lucide-react"

export type InputMode = "text" | "buttons" | "conditionalText"

interface ChatInputProps {
    onSendText: (text: string) => void
    onConditionalTextChange?: (text: string) => void
    isConditionalVisible?: boolean
    conditionalLabel?: string
    conditionalText?: string
    disabled?: boolean
    inputMode: InputMode
    placeholder?: string
    className?: string
    onSendMessage?: (message: string) => void
    conditionalTextVisible?: boolean
    setConditionalText?: (text: string) => void
    onConditionalTextSubmit?: () => void
    currentQuestionIndex?: number | null
}

export function ChatInput({
    onSendText,
    onConditionalTextChange,
    isConditionalVisible = false,
    conditionalLabel = "Please provide more details:",
    conditionalText = "",
    disabled = false,
    inputMode = "text",
    placeholder = "Type your message...",
    className = "",
    onSendMessage,
    conditionalTextVisible = false,
    setConditionalText,
    onConditionalTextSubmit,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    currentQuestionIndex,
}: ChatInputProps) {
    const [message, setMessage] = useState("")

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleConditionalChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onConditionalTextChange?.(e.target.value)
        setConditionalText?.(e.target.value)
    }

    const handleSendMessage = () => {
        if (message.trim() && !disabled) {
            if (onSendMessage) {
                onSendMessage(message.trim())
            } else {
                onSendText(message.trim())
            }
            setMessage("")
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const handleConditionalSubmit = () => {
        if (onConditionalTextSubmit) {
            onConditionalTextSubmit()
        }
    }

    // Determine if the main input should be disabled
    // In buttons mode, we might want to disable the text input
    const isMainInputDisabled = disabled || (inputMode === "buttons" && !isConditionalVisible)

    // Use conditionalTextVisible prop if provided, otherwise fall back to isConditionalVisible
    const showConditionalInput = conditionalTextVisible || isConditionalVisible

    return (
        <div className={`border-t border-gray-200 p-4 bg-white ${className}`}>
            {/* Conditional Text Input (shown when conditionalTextVisible/isConditionalVisible is true) */}
            {showConditionalInput && (
                <div className="mb-4">
                    <Label htmlFor="conditional-input" className="block text-sm font-medium mb-1">
                        {conditionalLabel}
                    </Label>
                    <div className="flex flex-col space-y-2">
                        <Textarea
                            id="conditional-input"
                            value={conditionalText}
                            onChange={handleConditionalChange}
                            placeholder="Type additional details here..."
                            className="min-h-[80px] resize-none"
                            disabled={disabled}
                        />
                        {onConditionalTextSubmit && (
                            <Button onClick={handleConditionalSubmit} disabled={disabled || !conditionalText.trim()}>
                                Submit Details
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Main Text Input (always visible) */}
            <div className="flex items-center space-x-2">
                <Input
                    value={message}
                    onChange={handleMessageChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={isMainInputDisabled}
                    className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={isMainInputDisabled || !message.trim()} size="icon" type="submit">
                    <Send className="h-4 w-4" />
                    <span className="sr-only">Send message</span>
                </Button>
            </div>
        </div>
    )
}

