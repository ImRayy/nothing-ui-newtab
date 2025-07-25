import { Icon } from "@iconify/react/dist/iconify.js"
import { Slot } from "@radix-ui/react-slot"
import { AnimatePresence, motion } from "framer-motion"
import type React from "react"
import { useEffect, useState } from "react"
import type { App } from "~/lib/variables"
import { ensureHttpPrefix, openUrl } from "~/utils"
import AppIcon from "./ui/app-icon"
import Button from "./ui/button"

interface WrapperProps {
  children: React.ReactNode
  app: App
  open: boolean
  onOpenChange: (state: boolean) => void
}

const SplashWrapper = ({ children, app, open, onOpenChange }: WrapperProps) => {
  const MotionWrapper = motion.create(Slot)
  const layoutId = `app-${app.id}`

  useEffect(() => {
    return () => onOpenChange(false)
  }, [onOpenChange])

  return (
    <AnimatePresence mode="wait">
      {open ? (
        <motion.div
          key="expanded"
          layoutId={layoutId}
          className="fixed inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background"
          onLayoutAnimationComplete={() => {
            if (typeof window !== "undefined") {
              openUrl(ensureHttpPrefix(app.url))
            }
          }}
        >
          <AppIcon icon={app.icon} iconSize={80} />
          <span className="flex flex-col items-center gap-2">
            <span>{app.name}</span>
            <Icon icon="gg:spinner" fontSize={24} className="animate-spin" />
          </span>
        </motion.div>
      ) : (
        <MotionWrapper layoutId={layoutId}>{children}</MotionWrapper>
      )}
    </AnimatePresence>
  )
}

export default function AppItem({ app }: { app: App }) {
  const [open, setOpen] = useState(false)

  return (
    <SplashWrapper app={app} open={open} onOpenChange={setOpen}>
      <div className="flex flex-col items-center gap-1">
        <Button variant="secondary" size="icon" onClick={() => setOpen(true)}>
          <AppIcon icon={app.icon} iconSize={20} />
        </Button>
        <span className="whitespace-nowrap text-[12px]">
          {stringTruncate(app.name, 10)}
        </span>
      </div>
    </SplashWrapper>
  )
}

function stringTruncate(str: string, maxCharLen: number) {
  if (str.length > maxCharLen) {
    return `${str.substring(0, 10)}...`
  }
  return str
}
