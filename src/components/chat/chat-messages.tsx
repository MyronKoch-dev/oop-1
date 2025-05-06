// src/components/chat/chat-messages.tsx
"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Avatar } from "@/components/ui/avatar"; // Assuming Shadcn setup created this
import { Button } from "@/components/ui/button"; // Assuming Shadcn setup created this
import { Card } from "@/components/ui/card"; // Assuming Shadcn setup created this
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming Shadcn setup created this
import { User, ExternalLink } from "lucide-react"; // Ensure lucide-react is installed
import React from "react";
import RecommendationPanel from "../cards/RecommendationPanel";

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
  id: string; // Unique ID for React keys
  role: "user" | "assistant" | "system"; // Added system for errors/info
  content: string;
  options?: MessageOption[]; // Optional buttons for assistant messages
  isLoading?: boolean; // Flag for loading state (e.g., "Thinking...")
  url?: string; // URL to be displayed as a clickable link
  finalResult?: {
    recommendedPath: string;
    recommendedPathUrl: string;
    secondRecommendedPath?: string;
    secondRecommendedPathUrl?: string;
  } | null;
}

// Defines the props expected by the ChatMessages component
interface ChatMessagesProps {
  messages: ChatMessage[]; // Array of messages to display
  onButtonClick: (value: string) => void; // Callback when a message button is clicked
  selectedButtonValue?: string | null; // Optional: Track which button was selected (if needed for styling)
  className?: string; // Optional additional CSS classes
  messagesEndRef?: RefObject<HTMLDivElement | null>; // Optional ref passed from parent for scrolling
  latestInteractiveMessageId?: string | null; // ID of the most recent message with options
  highlightedButtonIndex?: number | null; // Index of button to highlight (for keyboard shortcut feedback)
  multiSelectAnswers?: { [key: number]: string[] }; // New: all multi-select answers by question index
  currentQuestionIndex?: number | null; // Current question index for context-specific behavior
  userName?: string; // Add userName prop for personalization
}

