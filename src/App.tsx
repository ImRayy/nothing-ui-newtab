import * as idbKeyval from "idb-keyval"
import { nanoid } from "nanoid"
import { lazy, Suspense, useEffect } from "react"
import { Toaster } from "sonner"
import BackgroundImage from "./components/background-image"
import PWAUpdatePrompt from "./components/pwa/update-prompt"
import Sidebar from "./components/sidebar"
import WidgetContainer from "./components/widgets/widget-container"
import type { App as AppType } from "./lib/variables"
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
    migrateAppListToAddIds()
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
      <div className="flex min-h-screen w-full select-none items-center justify-center p-4">
        <WidgetContainer />
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
    </>
  )
}

// WARN: Temporary migration function for adding IDs to existing app list
// Such as app drawer, ai tools & dock apps
// Reason: Database migration to include unique identifiers
// Remove this function after some period of time
async function migrateAppListToAddIds() {
  const storeName = "app-store"

  const allIdExists = (list: AppType[]) => {
    return list.findIndex(({ id }) => id) === 0
  }

  const addIds = (list: AppType[]) => {
    return list.map((app) => {
      if (!app.id) {
        return { ...app, id: nanoid() }
      }
      return app
    })
  }

  let apps = await idbKeyval.get(storeName)

  if (!apps && typeof apps === "undefined") {
    return
  }

  apps = JSON.parse(apps)

  const dockApps: AppType[] = apps.state.dockApps
  const drawerApps = apps.state.drawerApps
  const aiTools = apps.state.aiTools

  if (
    allIdExists(dockApps) &&
    allIdExists(drawerApps) &&
    allIdExists(aiTools)
  ) {
    return
  }

  const updatedList = {
    ...apps,
    state: {
      ...apps.state,
      aiTools: addIds(aiTools),
      drawerApps: addIds(drawerApps),
      dockApps: addIds(dockApps),
    },
  }

  await idbKeyval.set(storeName, JSON.stringify(updatedList))
}
