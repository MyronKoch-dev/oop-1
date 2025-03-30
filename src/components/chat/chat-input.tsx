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

    const handleConditionalKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !disabled && conditionalText.trim()) {
            e.preventDefault()
            handleConditionalSubmit()
        }
        else if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !disabled && conditionalText.trim()) {
            e.preventDefault()
            handleConditionalSubmit()
        }
    }

    return (
        <div className={`border-t border-gray-200 p-4 bg-white z-10 ${className}`}>
            {showConfirmButton && (
                <div className="mb-4">
                    <Button
                        onClick={onConfirmLanguages}
                        disabled={disabled}
                        className="w-full"
                        variant="default"
                    >
                        Confirm Language Selections
                    </Button>
                    <p className="text-xs text-center text-muted-foreground mt-1">
                        Select multiple languages and click above to confirm
                    </p>
                </div>
            )}

            {showConditionalInput && (
                <div className="mb-4 max-h-[150px] overflow-y-auto">
                    <Label htmlFor="conditional-input" className="block text-sm font-medium mb-1">
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
                            className="min-h-[80px] max-h-[120px] resize-none"
                            disabled={disabled}
                        />
                        <p className="text-xs text-muted-foreground text-center">
                            Press Enter to submit or Shift+Enter for a new line
                        </p>
                        <Button
                            onClick={handleConditionalSubmit}
                            disabled={disabled || !conditionalText.trim()}
                            className="w-full sticky bottom-0"
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
                        className="flex-1"
                    />
                    <Button onClick={handleSendMessage} disabled={isMainInputDisabled || !message.trim()} size="icon" type="submit">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>
            )}
        </div>
    )
}

