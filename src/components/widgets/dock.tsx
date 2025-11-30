import clsx from "clsx"
import { useAppStore } from "~/store/app-store"
import { useOptionsStore } from "~/store/options"
import { cn, ensureHttpPrefix, openUrl } from "~/utils"
import AppIcon from "../ui/app-icon"
import Dock from "../ui/dock"

const DockComponent = () => {
  const dockApps = useAppStore((s) => s.dockApps)
  const isDockBg = useOptionsStore((s) => s.isDockBackground)

  return (
    <Dock
      items={dockApps.map((app) => ({
        icon: <AppIcon icon={app.icon} iconSize={20} />,
        label: app.name,
        onClick: () => openUrl(ensureHttpPrefix(app.url)),
        className: cn(
          "shadow-none",
          isDockBg ? "border-[0.5px] bg-background" : "border-none bg-card",
        ),
      }))}
      className={clsx("border-none", isDockBg ? "bg-card p-2" : "bg-inherit")}
      panelHeight={64}
      baseItemSize={46}
      magnification={70}
    />
  )
}

export default DockComponent
