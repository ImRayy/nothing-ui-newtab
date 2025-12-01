import type React from "react"
import { useCallback, useRef, useState } from "react"
import { useEventListener } from "usehooks-ts"
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
  const documentRef = useRef<Document>(document)

  const openUrlHandler = useCallback(() => {
    if (typeof window !== "undefined" && currentApp) {
      sessionStorage.setItem(ssKeyExternal, "true")
      sessionStorage.setItem(ssKeyAppId, currentApp?.id)
      openUrl(ensureHttpPrefix(currentApp?.url))
    }
  }, [currentApp])

  useEventListener(
    "visibilitychange",
    () => {
      if (!document.hidden) {
        if (sessionStorage.getItem(ssKeyExternal) === "true") {
          setTimeout(() => setCurrentApp(undefined), 200)
          setTimeout(() => sessionStorage.removeItem(ssKeyAppId), 300)
        }
      }
    },
    documentRef,
  )

  return (
    <SplashScreenContext.Provider
      value={{ currentApp, setCurrentApp, openUrlHandler }}
    >
      {children}
    </SplashScreenContext.Provider>
  )
}
