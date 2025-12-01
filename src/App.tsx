import { lazy, Suspense, useEffect } from "react"
import { Toaster } from "sonner"
import BackgroundImage from "./components/background-image"
import PWAUpdatePrompt from "./components/pwa/update-prompt"
import Sidebar from "./components/sidebar"
import SplashInset from "./components/splash-screen/inset"
import SplashScreenProvider from "./components/splash-screen/provider"
import WidgetContainer from "./components/widgets/widget-container"
import { useImageStore } from "./store/image-store"
import { useOptionsStore } from "./store/options"
import { useThemeStore } from "./store/theme"

const Dock = lazy(() => import("./components/widgets/dock"))
const AiTools = lazy(() => import("./components/widgets/ai-tools"))
const AppDrawer = lazy(() => import("./components/widgets/app-drawer"))

export default function App() {
  const isDockEnabled = useOptionsStore((s) => s.isDockEnabled)
  const isAIToolsEnabled = useOptionsStore((s) => s.isAIToolsEnabled)
  const isAppDrawerEnabled = useOptionsStore((s) => s.isAppDrawerEnabled)
  const isLightMode = useThemeStore((s) => s.isLightMode)
  const fetchImages = useImageStore((s) => s.fetchImages)

  useEffect(() => {
    const html = document.documentElement
    const mode = html.getAttribute("data-theme")
    if (mode !== "light" && isLightMode) {
      html.setAttribute("data-theme", "light")
    } else {
      html.setAttribute("data-theme", "dark")
    }
  }, [isLightMode])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            borderColor: "hsl(var(--card-foreground) / 0.1)",
            color: "hsl(var(--card-foreground))",
          },
          actionButtonStyle: {
            background: "hsl(var(--card-foreground))",
            color: "hsl(var(--card))",
          },
        }}
      />
      <BackgroundImage />
      <PWAUpdatePrompt />
      <SplashScreenProvider>
        <div className="flex min-h-screen w-full select-none items-center justify-center p-4">
          <SplashInset>
            <WidgetContainer />
          </SplashInset>
          <Sidebar />
          {isDockEnabled && (
            <Suspense>
              <Dock />
            </Suspense>
          )}
          {isAIToolsEnabled && (
            <Suspense>
              <AiTools />
            </Suspense>
          )}
          {isAppDrawerEnabled && (
            <Suspense>
              <AppDrawer />
            </Suspense>
          )}
        </div>
      </SplashScreenProvider>
    </>
  )
}
