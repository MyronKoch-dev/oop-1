"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  X,
  ExternalLink,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    description?: string;
  };
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const resourceNavItems: NavItem[] = [
  // Moved from tools section
  {
    href: "https://app.testnet.andromedaprotocol.io/flex-builder",
    label: "Testnet ADO Builder",
    icon: <></>,
  },
  {
    href: "https://app.testnet.andromedaprotocol.io/app-builder",
    label: "Testnet App Builder",
    icon: <></>,
  },
  {
    href: "https://andromeda-testnet-faucet.vercel.app/",
    label: "ANDR Faucet",
    icon: <></>,
  },
  // Original resources
  {
    href: "https://docs.andromedaprotocol.io/andromeda",
    label: "Developer Docs",
    icon: <></>,
  },
  {
    href: "https://docs.andromedaprotocol.io/guides",
    label: "Guides",
    icon: <></>,
  },
  {
    href: "https://docs.google.com/document/d/11VOKvuXkUryZ5p733af6h0Qgrg0bGl41E9i32QXgLos/edit?usp=sharing",
    label: "ADO Submission FAQ",
    icon: <></>,
  },
  {
    href: "https://andromedaprotocol.io",
    label: "Visit our website",
    icon: <></>,
  },
];



// Agent bots items
const agentBots: NavItem[] = [
  {
    href: "https://myronkoch-dev.github.io/AndrDocsBot/",
    label: "Docs Bot",
    icon: <></>,
  },
  {
    href: "https://myronkoch-dev.github.io/AndrDocsBot/",
    label: "Artist-bot",
    icon: <></>,
  },
  {
    href: "https://myronkoch-dev.github.io/AndrDocsBot/",
    label: "Community Catalyst bot",
    icon: <></>,
  },
  {
    href: "https://myronkoch-dev.github.io/AndrDocsBot/",
    label: "Dev Advocate bot",
    icon: <></>,
  },
  {
    href: "https://myronkoch-dev.github.io/AndrDocsBot/",
    label: "Ecosystem Explorer bot",
    icon: <></>,
  },
  {
    href: "https://myronkoch-dev.github.io/AndrDocsBot/",
    label: "Cosmos Helper bot",
    icon: <></>,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  // Close sidebar on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // State variables for collapsible sections with original logic
  const [showResources, setShowResources] = useState(() =>
    resourceNavItems.some((item) => item.href === pathname),
  );
  const [showAgent, setShowAgent] = useState(false);

  // Open the section containing the current path on mount
  useEffect(() => {
    if (resourceNavItems.some((item) => item.href === pathname))
      setShowResources(true);
    // If you have agent bots with real links, do the same for showAgent
  }, [pathname]);

  return (
    <>
      {/* Overlay - only visible on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "sidebar fixed top-0 left-0 h-full w-64 bg-[#121212] z-40 transition-transform duration-300 ease-in-out transform shadow-xl overflow-y-auto flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0 lg:shadow-none", // Always show on large screens
        )}
      >
        <div className="logo flex items-center gap-3 px-4 py-5 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <img
              src="https://avatars.githubusercontent.com/u/86694044?s=200&v=4"
              width="32"
              height="32"
              alt="Andromeda Logo"
              className="rounded-full"
            />
            <span className="text-white font-medium text-lg">Andromeda</span>
          </Link>

          {/* Close button - only visible on mobile */}
          <button
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-2 py-2 flex-1 overflow-y-auto">
          {/* Resources section (collapsible) */}
          <div className="mt-4">
            <button
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-wider focus:outline-none text-white"
              onClick={() => setShowResources((open) => !open)}
              aria-expanded={showResources}
              aria-controls="sidebar-resources-section"
              tabIndex={0}
            >
              Resources
              {showResources ? (
                <ChevronDown className="w-4 h-4 ml-auto" />
              ) : (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </button>
            <div
              id="sidebar-resources-section"
              className={`transition-all duration-400 ease-[cubic-bezier(.4,0,.2,1)] overflow-hidden
                                ${showResources ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
            >
              {resourceNavItems.map((item, index) => {
                const isActive = item.href === pathname;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className={`nav-item flex items-center gap-3 px-4 py-3
                                            transition-all duration-400 ease-[cubic-bezier(.4,0,.2,1)] rounded-md
                                            hover:bg-[#232323] hover:text-white hover:scale-105 hover:opacity-90 hover:translate-x-1
                                            ${isActive ? "bg-[#232323] text-white" : "text-gray-300"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ExternalLink className="ml-auto w-4 h-4 opacity-50" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Command Center Link */}
          <div className="mt-4">
            <a
              href="/contractors"
              className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-wider text-white hover:bg-[#232323] rounded-md transition-colors"
            >
              Command Center
            </a>
          </div>
        </nav>

        {/* Agents section at bottom */}
        <div className="mt-4 px-4">
          <button
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-wider focus:outline-none text-white"
            onClick={() => setShowAgent((open) => !open)}
            aria-expanded={showAgent}
            aria-controls="sidebar-agent-section"
            tabIndex={0}
          >
            Agents
            {showAgent ? (
              <ChevronDown className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronRight className="w-4 h-4 ml-auto" />
            )}
          </button>
          <div
            id="sidebar-agent-section"
            className={`px-4 space-y-3 mt-2 transition-all duration-400 ease-[cubic-bezier(.4,0,.2,1)] overflow-hidden
                                ${showAgent ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}
          >
            {agentBots.map((item, index) => (
              <div
                key={`agent-${index}`}
                className={`relative block w-full inline-flex items-center justify-start gap-2 px-4 py-2 bg-[#202020] text-gray-500 rounded-md cursor-not-allowed opacity-60`}
                aria-label={`${item.label} - coming soon`}
                role="button"
                aria-disabled="true"
                tabIndex={0}
              >
                {item.icon}
                <span>{item.label}</span>
                <span
                  className="absolute top-0 right-0 bg-gray-700 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-bl-md rounded-tr-md"
                  aria-hidden="true"
                >
                  Soon
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Spacer that doesn't reach edges */}
        <div className="mx-4 my-4 border-t border-[#2a2a2a] flex-shrink-0"></div>

        {/* App version at bottom */}
        <div className="px-8 py-4 flex-shrink-0">
          <span className="text-gray-400 text-sm">Andromeda App 1.5.0</span>
        </div>
      </div>
    </>
  );
}
