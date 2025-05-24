"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Target,
  Lightbulb,
  BrainCircuit,
  Award,
  BookOpen,
  ChevronDown,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const commandCenterItems: NavItem[] = [
  {
    href: "/contractors",
    label: "Contractor",
    icon: <Briefcase className="w-4 h-4" />,
  },
  {
    href: "/hackers",
    label: "Hacker",
    icon: <Target className="w-4 h-4" />,
  },
  {
    href: "/visionaries",
    label: "Visionary",
    icon: <Lightbulb className="w-4 h-4" />,
  },
  {
    href: "/ai-navigators",
    label: "AI Navigator",
    icon: <BrainCircuit className="w-4 h-4" />,
  },
  {
    href: "/ambassador",
    label: "Ambassador",
    icon: <Award className="w-4 h-4" />,
  },
  {
    href: "/explorer",
    label: "Explorer",
    icon: <BookOpen className="w-4 h-4" />,
  },
];

export function CommandCenterNav() {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Find the current active item
  const currentItem =
    commandCenterItems.find((item) => item.href === pathname) ||
    commandCenterItems[0];

  return (
    <div className="mb-6">
      {/* Dropdown Navigation with Command Center Label - Left Aligned */}
      <div className="flex items-center justify-start gap-3 mb-4">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
              "text-sm font-medium bg-[#333333] text-white shadow-sm border border-[#444444]",
              "hover:bg-[#404040] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1a1a1a]",
            )}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            {currentItem.icon}
            <span>{currentItem.label}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-200",
                isDropdownOpen && "rotate-180",
              )}
            />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close dropdown when clicking outside */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown Content */}
              <div className="absolute top-full left-0 mt-1 w-48 bg-[#2a2a2a] border border-[#444444] rounded-md shadow-lg z-50">
                <div className="py-1">
                  {commandCenterItems.map((item, index) => {
                    const isActive = item.href === pathname;
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 text-sm transition-colors",
                          isActive
                            ? "bg-[#333333] text-white"
                            : "text-gray-300 hover:bg-[#333333] hover:text-white",
                        )}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Command Center Label */}
        <span className="text-sm font-semibold uppercase tracking-wider text-gray-400">
          Command Center
        </span>
      </div>
    </div>
  );
}
