// src/components/chat/chat-messages.tsx
"use client"

import { useEffect, useRef, type RefObject } from "react"
import { Avatar } from "@/components/ui/avatar" // Assuming Shadcn setup created this
import { Button } from "@/components/ui/button" // Assuming Shadcn setup created this
import { Card } from "@/components/ui/card"     // Assuming Shadcn setup created this
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming Shadcn setup created this
import { Bot, User, ExternalLink } from "lucide-react" // Ensure lucide-react is installed
import React from "react"

// Interface for a message option/button
interface MessageOption {
    id?: string;
    label: string;
    value: string;
    disabledReason?: string;
    highlight?: boolean;
}

// Defines the structure for a single message in the chat history
export interface ChatMessage {
    id: string // Unique ID for React keys
    role: "user" | "assistant" | "system" // Added system for errors/info
    content: string
    options?: MessageOption[] // Optional buttons for assistant messages
    isLoading?: boolean // Flag for loading state (e.g., "Thinking...")
    url?: string // URL to be displayed as a clickable link
}

// Defines the props expected by the ChatMessages component
interface ChatMessagesProps {
    messages: ChatMessage[] // Array of messages to display
    onButtonClick: (value: string) => void // Callback when a message button is clicked
    selectedButtonValue?: string | null // Optional: Track which button was selected (if needed for styling)
    className?: string // Optional additional CSS classes
    messagesEndRef?: RefObject<HTMLDivElement | null> // Optional ref passed from parent for scrolling
    latestInteractiveMessageId?: string | null // ID of the most recent message with options
    highlightedButtonIndex?: number | null // Index of button to highlight (for keyboard shortcut feedback)
    multiSelectedLanguages?: string[] // Array of selected language values for Question 4
    currentQuestionIndex?: number | null // Current question index for context-specific behavior
}

// Function to render message content with clickable links
const renderMessageContent = (content: string) => {
    if (!content) return null;

    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // If no URLs are found, just return the content
    if (!content.match(urlRegex)) {
        return <div className="whitespace-pre-line">{content}</div>;
    }

    // Split the content by URLs and map over the parts
    const parts = content.split(urlRegex);
    const matches = content.match(urlRegex) || [];

    return (
        <div className="whitespace-pre-line">
            {parts.map((part, index) => {
                // For even indices, these are the text parts
                if (index % 2 === 0) {
                    return <span key={index}>{part}</span>;
                }
                // For odd indices, these should be URLs, but we need to check the matches array
                const matchIndex = Math.floor(index / 2);
                if (matchIndex < matches.length) {
                    const url = matches[matchIndex];
                    return (
                        <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline break-all"
                        >
                            {url}
                        </a>
                    );
                }
                // Fallback, though this should never happen
                return <span key={index}>{part}</span>;
            })}
        </div>
    );
};

