"use client";

import {
  useState,
  useRef,
  useEffect,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";

export type InputMode = "text" | "buttons" | "conditionalText";

interface ChatInputProps {
  onSendText: (text: string) => void;
  onConditionalTextChange?: (text: string) => void;
  isConditionalVisible?: boolean;
  conditionalLabel?: string;
  conditionalText?: string;
  disabled?: boolean;
  inputMode: InputMode;
  placeholder?: string;
  className?: string;
  onSendMessage?: (message: string) => void;
  conditionalTextVisible?: boolean;
  setConditionalText?: (text: string) => void;
  onConditionalTextSubmit?: () => void;
  currentQuestionIndex?: number | null;
  conditionalTextInputLabel?: string;
  showConfirmButton?: boolean;
  onConfirmLanguages?: () => void;
  confirmOptionText?: string;
  onSkipQuestion?: () => void;
  conditionalAction?: { skipText?: string };
  isGenerating?: boolean;
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
  onConfirmLanguages,
  confirmOptionText,
  onSkipQuestion,
  conditionalAction,
  isGenerating,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Variable declarations - moved up before they're used in useEffect
  const showConditionalInput = conditionalTextVisible || isConditionalVisible;
  const hideMainInput = showConditionalInput && inputMode === "conditionalText";
  const isMainInputDisabled =
    disabled ||
    (inputMode === "buttons" && !showConditionalInput) ||
    (inputMode === "conditionalText" && !conditionalTextVisible);
  const displayLabel = conditionalTextInputLabel || conditionalLabel;

  // Effect to focus main input when appropriate
  useEffect(() => {
    let focusTimeoutId: NodeJS.Timeout | null = null;

    console.log("Input focus effect", { disabled, showConditionalInput, inputMode });
    if (!disabled && !showConditionalInput && inputRef.current) {
      // Short delay to ensure the element is fully rendered and state is settled
      focusTimeoutId = setTimeout(() => {
        if (inputRef.current && document.body.contains(inputRef.current)) {
          console.log("Focusing input field");
          inputRef.current.focus();
        }
      }, 100);
    }

    // Cleanup function to prevent focus attempts on unmounted components
    return () => {
      if (focusTimeoutId) {
        clearTimeout(focusTimeoutId);
        focusTimeoutId = null;
      }
    };
  }, [disabled, inputMode, showConditionalInput]);

  // Add an explicit effect that runs when disabled changes from true to false
  useEffect(() => {
    let focusTimeoutId: NodeJS.Timeout | null = null;

    if (!disabled && inputRef.current && !showConditionalInput) {
      console.log("disabled changed to false, focusing input");
      focusTimeoutId = setTimeout(() => {
        if (inputRef.current && document.body.contains(inputRef.current)) {
          inputRef.current.focus();
        }
      }, 150);
    }

    // Cleanup timeout on unmount
    return () => {
      if (focusTimeoutId) {
        clearTimeout(focusTimeoutId);
        focusTimeoutId = null;
      }
    };
  }, [disabled, showConditionalInput]);

  // Update the useEffect for conditional text focus
  useEffect(() => {
    let focusTimeoutId: NodeJS.Timeout | null = null;

    if (showConditionalInput && !disabled && textareaRef.current) {
      // Short delay to ensure the element is fully rendered
      focusTimeoutId = setTimeout(() => {
        if (textareaRef.current && document.body.contains(textareaRef.current)) {
          textareaRef.current.focus();
          // Place cursor at the end of existing text
          const length = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(length, length);
        }
      }, 50);
    }

    // Cleanup timeout on unmount
    return () => {
      if (focusTimeoutId) {
        clearTimeout(focusTimeoutId);
        focusTimeoutId = null;
      }
    };
  }, [showConditionalInput, disabled, conditionalText]);

  // Add an effect to handle focus changes when input mode changes
  useEffect(() => {
    let focusTimeoutId: NodeJS.Timeout | null = null;

    if (showConditionalInput && !disabled && textareaRef.current) {
      focusTimeoutId = setTimeout(() => {
        if (textareaRef.current && document.body.contains(textareaRef.current)) {
          textareaRef.current.focus();
        }
      }, 50);
    } else if (
      !showConditionalInput &&
      !disabled &&
      !hideMainInput &&
      inputRef.current
    ) {
      focusTimeoutId = setTimeout(() => {
        if (inputRef.current && document.body.contains(inputRef.current)) {
          inputRef.current.focus();
        }
      }, 50);
    }

    // Cleanup timeout on unmount
    return () => {
      if (focusTimeoutId) {
        clearTimeout(focusTimeoutId);
        focusTimeoutId = null;
      }
    };
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
      window.addEventListener("keydown", handleGlobalKeyDown);
      return () => window.removeEventListener("keydown", handleGlobalKeyDown);
    }
  }, [showConfirmButton, disabled, onConfirmLanguages]);

  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleConditionalChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onConditionalTextChange?.(e.target.value);
    setConditionalText?.(e.target.value);
  };

  const handleSendMessage = () => {
    // Allow empty message for optional fields (determined by currentQuestionIndex)
    // Optional fields are: GitHub (2), Telegram (3), Twitter/X (4), Portfolio (12), Additional Skills (13)
    const isOptionalField =
      currentQuestionIndex === 2 ||
      currentQuestionIndex === 3 ||
      currentQuestionIndex === 4 ||
      currentQuestionIndex === 12 ||
      currentQuestionIndex === 13;

    console.log("handleSendMessage called", { disabled, message, isOptionalField, currentQuestionIndex });

    // First check if we have callbacks to send the message
    if (!onSendMessage && !onSendText) {
      console.error("Cannot send message - no callback handlers available");
      return;
    }

    // Only send 'none' if the field is truly empty, otherwise send the actual value
    if (!disabled && (message.trim() || isOptionalField)) {
      const valueToSend = message.trim()
        ? message.trim()
        : isOptionalField
          ? "none"
          : "";
      console.log("Sending message", { valueToSend, onSendMessage: !!onSendMessage, onSendText: !!onSendText });
      if (onSendMessage) {
        onSendMessage(valueToSend);
      } else {
        onSendText(valueToSend);
      }
      setMessage("");
    } else {
      console.log("Message not sent due to conditions not met");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Calculate isOptionalField here to match handleSendMessage
    const isOptionalField =
      currentQuestionIndex === 2 ||
      currentQuestionIndex === 3 ||
      currentQuestionIndex === 4 ||
      currentQuestionIndex === 12 ||
      currentQuestionIndex === 13;

    console.log("Enter key pressed", { disabled, message, inputMode, currentQuestionIndex, onSendMessage: !!onSendMessage, onSendText: !!onSendText });
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("Enter key handling", { willSend: !disabled && (message.trim() || isOptionalField) });

      // Check if callbacks exist before attempting to send
      if (!disabled && (message.trim() || isOptionalField)) {
        if (typeof onSendMessage === 'function' || typeof onSendText === 'function') {
          handleSendMessage();
        } else {
          console.error("No send handlers available for Enter key press");
        }
      }
    }
  };

  const handleConditionalSubmit = () => {
    if (onConditionalTextSubmit) {
      onConditionalTextSubmit();
    }
  };

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
    } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && !disabled) {
      e.preventDefault();
      handleConditionalSubmit();
    }
  };

  return (
    <div
      className={`p-4 bg-[#1a1a1a] dark:bg-[#1a1a1a] z-10 ${className}`}
    >
      {showConfirmButton && (
        <div className="mb-4">
          <Button
            onClick={onConfirmLanguages}
            disabled={disabled}
            className="w-full bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff]"
          >
            {confirmOptionText || "Confirm Selection (or press Enter)"}
          </Button>
        </div>
      )}

      {showConditionalInput && (
        <div className="mb-4 max-h-[150px] overflow-y-auto bg-[#232b3a] border border-[#444] rounded-xl p-4 flex flex-col gap-3 shadow-lg">
          <Label
            htmlFor="conditional-input"
            className="block text-sm font-medium mb-1 text-white"
          >
            {displayLabel}
          </Label>
          <Textarea
            id="conditional-input"
            ref={textareaRef}
            value={conditionalText}
            onChange={handleConditionalChange}
            onKeyDown={handleConditionalKeyDown}
            placeholder="Type additional details here..."
            className="min-h-[80px] max-h-[120px] resize-none bg-[#2a2a2a] dark:bg-[#2a2a2a] border-[#444444] dark:border-[#444444] text-white placeholder:text-gray-400 mb-2"
            disabled={disabled || !conditionalTextVisible}
          />
          <p className="text-xs text-gray-400 dark:text-gray-400 text-center mb-2">
            Press Enter to submit or Shift+Enter for a new line
          </p>
          <Button
            onClick={handleConditionalSubmit}
            disabled={disabled}
            className="w-full bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff] mt-2"
            type="submit"
          >
            Submit Details
          </Button>
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
            disabled={!message.trim() || isGenerating}
            size="icon"
            type="submit"
            className="bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff]"
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      )}

      {onSkipQuestion && (
        <Button
          className="w-full sticky bottom-0 bg-[#1a2b4a] hover:bg-[#213459] text-[#6bbbff]"
          onClick={onSkipQuestion}
        >
          {conditionalAction?.skipText || "Skip this Question"}
        </Button>
      )}
    </div>
  );
}
