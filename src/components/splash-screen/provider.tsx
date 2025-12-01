import type React from "react"
import { useEffect, useState } from "react"
import type { App } from "~/lib/variables"
import { ensureHttpPrefix, openUrl } from "~/utils"
import { SplashScreenContext } from "./context"

const ssKeyExternal = "session:opened:external-link"
const ssKeyAppId = "session:selected:app-id"

interface SplashScreenProviderProps {
  children: React.ReactNode
}

export default function SplashScreenProvider({
  children,
}: SplashScreenProviderProps) {
  const [currentApp, setCurrentApp] = useState<App | undefined>(undefined)

  const openUrlHandler = () => {
    if (typeof window !== "undefined" && currentApp) {
      sessionStorage.setItem(ssKeyExternal, "true")
      sessionStorage.setItem(ssKeyAppId, currentApp?.id)
      openUrl(ensureHttpPrefix(currentApp?.url))
    }
  }

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (sessionStorage.getItem(ssKeyExternal) === "true") {
          setTimeout(() => sessionStorage.removeItem(ssKeyAppId), 300)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <SplashScreenContext.Provider
      value={{ currentApp, setCurrentApp, openUrlHandler }}
    >
      {children}
    </SplashScreenContext.Provider>
  )
}