export function ChatMessages({
    messages,
    onButtonClick,
    selectedButtonValue = null, // Default to null if not provided
    className = "",
    messagesEndRef, // Accept the potentially null-containing ref
    latestInteractiveMessageId = null, // Default to null if not provided
    highlightedButtonIndex = null, // Default to null if not provided
    multiSelectedLanguages = [], // Default to empty array if not provided
    currentQuestionIndex = null, // Default to null if not provided
}: ChatMessagesProps) {
    // Internal ref used only if messagesEndRef is not provided by the parent
    const internalScrollRef = useRef<HTMLDivElement>(null);
    // Use the ref passed from the parent if available, otherwise use the internal one
    const scrollRef = messagesEndRef || internalScrollRef;

    // Effect to scroll to the bottom whenever the messages array changes
    useEffect(() => {
        // Immediate scroll for initial load
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "auto" });
        }

        // Small delay to ensure scrolling works after DOM updates (especially for dynamic content)
        const timeoutId = setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [messages, scrollRef]);

    return (
        // Use Shadcn ScrollArea for the main message list container with dark theme
        <ScrollArea className={`h-full w-full p-4 bg-[#1a1a1a] dark:bg-[#1a1a1a] ${className}`}>
            <div className="space-y-4 pb-2">
                {/* Map over the messages array to render each message */}
                {messages.map((message) => (
                    <div
                        key={message.id} // Use unique message ID as key
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start" // Align user messages right, others left
                            }`}
                    >
                        <div
                            className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row" // Reverse layout for user messages
                                }`}
                        >
                            {/* Avatar for user/bot */}
                            <Avatar
                                className={`h-8 w-8 flex items-center justify-center ${message.role === "user" ? "bg-blue-500 dark:bg-blue-500" : "bg-[#2a2a2a] dark:bg-[#2a2a2a]" // Different background colors
                                    }`}
                            >
                                {message.role === "user" ? (
                                    <User className="h-4 w-4 text-white dark:text-white" />
                                ) : (
                                    <Bot className="h-4 w-4 text-white dark:text-white" />
                                )}
                            </Avatar>
                            {/* Container for message content and options */}
                            <div className="space-y-2">
                                <Card
                                    className={`p-3 ${message.role === "user" ? "bg-[#1a2b4a] text-[#6bbbff]" : "bg-[#2a2a2a] dark:bg-[#2a2a2a] text-white" // Different card styles
                                        } ${message.isLoading ? "animate-pulse" : ""}`} // Add pulse animation if loading
                                >
                                    {/* Display message content with clickable links */}
                                    {renderMessageContent(message.content)}

                                    {/* Render URL as a button if present */}
                                    {message.url && (
                                        <div className="mt-4">
                                            <button
                                                onClick={() => window.open(message.url, "_blank")}
                                                className="w-full flex items-center justify-center gap-2 bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff]"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Get Started
                                            </button>
                                        </div>
                                    )}
                                </Card>

                                {/* Render buttons if options are provided for an assistant message */}
                                {message.role === 'assistant' && message.options && message.options.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {message.options.map((option, index) => {
                                            // Determine if this message has the latest interactive options
                                            const isActiveMessage = message.id === latestInteractiveMessageId;

                                            // Special handling for Question 5 (Languages)
                                            const isLanguageQuestion = currentQuestionIndex === 5 && isActiveMessage;

                                            // For Q5, a button is "selected" if it's in the multiSelectedLanguages array
                                            const isSelected = isLanguageQuestion
                                                ? multiSelectedLanguages.includes(option.value)
                                                : selectedButtonValue === option.value;

                                            // Button disabled state depends on the question type
                                            // For Q5 (multi-select), buttons remain enabled until submission
                                            // For other questions, disable all buttons once any is selected
                                            const isDisabled = isLanguageQuestion
                                                ? false // Never disable for multi-select question
                                                : !isActiveMessage || (isActiveMessage && selectedButtonValue !== null);

                                            // Styling classes for disabled buttons
                                            const disabledClasses = !isActiveMessage ? "opacity-70 cursor-not-allowed" : "";

                                            // Check if this button is currently highlighted via keyboard
                                            const isHighlighted = isActiveMessage &&
                                                highlightedButtonIndex === index;

                                            // Apply highlight style if this button is being pressed via keyboard
                                            const highlightClasses = isHighlighted ? "ring-2 ring-offset-1 ring-blue-500" : "";

                                            return (
                                                <Button
                                                    key={option.value}
                                                    variant={isSelected ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => onButtonClick(option.value)}
                                                    disabled={isDisabled}
                                                    className={`text-left h-auto py-1.5 ${isSelected ? "bg-[#1a2b4a] text-[#6bbbff]" : "bg-[#2a2a2a] dark:bg-[#2a2a2a] border-[#444444] dark:border-[#444444] text-white hover:bg-[#333333] hover:text-white"} ${disabledClasses} ${highlightClasses}`}
                                                >
                                                    {option.label}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {/* Empty div at the end to attach the scroll ref */}
                <div ref={scrollRef} className="h-4 w-full" /> {/* Add min-height to ensure scrolling */}
            </div>
        </ScrollArea>
    );
}