import clsx from "clsx"
import { useState } from "react"
import { useAppStore } from "~/store/app-store"
import { useOptionsStore } from "~/store/options"
import AppItem from "../app-item"

const Dock = () => {
  const dockApps = useAppStore((s) => s.dockApps)
  const isDockBg = useOptionsStore((s) => s.isDockBackground)
  const [isAnyAppOpen, setIsAnyAppOpen] = useState(false)

  return (
    <div
      className={clsx(
        "fixed bottom-0 left-0 flex w-full justify-center gap-3 p-4",
        { "z-20": isAnyAppOpen },
      )}
    >
      <div
        className={clsx("flex items-center gap-3 rounded-xl p-2", [
          isDockBg ? "bg-card" : "bg-inherit",
        ])}
      >
        {dockApps.map((app) => (
          <AppItem
            key={`dock-app-${app.id}`}
            app={app}
            variant={isDockBg ? "secondary" : "primary"}
            showLabel={false}
            layoutIdPrefix="dock-app"
            onOpenChange={setIsAnyAppOpen}
          />
        ))}
      </div>
    </div>
  )
}

export default Dock
