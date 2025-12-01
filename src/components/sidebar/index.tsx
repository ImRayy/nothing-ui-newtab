import { Icon } from "@iconify/react/dist/iconify.js"
import { AnimatePresence, motion } from "framer-motion"
import { lazy, Suspense } from "react"
import Button from "../ui/button"
import { useSidebarOptions } from "./sidebar-store"

const SidebarContent = lazy(() => import("./sidebar-content"))

const Backdrop = ({ onOpenChange }: { onOpenChange: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ ease: "linear", duration: 0.3 }}
      onClick={onOpenChange}
      className="fixed top-0 left-0 z-10 min-h-screen w-full backdrop-blur-md"
    />
  )
}

const Sidebar = () => {
  const open = useSidebarOptions((state) => state.isOpen)

  const onClose = () => useSidebarOptions.setState({ isOpen: !open })

  return (
    <>
      <AnimatePresence mode="wait">
        {!open && (
          <Button
            size="icon"
            asChild
            className="fixed right-4 bottom-4 z-10 rounded-full bg-card text-white active:scale-95"
          >
            <motion.button
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              exit={{ y: 20, opacity: 0 }}
              type="button"
              onClick={onClose}
            >
              <Icon
                icon="tabler:settings"
                fontSize={20}
                className="mx-auto text-card-foreground"
              />
            </motion.button>
          </Button>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {open && (
          <Suspense>
            <SidebarContent />
            <Backdrop onOpenChange={onClose} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar
