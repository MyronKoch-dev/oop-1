"use client"

import { useState, useRef, useEffect, type KeyboardEvent, type ChangeEvent } from "react"
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
    conditionalTextInputLabel?: string
    showConfirmButton?: boolean
    onConfirmLanguages?: () => void
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
    conditionalTextInputLabel,
    showConfirmButton = false,
    onConfirmLanguages
}: ChatInputProps) {
    const [message, setMessage] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Variable declarations - moved up before they're used in useEffect
    const showConditionalInput = conditionalTextVisible || isConditionalVisible
    const hideMainInput = showConditionalInput && inputMode === "conditionalText"
    const isMainInputDisabled = disabled || (inputMode === "buttons" && !showConditionalInput)
    const displayLabel = conditionalTextInputLabel || conditionalLabel

    // Effect to focus main input when appropriate
    useEffect(() => {
        if (!disabled && !showConditionalInput && inputRef.current) {
            inputRef.current.focus()
        }
    }, [disabled, inputMode, showConditionalInput])

    // Update the useEffect for conditional text focus
    useEffect(() => {
        if (showConditionalInput && !disabled && textareaRef.current) {
            // Short delay to ensure the element is fully rendered
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    // Place cursor at the end of existing text
                    const length = textareaRef.current.value.length;
                    textareaRef.current.setSelectionRange(length, length);
                }
            }, 50);
        }
    }, [showConditionalInput, disabled, conditionalText]);

    // Add an effect to handle focus changes when input mode changes
    useEffect(() => {
        if (showConditionalInput && !disabled && textareaRef.current) {
            textareaRef.current.focus();
        } else if (!showConditionalInput && !disabled && !hideMainInput && inputRef.current) {
            inputRef.current.focus();
        }
    }, [inputMode, disabled, showConditionalInput, hideMainInput]);

    // Add keyboard event listener for the window when confirm button is shown
    useEffect(() => {
        const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
            if (showConfirmButton && !disabled && e.key === "Enter") {
                e.preventDefault();
                onConfirmLanguages?.();
            }
        };

        if (showConfirmButton) {
            window.addEventListener('keydown', handleGlobalKeyDown);
            return () => window.removeEventListener('keydown', handleGlobalKeyDown);
        }
    }, [showConfirmButton, disabled, onConfirmLanguages]);

    const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleConditionalChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        onConditionalTextChange?.(e.target.value)
        setConditionalText?.(e.target.value)
    }

    const handleSendMessage = () => {
        // Allow empty message for optional fields (determined by currentQuestionIndex)
        // Optional fields are: GitHub (2), Telegram (3), Twitter/X (4), Portfolio (12), Additional Skills (13)
        const isOptionalField = currentQuestionIndex === 2 || currentQuestionIndex === 3 ||
            currentQuestionIndex === 4 || currentQuestionIndex === 12 ||
            currentQuestionIndex === 13;

        if (!disabled && (message.trim() || isOptionalField)) {
            const valueToSend = message.trim() || "none"; // Send "none" for empty optional fields
            if (onSendMessage) {
                onSendMessage(valueToSend)
            } else {
                onSendText(valueToSend)
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

    // Modify handleConditionalKeyDown to handle empty submissions
    const handleConditionalKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !disabled) {
            e.preventDefault();
            // If empty or only whitespace, submit "none"
            if (!conditionalText.trim()) {
                if (setConditionalText) {
                    setConditionalText("none");
                }
                if (onConditionalTextChange) {
                    onConditionalTextChange("none");
                }
            }
            handleConditionalSubmit();
        }
        else if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !disabled) {
            e.preventDefault();
            handleConditionalSubmit();
        }
    }

    return (
        <div className={`border-t border-[#333333] dark:border-[#333333] p-4 bg-[#1a1a1a] dark:bg-[#1a1a1a] z-10 ${className}`}>
            {showConfirmButton && (
                <div className="mb-4">
                    <Button
                        onClick={onConfirmLanguages}
                        disabled={disabled}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        variant="default"
                    >
                        Confirm Language Selections
                    </Button>
                    <p className="text-xs text-center text-gray-400 dark:text-gray-400 mt-1">
                        Select multiple languages and click above to confirm or press Enter
                    </p>
                </div>
            )}

            {showConditionalInput && (
                <div className="mb-4 max-h-[150px] overflow-y-auto">
                    <Label htmlFor="conditional-input" className="block text-sm font-medium mb-1 text-white">
                        {displayLabel}
                    </Label>
                    <div className="flex flex-col space-y-2">
                        <Textarea
                            id="conditional-input"
                            ref={textareaRef}
                            value={conditionalText}
                            onChange={handleConditionalChange}
                            onKeyDown={handleConditionalKeyDown}
                            placeholder="Type additional details here..."
                            className="min-h-[80px] max-h-[120px] resize-none bg-[#2a2a2a] dark:bg-[#2a2a2a] border-[#444444] dark:border-[#444444] text-white placeholder:text-gray-400"
                            disabled={disabled}
                        />
                        <p className="text-xs text-gray-400 dark:text-gray-400 text-center">
                            Press Enter to submit or Shift+Enter for a new line
                        </p>
                        <Button
                            onClick={handleConditionalSubmit}
                            disabled={disabled}
                            className="w-full sticky bottom-0 bg-blue-600 hover:bg-blue-700 text-white"
                            type="submit"
                        >
                            Submit Details
                        </Button>
                    </div>
                </div>
            )}

            {!hideMainInput && !showConfirmButton && (
                <div className="flex items-center space-x-2">
                    <Input
                        ref={inputRef}
                        value={message}
                        onChange={handleMessageChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={isMainInputDisabled}
                        className="flex-1 bg-[#2a2a2a] dark:bg-[#2a2a2a] border-[#444444] dark:border-[#444444] text-white placeholder:text-gray-400"
                    />
                    <Button
                        onClick={handleSendMessage}
                        disabled={isMainInputDisabled || !message.trim()}
                        size="icon"
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>
            )}
        </div>
    )
}

