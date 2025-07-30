import { Icon } from "@iconify/react/dist/iconify.js"
import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import { useAppStore } from "~/store/app-store"
import Button from "../ui/button"

const AiTools = () => {
  const [showTools, setShowTools] = useState(false)
  const aiTools = useAppStore((s) => s.aiTools)

  return (
    <>
      <AnimatePresence mode="wait">
        {showTools && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ bounce: false }}
            className="fixed bottom-0 left-0 h-20 w-full rounded-t-2xl bg-background"
          />
        )}
      </AnimatePresence>
      <div className="fixed bottom-4 left-4 inline-flex items-center gap-3">
        <motion.span initial={{ y: 20 }} animate={{ y: 0 }}>
          <Button
            className="z-10 h-11 rounded-full"
            size="icon"
            onClick={() => setShowTools((prev) => !prev)}
          >
            <Icon icon="mingcute:ai-line" fontSize={20} />
          </Button>
        </motion.span>
        <AnimatePresence mode="wait">
          {showTools && (
            <>
              <motion.span
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.3, ease: "linear" }}
                className="z-10 h-8 w-1 rounded-full bg-card-foreground/60"
              />
              {aiTools.map(({ id, name, icon, url }, index) => {
                return (
                  <motion.a
                    initial={{ x: -120, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    transition={{
                      duration: index / 10 + 0.1,
                      ease: "linear",
                    }}
                    key={`ai-tool-${id || name}`}
                    href={`https://${url}`}
                    className="-z-10 relative inline-flex h-11 items-center gap-1 rounded-full bg-card px-5 transition-colors hover:bg-card-foreground/20"
                  >
                    <Icon icon={icon} fontSize={20} />
                    {name}
                  </motion.a>
                )
              })}
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export default AiTools
