"use client";

import { createContext, useContext } from "react";

type SidebarContextType = {
  openRightSidebar: () => void;
  isRightSidebarOpen: boolean;
};

// Default context value
export const SidebarContext = createContext<SidebarContextType>({
  openRightSidebar: () => { },
  isRightSidebarOpen: false,
});

// Hook to use the sidebar context
export const useSidebar = () => useContext(SidebarContext);
