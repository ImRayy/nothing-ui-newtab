import { combine, persist } from "zustand/middleware"
import { createWithEqualityFn } from "zustand/traditional"

export const useOptionsStore = createWithEqualityFn(
  persist(
    combine(
      {
        // Clock
        enableDigitalClock: false,
        format24: false,
        greetings: true,

        customText: "Click here to edit",

        // Misc
        weatherAPI: "",
        weatherLocation: "Delhi",
        showLocation: true,
        isScaleFahrenheit: false,
        isAIToolsEnabled: true,
        isAppDrawerEnabled: true,
        isMonochromeIcon: false,

        // DockApp
        isDockEnabled: true,
        isDockBackground: false,

        // Image Options
        isMonochromeWidgetImg: false,
        currentImageIndex: 0,
        pinnedWidgetImgIndex: null as number | null,
        isBgImage: false,
        bgImageId: null as string | null,
        isMonochromeBg: false,
        isBgBlur: true,
        gallaryImageInterval: 10,

        // SearchInput
        isQuerySuggestions: true,
      },
      (set, get) => ({
        // Clock Setters
        toggleDidigtalClock: () =>
          set((state) => ({ enableDigitalClock: !state.enableDigitalClock })),
        toggleFormat24: () => set((state) => ({ format24: !state.format24 })),
        toggelGreetings: () =>
          set((state) => ({ greetings: !state.greetings })),

        // Weather Options
        setWeatherAPI: (key: string) => set({ weatherAPI: key }),
        setWeatherLocation: (showLocation: string) =>
          set({ weatherLocation: showLocation }),
        toggleShowLocation: () =>
          set((prev) => ({ showLocation: !prev.showLocation })),
        toggleFahrenheitScale: () =>
          set((state) => ({
            isScaleFahrenheit: !state.isScaleFahrenheit,
          })),

        // Misc Options
        toggleEnableAITools: () =>
          set((prev) => ({ isAIToolsEnabled: !prev.isAIToolsEnabled })),
        toggleMonochromeIcon: () => {
          set((prev) => ({ isMonochromeIcon: !prev.isMonochromeIcon }))
        },

        // App Drwaer setters
        toggleEnableAppDrawer: () =>
          set((prev) => ({
            isAppDrawerEnabled: !prev.isAppDrawerEnabled,
          })),

        // DockApp Setters
        toggleDock: () =>
          set((prev) => ({ isDockEnabled: !prev.isDockEnabled })),
        setCustomText: (text: string) => set({ customText: text }),
        toggleDockBg: () =>
          set((prev) => ({ isDockBackground: !prev.isDockBackground })),

        // Image setters
        toggleMonochromeWidgetImg: () => {
          set((prev) => ({
            isMonochromeWidgetImg: !prev.isMonochromeWidgetImg,
          }))
        },
        setPinnedWidgetImgIndex: (index: number | null) => {
          set({ pinnedWidgetImgIndex: index })
        },
        setCurrentImageIndex: (index: number) => {
          set({ currentImageIndex: index })
        },
        toggleBgImage: () => set((prev) => ({ isBgImage: !prev.isBgImage })),
        toggleMonochromeBg: () => {
          set((prev) => ({ isMonochromeBg: !prev.isMonochromeBg }))
        },
        toggleBgBlur: () => set((prev) => ({ isBgBlur: !prev.isBgBlur })),
        setBgImageId: (id: string | null) => set({ bgImageId: id }),
        setGallaryImageInterval: (interval: number) => {
          if (get().gallaryImageInterval !== interval) {
            set({ gallaryImageInterval: interval })
          }
        },

        // SearchInput Methods
        toggleQuerySuggestions: () =>
          set((prev) => ({ isQuerySuggestions: !prev.isQuerySuggestions })),
      }),
    ),
    {
      name: "nothing-newtab-options",
    },
  ),
)
