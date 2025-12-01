import { createContext } from "react"
import type { App } from "~/lib/variables"
import type { Setter } from "~/types/react"

type SplashScreenContextProps = {
  currentApp: App | undefined
  setCurrentApp: Setter<App | undefined>
  openUrlHandler: () => void
}

export const SplashScreenContext = createContext<
  SplashScreenContextProps | undefined
>(undefined)
