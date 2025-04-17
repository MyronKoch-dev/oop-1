"use client";

import { createContext, useContext } from "react";

type SidebarContextType = {
    openRightSidebar: () => void;
};

// Default context value
export const SidebarContext = createContext<SidebarContextType>({
    openRightSidebar: () => { },
});

// Hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext); 