"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
    Book,
    BookOpen,
    Sun,
    Layers,
    Command,
    HelpCircle,
    X,
    Youtube,
    ExternalLink,
    Briefcase,
    Target,
    Lightbulb,
    BrainCircuit,
    Award,
    Bot,
    Github,
    ChevronDown,
    ChevronRight
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { cn } from "@/lib/utils";

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

// Split navItems into tools and resources
const toolNavItems: NavItem[] = [
    {
        href: "https://app.testnet.andromedaprotocol.io/flex-builder",
        label: "Testnet ADO Builder",
        icon: <Layers className="w-5 h-5" />
    },
    {
        href: "https://app.testnet.andromedaprotocol.io/app-builder",
        label: "Testnet App Builder",
        icon: <Layers className="w-5 h-5" />
    },
    {
        href: "#",
        label: "Assistant",
        icon: <Bot className="w-5 h-5" />,
        badge: {
            text: "Soon",
            description: "Chrome Extension"
        }
    },
    {
        href: "https://app.testnet.andromedaprotocol.io/cli",
        label: "Install the CLI",
        icon: <Command className="w-5 h-5" />
    },
    {
        href: "https://github.com/andromedaprotocol/embeddable-marketplace-demo",
        label: "Install a Demo",
        icon: <Layers className="w-5 h-5" />
    },
    {
        href: "https://andromeda-testnet-faucet.vercel.app/",
        label: "ANDR Faucet",
        icon: <Sun className="w-5 h-5" />
    }
];

const resourceNavItems: NavItem[] = [
    {
        href: "https://docs.andromedaprotocol.io/andromeda",
        label: "Developer Docs",
        icon: <BookOpen className="w-5 h-5" />
    },
    {
        href: "https://docs.andromedaprotocol.io/guides",
        label: "Guides",
        icon: <Book className="w-5 h-5" />
    },
    {
        href: "https://docs.google.com/document/d/11VOKvuXkUryZ5p733af6h0Qgrg0bGl41E9i32QXgLos/edit?usp=sharing",
        label: "ADO Submission FAQ",
        icon: <HelpCircle className="w-5 h-5" />
    },
    {
        href: "https://andromedaprotocol.io",
        label: "Visit our website",
        icon: <BookOpen className="w-5 h-5" />
    }
];

// Social links as a separate array
const socialLinks = [
    {
        href: "https://www.youtube.com/@AndromedaProtocol?sub_confirmation=1",
        icon: <Youtube className="w-5 h-5" />,
        label: "YouTube"
    },
    {
        href: "https://twitter.com/intent/follow?screen_name=AndromedaProt",
        icon: <X className="w-5 h-5" />,
        label: "X (Twitter)"
    },
    {
        href: "https://github.com/andromedaprotocol",
        icon: <Github className="w-5 h-5" />,
        label: "GitHub"
    },
    {
        href: "https://t.me/andromedaprotocol/1",
        icon: <FaTelegramPlane className="w-5 h-5" />,
        label: "Telegram"
    }
];

// Action items for the bottom section
const actionItems: NavItem[] = [
    {
        href: "/contractors",
        label: "Contracts for Bid",
        icon: <Briefcase className="w-5 h-5" />
    },
    {
        href: "/hackers",
        label: "Hackerboard (Bounties)",
        icon: <Target className="w-5 h-5" />
    },
    {
        href: "/visionaries",
        label: "Submit ADO/Feature Idea",
        icon: <Lightbulb className="w-5 h-5" />
    },
    {
        href: "/ai-navigators",
        label: "AI Initiatives",
        icon: <BrainCircuit className="w-5 h-5" />
    },
    {
        href: "https://zealy.io/cw/andromedacommunity/questboard/ff856265-3649-4b5f-a41f-c19eadfaf2e0/36c50401-4e44-452a-9539-94b9f2451f3d",
        label: "Ambassador Program",
        icon: <Award className="w-5 h-5" />
    }
];

