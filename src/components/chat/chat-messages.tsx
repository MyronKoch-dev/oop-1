// src/components/chat/chat-messages.tsx
"use client"

import { useEffect, useRef, type RefObject } from "react"
import { Avatar } from "@/components/ui/avatar" // Assuming Shadcn setup created this
import { Button } from "@/components/ui/button" // Assuming Shadcn setup created this
import { Card } from "@/components/ui/card"     // Assuming Shadcn setup created this
import { ScrollArea } from "@/components/ui/scroll-area" // Assuming Shadcn setup created this
import { Bot, User } from "lucide-react" // Ensure lucide-react is installed

// Defines the structure for a single message in the chat history
export interface ChatMessage {
    id: string // Unique ID for React keys
    role: "user" | "assistant" | "system" // Added system for errors/info
    content: string
    options?: Array<{ label: string; value: string }> // Optional buttons for assistant messages
    isLoading?: boolean // Flag for loading state (e.g., "Thinking...")
}

// Defines the props expected by the ChatMessages component
interface ChatMessagesProps {
    messages: ChatMessage[] // Array of messages to display
    onButtonClick: (value: string) => void // Callback when a message button is clicked
    selectedButtonValue?: string | null // Optional: Track which button was selected (if needed for styling)
    className?: string // Optional additional CSS classes
    // FIX: Changed RefObject<HTMLDivElement> to RefObject<HTMLDivElement | null>
    messagesEndRef?: RefObject<HTMLDivElement | null> // Optional ref passed from parent for scrolling
}

export function ChatMessages({
    messages,
    onButtonClick,
    selectedButtonValue = null, // Default to null if not provided
    className = "",
    messagesEndRef, // Accept the potentially null-containing ref
}: ChatMessagesProps) {
    // Internal ref used only if messagesEndRef is not provided by the parent
    const internalScrollRef = useRef<HTMLDivElement>(null);
    // Use the ref passed from the parent if available, otherwise use the internal one
    const scrollRef = messagesEndRef || internalScrollRef;

    // Effect to scroll to the bottom whenever the messages array changes
    useEffect(() => {
        // Check if the ref is attached to an element before scrolling
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
        // Dependency array ensures this runs when messages update or the ref itself changes
    }, [messages, scrollRef]);

    return (
        // Use Shadcn ScrollArea for the main message list container
        <ScrollArea className={`flex-1 p-4 ${className}`}>
            <div className="space-y-4">
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
                                className={`h-8 w-8 ${message.role === "user" ? "bg-primary" : "bg-muted" // Different background colors
                                    }`}
                            >
                                {message.role === "user" ? (
                                    <User className="h-4 w-4 text-primary-foreground" />
                                ) : (
                                    <Bot className="h-4 w-4 text-foreground" />
                                )}
                            </Avatar>
                            {/* Container for message content and options */}
                            <div className="space-y-2">
                                <Card
                                    className={`p-3 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground" // Different card styles
                                        } ${message.isLoading ? "animate-pulse" : ""}`} // Add pulse animation if loading
                                >
                                    {/* Display message content */}
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </Card>

                                {/* Render buttons if options are provided for an assistant message */}
                                {message.role === 'assistant' && message.options && message.options.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {message.options.map((option) => (
                                            <Button
                                                key={option.value}
                                                variant={selectedButtonValue === option.value ? "default" : "outline"} // Style selected button differently
                                                size="sm"
                                                onClick={() => onButtonClick(option.value)} // Call parent handler on click
                                                // Disable all buttons once one is selected (optional UX)
                                                disabled={selectedButtonValue !== null}
                                                className="text-left h-auto py-1.5" // Adjust button styling
                                            >
                                                {option.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {/* Empty div at the end to attach the scroll ref */}
                <div ref={scrollRef} />
            </div>
        </ScrollArea>
    );
}