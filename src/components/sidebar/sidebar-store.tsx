import { create } from "zustand"

export type Tab = "default" | "apps" | "gallery" | "search-engines" | "ai-tools"

interface SiebarOptions {
  isOpen: boolean
  tab: Tab
  setTab: (tab: Tab) => void
}

export const useSidebarOptions = create<SiebarOptions>()((set) => ({
  tab: "default",
  isOpen: false,
  setTab: (tab: Tab) => set({ tab }),
}))
