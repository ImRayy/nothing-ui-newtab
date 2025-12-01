import { Icon } from "@iconify/react/dist/iconify.js"
import clsx from "clsx"
import useSplashScreen from "~/components/splash-screen/use-splash-screen"
import AppIcon from "~/components/ui/app-icon"
import Button from "~/components/ui/button"
import { useAppStore } from "~/store/app-store"
import type { App } from "../../../lib/variables"
import AppMenu from "./app-menu"

interface AppButtonProps {
  app: App
  onSelect: () => void
  isRemoveMode: boolean
}

const AppListItem = ({ app, isRemoveMode, onSelect }: AppButtonProps) => {
  const removeDrawerApp = useAppStore((s) => s.removeDrawerApp)
  const { setCurrentApp } = useSplashScreen()

  const onAppClick = () => {
    onSelect?.()
    setCurrentApp(app)
  }

  if (!app) {
    return null
  }

  return (
    <AppMenu app={app}>
      <div className="relative">
        <div className="flex flex-col items-center gap-1">
          <Button variant="secondary" size="icon" onClick={onAppClick}>
            <AppIcon icon={app.icon} iconSize={20} />
          </Button>
          <span className={clsx("whitespace-nowrap text-[12px]")}>
            {stringTruncate(app.name, 10)}
          </span>
        </div>
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

function stringTruncate(str: string, maxCharLen: number) {
  if (str.length > maxCharLen) {
    return `${str.substring(0, 10)}...`
  }
  return str
}

export default AppListItem
