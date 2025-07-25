import { Icon } from "@iconify/react/dist/iconify.js"
import AppItem from "~/components/app-item"
import Button from "~/components/ui/button"
import { useAppStore } from "~/store/app-store"
import type { App } from "../../../lib/variables"
import AppMenu from "./app-menu"

interface AppButtonProps {
  app: App
  isRemoveMode: boolean
}

const AppListItem = ({ app, isRemoveMode }: AppButtonProps) => {
  const { removeDrawerApp } = useAppStore()

  if (!app) return null

  return (
    <AppMenu app={app}>
      <div className="relative">
        <AppItem app={app} />
        {isRemoveMode && (
          <Button
            variant="destructive"
            className="absolute top-0 right-0 size-5 p-0"
            onClick={() => removeDrawerApp(app.id)}
          >
            <Icon icon="lucide:x" fontSize={15} />
          </Button>
        )}
      </div>
    </AppMenu>
  )
}

export default AppListItem
