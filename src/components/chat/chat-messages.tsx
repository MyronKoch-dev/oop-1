// src/components/chat/chat-messages.tsx
"use client";

import { useEffect, useRef, type RefObject } from "react";
import { Avatar } from "@/components/ui/avatar"; // Assuming Shadcn setup created this
import { Button } from "@/components/ui/button"; // Assuming Shadcn setup created this
import { Card } from "@/components/ui/card"; // Assuming Shadcn setup created this
import { ScrollArea } from "@/components/ui/scroll-area"; // Assuming Shadcn setup created this
import { ExternalLink } from "lucide-react"; // Ensure lucide-react is installed
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
    recommendedPathDescription?: string; // New
    secondRecommendedPath?: string;
    secondRecommendedPathUrl?: string;
    secondRecommendedPathDescription?: string; // New
  } | null;
  saveRetryNeeded?: boolean; // Flag to indicate if database save needs to be retried
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
  userName?: string; // Add userName prop for personalization
  onRetrySave?: () => void; // Callback to retry saving data to database
  multiSelectAnswers?: { [key: number]: string[] }; // Track multi-select answers
  currentQuestionIndex?: number | null; // Current question index
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
  userName,
  conditionalInputOpen = false, // NEW: pass this from parent
  onRetrySave, // Pass the onRetrySave callback
  multiSelectAnswers, // Pass the multiSelectAnswers prop
  currentQuestionIndex, // Pass the currentQuestionIndex prop
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
    <div className="relative h-full w-full">
      {/* Top fade gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#1a1a1a] to-transparent z-10 pointer-events-none" />

      {/* Use Shadcn ScrollArea for the main message list container with dark theme */}
      <ScrollArea
        className={`h-full w-full px-8 py-4 bg-[#1a1a1a] dark:bg-[#1a1a1a] ${className}`}
      >
        <div className="space-y-4 pb-2 w-full pt-4">
          {/* Map over the messages array to render each message */}
          {messages.map((message) => {
            return (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} w-full`}
              >
                <div
                  className={`flex gap-3 max-w-[70%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar only for assistant messages */}
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex items-center justify-center bg-[#2a2a2a] dark:bg-[#2a2a2a]">
                      <img
                        src="https://avatars.githubusercontent.com/u/86694044?s=200&v=4"
                        alt="Andromeda Bot"
                        className="h-6 w-6 rounded-full bg-[#232323]"
                      />
                    </Avatar>
                  )}
                  <div className="space-y-2 w-full">
                    {/* Always render as a regular card now */}
                    {true && (
                      // Render error/warning messages in red if they match known patterns
                      <Card
                        className={`p-3 border-none ${
                          message.role === "assistant" &&
                          (message.content
                            .toLowerCase()
                            .includes("please provide a valid") ||
                            message.content.toLowerCase().includes("error") ||
                            message.content
                              .toLowerCase()
                              .includes("required") ||
                            message.content.toLowerCase().includes("sorry"))
                            ? "bg-red-900/80 text-red-200" // Red style for warnings/errors
                            : message.role === "user"
                              ? "bg-[#1a2b4a] text-[#6bbbff]"
                              : "bg-[#2a2a2a] dark:bg-[#2a2a2a] text-white"
                        } ${message.isLoading ? "animate-pulse" : ""}`}
                      >
                        {/* Display message content with clickable links and name replacement - hide if finalResult exists */}
                        {!message.finalResult &&
                          renderMessageContent(
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

                        {/* Add retry button for database save errors */}
                        {message.saveRetryNeeded && onRetrySave && (
                          <div className="mt-3">
                            <Button
                              onClick={onRetrySave}
                              variant="default"
                              className="bg-blue-600 hover:bg-blue-700 text-white border-none"
                            >
                              Retry Saving Your Data
                            </Button>
                            <p className="text-sm mt-2 text-gray-400">
                              We had trouble saving your data, but your session
                              is still active. Click the button above to try
                              again.
                            </p>
                          </div>
                        )}

                        {/* Render the RecommendationPanel directly inside the chat bubble if finalResult exists */}
                        {message.finalResult && (
                          <RecommendationPanel
                            pathName={message.finalResult?.recommendedPath}
                            pathDescription={
                              message.finalResult?.recommendedPathDescription
                            }
                            pathLink={
                              message.finalResult?.recommendedPath ===
                              "Ambassador"
                                ? "/ambassador"
                                : undefined
                            }
                            secondPathName={
                              message.finalResult?.secondRecommendedPath
                            }
                            secondPathDescription={
                              message.finalResult
                                ?.secondRecommendedPathDescription
                            }
                            userName={userName}
                            appUrl="https://app.testnet.andromedaprotocol.io"
                            goToAppButtonText="Explore Andromeda Platform"
                            onGetStarted={() => {
                              console.log(
                                `Opening primary path URL: ${message.finalResult?.recommendedPathUrl}`,
                              );
                              // Check if URL is absolute or relative
                              const primaryUrl =
                                message.finalResult?.recommendedPathUrl || "";
                              if (primaryUrl.startsWith("http")) {
                                window.open(primaryUrl, "_blank");
                              } else {
                                // For relative URLs, navigate within the application
                                window.location.href = primaryUrl;
                              }
                            }}
                            onSecondPathSelected={
                              message.finalResult?.secondRecommendedPath
                                ? () => {
                                    const secondaryPathName =
                                      message.finalResult
                                        ?.secondRecommendedPath;
                                    let targetUrl =
                                      message.finalResult
                                        ?.secondRecommendedPathUrl || "";

                                    // Determine the correct internal route based on the path name
                                    switch (secondaryPathName) {
                                      case "Ambassador":
                                        targetUrl = "/ambassador";
                                        break;
                                      case "Visionaries":
                                        targetUrl = "/visionaries";
                                        break;
                                      case "Hackers":
                                        targetUrl = "/hackers";
                                        break;
                                      case "Contractors":
                                        targetUrl = "/contractors";
                                        break;
                                      case "Explorer":
                                        targetUrl = "/explorer";
                                        break;
                                      case "AI Navigators":
                                        targetUrl = "/ai-navigators";
                                        break;
                                      // If it's not a known internal path, use the provided URL and check if external
                                      default:
                                        if (targetUrl.startsWith("http")) {
                                          window.open(targetUrl, "_blank");
                                          return; // Exit the function after opening external link
                                        }
                                        // If it's not a known path and not an external URL, assume it's a relative internal path
                                        break;
                                    }

                                    console.log(
                                      `Navigating to secondary path: ${targetUrl}`,
                                    );
                                    // Navigate within the application for internal routes
                                    window.location.href = targetUrl;
                                  }
                                : undefined
                            }
                          />
                        )}

                        {/* Render buttons inside the chat bubble if options are provided for an assistant message */}
                        {message.role === "assistant" &&
                          message.options &&
                          message.options.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {message.options.map((option, index) => {
                                // Determine if this message has the latest interactive options
                                const isActiveMessage =
                                  message.id === latestInteractiveMessageId;

                                // Disable all buttons if conditional input is open
                                const isDisabled =
                                  conditionalInputOpen ||
                                  !isActiveMessage ||
                                  (isActiveMessage &&
                                    selectedButtonValue !== null);

                                // Check if this button is currently selected
                                // Use multiSelectAnswers only if currentQuestionIndex is a number
                                const selectedValues =
                                  typeof currentQuestionIndex === "number" &&
                                  multiSelectAnswers
                                    ? multiSelectAnswers[
                                        currentQuestionIndex
                                      ] || []
                                    : [];

                                const isSelected =
                                  selectedButtonValue === option.value || // Single select
                                  selectedValues.includes(option.value); // Multi select

                                // Check if this button is currently highlighted via keyboard
                                const isHighlighted =
                                  isActiveMessage &&
                                  highlightedButtonIndex === index;

                                // Apply highlight style if this button is being pressed via keyboard
                                const highlightClasses = isHighlighted
                                  ? "ring-2 ring-offset-1 ring-blue-400"
                                  : "";

                                // Apply selected style for visual feedback
                                const selectedClasses = isSelected
                                  ? "bg-[#a4a4a4] border-[#949494]" // Darker shade when selected
                                  : "bg-[#d4d4d4] border-[#b4b4b4]"; // Normal #d4d4d4 when not selected

                                return (
                                  <Button
                                    key={option.value}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onButtonClick(option.value)}
                                    disabled={isDisabled}
                                    className={`
                                      rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200
                                      ${selectedClasses} text-gray-800 hover:bg-[#c4c4c4]
                                      ${highlightClasses}
                                      flex items-center gap-2
                                    `}
                                  >
                                    <span
                                      className={`
                                      w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold border-2 shadow-sm
                                      bg-white text-gray-800 border-[#b4b4b4]
                                    `}
                                    >
                                      {option.label.match(/^\d+/)
                                        ? option.label.match(/^\d+/)?.[0]
                                        : index + 1}
                                    </span>
                                    {option.label.replace(/^\d+\.\s*/, "")}
                                  </Button>
                                );
                              })}
                            </div>
                          )}
                      </Card>
                    )}
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
    </div>
  );
}