// Function to render message content with clickable links
const renderMessageContent = (content: string, userName?: string) => {
  if (!content) return null;
  // Replace {name} with userName if provided
  const personalizedContent = userName
    ? content.replace(/\{name\}/g, userName)
    : content;
  // Regular expression to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  // If no URLs are found, just return the content
  if (!personalizedContent.match(urlRegex)) {
    return <div className="whitespace-pre-line">{personalizedContent}</div>;
  }
  // Split the content by URLs and map over the parts
  const parts = personalizedContent.split(urlRegex);
  const matches = personalizedContent.match(urlRegex) || [];
  return (
    <div className="whitespace-pre-line">
      {parts.map((part, index) => {
        if (index % 2 === 0) {
          return <span key={index}>{part}</span>;
        }
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
  multiSelectAnswers = {}, // Default to empty object if not provided
  currentQuestionIndex = null, // Default to null if not provided
  userName,
  conditionalInputOpen = false, // NEW: pass this from parent
}: ChatMessagesProps & { conditionalInputOpen?: boolean }) {
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

  // Disable number key shortcuts when conditional input is open
  useEffect(() => {
    if (conditionalInputOpen) return;
    // ... existing keyboard shortcut logic ...
  }, [conditionalInputOpen /*, other deps as before */]);

  return (
    // Use Shadcn ScrollArea for the main message list container with dark theme
    <ScrollArea
      className={`h-full w-full p-4 bg-[#1a1a1a] dark:bg-[#1a1a1a] ${className}`}
    >
      <div className="space-y-4 pb-2">
        {/* Map over the messages array to render each message */}
        {messages.map((message, idx) => {
          const isInitialAssistantMessage =
            idx === 0 && message.role === "assistant";
          return (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex gap-3 max-w-[85%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar for user/bot */}
                <Avatar
                  className={`h-8 w-8 flex items-center justify-center ${message.role === "user" ? "bg-blue-500 dark:bg-blue-500" : "bg-[#2a2a2a] dark:bg-[#2a2a2a]"}`}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4 text-white dark:text-white" />
                  ) : (
                    <img
                      src="https://avatars.githubusercontent.com/u/86694044?s=200&v=4"
                      alt="Andromeda Bot"
                      className="h-6 w-6 rounded-full bg-[#232323]"
                    />
                  )}
                </Avatar>
                <div className="space-y-2 w-full">
                  {isInitialAssistantMessage ? (
                    <div className="p-6 bg-gradient-to-br from-[#1a2b4a] to-[#213459] rounded-xl shadow-lg text-center text-white border border-[#333333]">
                      <h2 className="text-2xl font-bold mb-2">
                        🌟 Welcome to Andromeda! 🌟
                      </h2>
                      <p className="text-lg mb-4">
                        I&apos;m your Onboarding Assistant, here to help you get
                        started.
                        <br />
                        <br />
                        I&apos;ll ask a few quick questions to learn about your
                        background and interests.
                        <br />
                        <br />
                        Once I understand what you&apos;re looking for,
                        I&apos;ll point you directly to the right spot in our
                        community!
                        <br />
                        <br />
                        <span className="text-xl font-semibold text-blue-400">
                          Ready to dive in? 🚀
                        </span>
                      </p>
                    </div>
                  ) : (
                    // Render error/warning messages in red if they match known patterns
                    <Card
                      className={`p-3 ${message.role === "assistant" &&
                        (message.content
                          .toLowerCase()
                          .includes("please provide a valid") ||
                          message.content.toLowerCase().includes("error") ||
                          message.content.toLowerCase().includes("required") ||
                          message.content.toLowerCase().includes("sorry"))
                        ? "bg-red-900/80 border-red-600 text-red-200" // Red style for warnings/errors
                        : message.role === "user"
                          ? "bg-[#1a2b4a] text-[#6bbbff]"
                          : "bg-[#2a2a2a] dark:bg-[#2a2a2a] text-white"
                        } ${message.isLoading ? "animate-pulse" : ""}`}
                    >
                      {/* Display message content with clickable links and name replacement */}
                      {renderMessageContent(
                        message.content,
                        message.role === "assistant" ? userName : undefined,
                      )}

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
                  )}

                  {/* Render buttons if options are provided for an assistant message */}
                  {message.role === "assistant" &&
                    message.options &&
                    message.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {message.options.map((option, index) => {
                          // Determine if this message has the latest interactive options
                          const isActiveMessage =
                            message.id === latestInteractiveMessageId;

                          // Use selectedValues only if currentQuestionIndex is a number
                          const selectedValues =
                            typeof currentQuestionIndex === "number"
                              ? multiSelectAnswers[currentQuestionIndex] || []
                              : [];
                          const isSelected = selectedValues.includes(
                            option.value,
                          );

                          // Disable all buttons if conditional input is open
                          const isDisabled =
                            conditionalInputOpen ||
                            !isActiveMessage ||
                            (isActiveMessage && selectedButtonValue !== null);

                          // Styling classes for disabled buttons
                          const disabledClasses = !isActiveMessage
                            ? "opacity-70 cursor-not-allowed"
                            : "";

                          // Check if this button is currently highlighted via keyboard
                          const isHighlighted =
                            isActiveMessage && highlightedButtonIndex === index;

                          // Apply highlight style if this button is being pressed via keyboard
                          const highlightClasses = isHighlighted
                            ? "ring-2 ring-offset-1 ring-blue-500"
                            : "";

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

                  {message.content === "__FINAL_RECOMMENDATION__" &&
                    message.finalResult != null ? (
                    (() => {
                      // Debug info to console
                      console.log("Recommended paths data:", {
                        primary: {
                          path: message.finalResult?.recommendedPath,
                          url: message.finalResult?.recommendedPathUrl
                        },
                        secondary: {
                          path: message.finalResult?.secondRecommendedPath,
                          url: message.finalResult?.secondRecommendedPathUrl
                        }
                      });

                      return (
                        <RecommendationPanel
                          pathName={message.finalResult?.recommendedPath}
                          secondPathName={message.finalResult?.secondRecommendedPath}
                          userName={userName}
                          onGetStarted={() => {
                            console.log(
                              `Opening primary path URL: ${message.finalResult?.recommendedPathUrl}`
                            );
                            // Check if URL is absolute or relative
                            const primaryUrl = message.finalResult?.recommendedPathUrl || '';
                            if (primaryUrl.startsWith('http')) {
                              window.open(primaryUrl, "_blank");
                            } else {
                              // For relative URLs, navigate within the application
                              window.location.href = primaryUrl;
                            }
                          }}
                          onSecondPathSelected={
                            message.finalResult?.secondRecommendedPathUrl
                              ? () => {
                                console.log(
                                  `Opening secondary path URL: ${message.finalResult?.secondRecommendedPathUrl}`
                                );
                                // Check if URL is absolute or relative
                                const secondaryUrl = message.finalResult?.secondRecommendedPathUrl || '';
                                if (secondaryUrl.startsWith('http')) {
                                  window.open(secondaryUrl, "_blank");
                                } else {
                                  // For relative URLs, navigate within the application
                                  window.location.href = secondaryUrl;
                                }
                              }
                              : undefined
                          }
                        />
                      );
                    })()
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
        {/* Empty div at the end to attach the scroll ref */}
        <div ref={scrollRef} className="h-4 w-full" />{" "}
        {/* Add min-height to ensure scrolling */}
      </div>
    </ScrollArea>
  );
}
