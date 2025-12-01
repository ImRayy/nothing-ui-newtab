import clsx from "clsx"
import { AnimatePresence, motion } from "framer-motion"
import { useAppStore } from "~/store/app-store"
import { useOptionsStore } from "~/store/options"
import { cn } from "~/utils"
import useSplashScreen from "../splash-screen/use-splash-screen"
import AppIcon from "../ui/app-icon"
import Dock from "../ui/dock"

const DockComponent = () => {
  const dockApps = useAppStore((s) => s.dockApps)
  const isDockBg = useOptionsStore((s) => s.isDockBackground)
  const { currentApp, setCurrentApp } = useSplashScreen()

  return (
    <AnimatePresence mode="wait">
      {!currentApp && (
        <motion.div
          key="home-dock"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{
            duration: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: { duration: 0.4 },
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 25,
            },
          }}
          className="fixed bottom-2"
        >
          <Dock
            items={dockApps.map((app) => ({
              icon: <AppIcon icon={app.icon} iconSize={20} />,
              label: app.name,
              onClick: () => setCurrentApp(app),
              className: cn(
                "shadow-none",
                isDockBg
                  ? "border-[0.5px] bg-background"
                  : "border-none bg-card",
              ),
            }))}
            className={clsx(
              "border-none",
              isDockBg ? "bg-card p-2" : "bg-inherit",
            )}
            panelHeight={64}
            baseItemSize={46}
            magnification={70}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DockComponent