// Agent bots items
const agentBots: NavItem[] = [
    {
        href: "https://myronkoch-dev.github.io/AndrDocsBot/",
        label: "Docs Bot",
        icon: <Bot className="w-5 h-5" />
    },
    {
        href: "https://myronkoch-dev.github.io/AndrDocsBot/",
        label: "Artist-bot",
        icon: <Bot className="w-5 h-5" />
    },
    {
        href: "https://myronkoch-dev.github.io/AndrDocsBot/",
        label: "Community Catalyst bot",
        icon: <Bot className="w-5 h-5" />
    },
    {
        href: "https://myronkoch-dev.github.io/AndrDocsBot/",
        label: "Dev Advocate bot",
        icon: <Bot className="w-5 h-5" />
    },
    {
        href: "https://myronkoch-dev.github.io/AndrDocsBot/",
        label: "Ecosystem Explorer bot",
        icon: <Bot className="w-5 h-5" />
    },
    {
        href: "https://myronkoch-dev.github.io/AndrDocsBot/",
        label: "Cosmos Helper bot",
        icon: <Bot className="w-5 h-5" />
    }
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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

    // State for tracking which agent bot is focused via keyboard
    const [focusedAgentIndex, setFocusedAgentIndex] = useState<number | null>(null);

    // Handle keyboard navigation for agent bots
    const handleAgentKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setFocusedAgentIndex(prev =>
                    prev === null || prev >= agentBots.length - 1 ? 0 : prev + 1
                );
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedAgentIndex(prev =>
                    prev === null || prev <= 0 ? agentBots.length - 1 : prev - 1
                );
                break;
            case "Tab":
                // Reset focus when tabbing away
                setFocusedAgentIndex(null);
                break;
            default:
                break;
        }
    };

    // Set up refs for agent bot elements
    const agentRefs = useRef<Array<HTMLDivElement | null>>([]);

    // Focus the currently selected agent bot
    useEffect(() => {
        if (focusedAgentIndex !== null && agentRefs.current[focusedAgentIndex]) {
            agentRefs.current[focusedAgentIndex]?.focus();
        }
    }, [focusedAgentIndex]);

    const [showPath, setShowPath] = useState(false);
    const [showAgent, setShowAgent] = useState(false);
    const [showTools, setShowTools] = useState(true);
    const [showResources, setShowResources] = useState(false);

    // Handlers for hover/focus open/close
    const handleSectionHover = (setter: (v: boolean) => void) => ({
        onMouseEnter: () => setter(true),
        onMouseLeave: () => setter(false),
        onFocus: () => setter(true),
        onBlur: () => setter(false),
    });

    return (
        <>
            {/* Overlay that appears behind the sidebar on mobile when it's open */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <div
                className={cn(
                    "sidebar fixed top-0 left-0 h-full w-64 bg-[#121212] border-r border-[#333333] z-40 transition-transform duration-300 ease-in-out transform shadow-xl overflow-y-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                    "lg:translate-x-0 lg:shadow-none" // Always show on large screens
                )}
            >
                <div className="logo flex items-center gap-3 px-4 py-5 border-b border-[#333333]">
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

                <nav className="mt-2 py-2">
                    {/* Tools section (collapsible) */}
                    <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-400 uppercase tracking-wider focus:outline-none"
                        onClick={() => setShowTools((v) => !v)}
                        aria-expanded={showTools}
                        aria-controls="sidebar-tools-section"
                        tabIndex={0}
                        {...handleSectionHover(setShowTools)}
                    >
                        <span>🛠️</span> Tools
                        {showTools ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                    {showTools && (
                        <div id="sidebar-tools-section">
                            {toolNavItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className={`nav-item flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#232323] hover:text-white transition-colors ${item.badge ? 'cursor-not-allowed opacity-75' : ''}`}
                                    target={item.badge ? undefined : "_blank"}
                                    rel={item.badge ? undefined : "noopener noreferrer"}
                                    onClick={item.badge ? (e) => e.preventDefault() : undefined}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    {item.badge ? (
                                        <div className="ml-auto flex items-center gap-1">
                                            <span className="bg-gray-700 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                                {item.badge.text}
                                                {item.badge.description && (
                                                    <span className="inline-block ml-1 text-[8px] text-gray-400">
                                                        {item.badge.description}
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <ExternalLink className="ml-auto w-4 h-4 opacity-50" />
                                    )}
                                </a>
                            ))}
                        </div>
                    )}
                    <hr className="my-4 border-[#333333]" />
                    {/* Resources section (collapsible) */}
                    <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-green-400 uppercase tracking-wider focus:outline-none"
                        onClick={() => setShowResources((v) => !v)}
                        aria-expanded={showResources}
                        aria-controls="sidebar-resources-section"
                        tabIndex={0}
                        {...handleSectionHover(setShowResources)}
                    >
                        <span>📚</span> Resources
                        {showResources ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>
                    {showResources && (
                        <div id="sidebar-resources-section">
                            {resourceNavItems.map((item, index) => (
                                <a
                                    key={index}
                                    href={item.href}
                                    className="nav-item flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#232323] hover:text-white transition-colors"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    <ExternalLink className="ml-auto w-4 h-4 opacity-50" />
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Visual separator */}
                    <hr className="my-4 border-[#333333]" />

                    {/* Action items section title */}
                    <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-500 uppercase tracking-wider focus:outline-none"
                        onClick={() => setShowPath((v) => !v)}
                        aria-expanded={showPath}
                        aria-controls="sidebar-path-section"
                        tabIndex={0}
                        {...handleSectionHover(setShowPath)}
                    >
                        <span>🧭</span> Choose Your Path
                        {showPath ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>

                    {/* Action items as buttons */}
                    {showPath && (
                        <div id="sidebar-path-section" className="px-4 space-y-3 mt-2">
                            {actionItems.map((item, index) => (
                                <a
                                    key={`action-${index}`}
                                    href={item.href}
                                    className="block w-full inline-flex items-center justify-start gap-2 px-4 py-2 bg-[#2a2a2a] text-white rounded-md hover:bg-[#333333] transition-colors"
                                    target={item.href.startsWith('/') ? undefined : "_blank"}
                                    rel={item.href.startsWith('/') ? undefined : "noopener noreferrer"}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    {!item.href.startsWith('/') && <ExternalLink className="w-4 h-4 opacity-50 ml-auto" />}
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Visual separator */}
                    <hr className="my-4 border-[#333333]" />

                    {/* Agent bots section title */}
                    <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm font-semibold text-amber-500 uppercase tracking-wider focus:outline-none"
                        onClick={() => setShowAgent((v) => !v)}
                        aria-expanded={showAgent}
                        aria-controls="sidebar-agent-section"
                        tabIndex={0}
                        {...handleSectionHover(setShowAgent)}
                    >
                        <span>🤖</span> Choose Your Agent
                        {showAgent ? <ChevronDown className="w-4 h-4 ml-auto" /> : <ChevronRight className="w-4 h-4 ml-auto" />}
                    </button>

                    {/* Agent bots as buttons */}
                    {showAgent && (
                        <div id="sidebar-agent-section" className="px-4 space-y-3 mt-2 mb-6">
                            {agentBots.map((item, index) => (
                                <div
                                    key={`agent-${index}`}
                                    className={`relative block w-full inline-flex items-center justify-start gap-2 px-4 py-2 bg-[#202020] text-gray-500 rounded-md cursor-not-allowed opacity-60 ${focusedAgentIndex === index ? 'ring-2 ring-blue-500' : ''}`}
                                    aria-label={`${item.label} - coming soon`}
                                    role="button"
                                    aria-disabled="true"
                                    tabIndex={0}
                                    ref={(el) => { agentRefs.current[index] = el; }}
                                    onKeyDown={(e) => handleAgentKeyDown(e)}
                                    onFocus={() => setFocusedAgentIndex(index)}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                    <span className="absolute top-0 right-0 bg-gray-700 text-gray-300 text-[10px] px-1.5 py-0.5 rounded-bl-md rounded-tr-md" aria-hidden="true">
                                        Soon
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </nav>
                <div className="flex gap-4 px-4 py-4 mt-6 border-t border-[#333333]">
                    {socialLinks.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={item.label}
                            title={item.label}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            {item.icon}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
} 