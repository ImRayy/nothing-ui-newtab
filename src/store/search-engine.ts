import { persist } from "zustand/middleware"
import { createWithEqualityFn } from "zustand/traditional"
import { searchProviders } from "~/lib/variables"

export type SearchEngine = {
  short: string
  name: string
  icon: string
  baseUrl: string
}

type SearchEngineStore = {
  selectedEngine: string
  getSelectedEngine: () => SearchEngine | null
  setSelectedEngine: (name: string) => void
  searchEngines: SearchEngine[]
  add: (e: SearchEngine) => void
  remove: (name: string) => void
  update: (id: number, e: SearchEngine) => void
  reset: () => void
}

export const useSearchEngineStore = createWithEqualityFn(
  persist<SearchEngineStore>(
    (set, get) => ({
      searchEngines: searchProviders as SearchEngine[],
      selectedEngine: "Brave",
      getSelectedEngine: () => {
        return (
          get().searchEngines.find(
            ({ name }) => name === get().selectedEngine,
          ) || null
        )
      },
      setSelectedEngine: (name: string) => set({ selectedEngine: name }),
      add: (engine) => {
        const prevEngines = get().searchEngines
        if (!prevEngines.find(({ name }) => name === engine.name)) {
          set({ searchEngines: [engine, ...prevEngines] })
        }
      },
      remove: (name) => {
        set((prev) => ({
          searchEngines: prev.searchEngines.filter((e) => e.name !== name),
        }))
      },
      update: (id, engine) => {
        set((prev) => ({
          searchEngines: prev.searchEngines.map((prev_engine, index) =>
            index === id ? engine : prev_engine,
          ),
        }))
      },
      reset: () => set({ searchEngines: searchProviders }),
    }),
    {
      name: "search-engines",
    },
  ),
)
