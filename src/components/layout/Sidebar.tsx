"use client";

import { useEffect } from "react";
import {
    Book,
    BookOpen,
    Sun,
    Layers,
    Command,
    Clock,
    HelpCircle,
    X,
    Youtube,
    ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const navItems: NavItem[] = [
    {
        href: "https://andromedaprotocol.io",
        label: "Visit our website",
        icon: <BookOpen className="w-5 h-5" />
    },
    {
        href: "https://docs.andromedaprotocol.io/guides",
        label: "Guides",
        icon: <Book className="w-5 h-5" />
    },
    {
        href: "https://docs.andromedaprotocol.io/andromeda",
        label: "Developer Docs",
        icon: <BookOpen className="w-5 h-5" />
    },
    {
        href: "https://andromeda-testnet-faucet.vercel.app/",
        label: "ANDR Faucet",
        icon: <Sun className="w-5 h-5" />
    },
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
        href: "https://dashboard.andromedaprotocol.io/",
        label: "Dashboard",
        icon: <Clock className="w-5 h-5" />
    },
    {
        href: "https://www.youtube.com/@AndromedaProtocol?sub_confirmation=1",
        label: "Subscribe on YouTube",
        icon: <Youtube className="w-5 h-5" />
    },
    {
        href: "https://twitter.com/intent/follow?screen_name=AndromedaProt",
        label: "Follow us on X",
        icon: <X className="w-5 h-5" />
    },
    {
        href: "https://docs.google.com/document/d/11VOKvuXkUryZ5p733af6h0Qgrg0bGl41E9i32QXgLos/edit?usp=sharing",
        label: "ADO Submission FAQ",
        icon: <HelpCircle className="w-5 h-5" />
    }
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    // Close sidebar on ESC key press
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

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
                    <img
                        src="https://avatars.githubusercontent.com/u/86694044?s=200&v=4"
                        width="32"
                        height="32"
                        alt="Andromeda Logo"
                        className="rounded-full"
                    />
                    <span className="text-white font-medium text-lg">Andromeda</span>

                    {/* Close button - only visible on mobile */}
                    <button
                        className="ml-auto lg:hidden text-gray-400 hover:text-white"
                        onClick={onClose}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="mt-2 py-2">
                    {navItems.map((item, index) => (
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
                </nav>
            </div>
        </>
    );
} 