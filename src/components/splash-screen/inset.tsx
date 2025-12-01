import { AnimatePresence, motion } from "framer-motion"
import type { ReactNode } from "react"
import SplashScreenComponent from "./splash"
import useSplashScreen from "./use-splash-screen"

export default function SplashInset({ children }: { children: ReactNode }) {
  const { currentApp } = useSplashScreen()

  return (
    <AnimatePresence mode="wait">
      {currentApp ? (
        <SplashScreenComponent {...currentApp} />
      ) : (
        <motion.div
          key="home-page"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{
            duration: 0.5,
            ease: [0.25, 0.46, 0.45, 0.94],
            opacity: { duration: 0.4 },
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 25,
            },
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
