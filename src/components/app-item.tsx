import { Icon } from "@iconify/react/dist/iconify.js"
import { Slot } from "@radix-ui/react-slot"
import clsx from "clsx"
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

const ssKeyExternal = "session:opened:external-link"
const ssKeyAppId = "session:selected:app-id"

const SplashWrapper = ({ children, app, open, onOpenChange }: WrapperProps) => {
  const MotionWrapper = motion.create(Slot)
  const layoutId = `app-${app.id}`

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        if (sessionStorage.getItem(ssKeyExternal) === "true") {
          setTimeout(() => onOpenChange(false), 200)
          setTimeout(() => sessionStorage.removeItem(ssKeyAppId), 300)
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      onOpenChange(false)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
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
              sessionStorage.setItem(ssKeyExternal, "true")
              sessionStorage.setItem(ssKeyAppId, app.id)
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
        <div className="flex flex-col items-center gap-1">
          <MotionWrapper layoutId={layoutId}>{children}</MotionWrapper>
          <span className="whitespace-nowrap text-[12px]">
            {stringTruncate(app.name, 10)}
          </span>
        </div>
      )}
    </AnimatePresence>
  )
}

export default function AppItem({ app }: { app: App }) {
  const [open, setOpen] = useState(false)

  return (
    <SplashWrapper app={app} open={open} onOpenChange={setOpen}>
      <Button
        variant="secondary"
        size="icon"
        onClick={() => setOpen(true)}
        className={clsx({ "relative z-50": isCurrentApp(app.id) })}
      >
        <AppIcon icon={app.icon} iconSize={20} />
      </Button>
    </SplashWrapper>
  )
}

function isCurrentApp(appId: string): boolean {
  return sessionStorage.getItem(ssKeyAppId) === appId
}

function stringTruncate(str: string, maxCharLen: number) {
  if (str.length > maxCharLen) {
    return `${str.substring(0, 10)}...`
  }
  return str
}
