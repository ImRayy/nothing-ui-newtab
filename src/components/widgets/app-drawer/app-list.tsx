import { motion } from "framer-motion"
import { useAppStore } from "~/store/app-store"
import AppListItem from "./app-list-item"

interface AppListProps {
  isRemoveMode: boolean
  onSelect: () => void
}

const AppList = ({ isRemoveMode, onSelect }: AppListProps) => {
  const drawerApps = useAppStore((s) => s.drawerApps)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="h-[352px] w-80 overflow-y-auto rounded-xl border-4 border-card-foreground/10 bg-card p-4 text-card-foreground"
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 80 }}
        transition={{ ease: "linear", duration: 0.16 }}
        className="grid w-full grid-cols-4 gap-4"
      >
        {drawerApps.map((app) => (
          <AppListItem
            app={app}
            isRemoveMode={isRemoveMode}
            key={`drawer-app-${app.id || app.name}`}
            onSelect={onSelect}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

export default AppList
