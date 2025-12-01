import { Slot } from "@radix-ui/react-slot"
import { motion } from "framer-motion"
import { getRandomLoadingText } from "~/lib/random-text"
import type { App } from "~/lib/variables"
import AppIcon from "../ui/app-icon"
import useSplashScreen from "./use-splash-screen"

export default function SplashScreenComponent({ name, icon }: App) {
  const MotionSlot = motion.create(Slot)
  const { openUrlHandler } = useSplashScreen()

  return (
    <motion.div
      key="splash"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.2 }}
      transition={{ exit: { duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] } }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950"
    >
      {/* Animated Background Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-indigo-600/30 blur-3xl"
      />

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Logo Container with Multiple Animations */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2,
          }}
          className="relative"
        >
          {/* Pulsing Ring */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.2, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 blur-xl"
          />

          {/* Rotating Border */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="-inset-4 absolute rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500 opacity-75 blur-sm"
          />

          {/* Main Logo Circle */}
          <MotionSlot
            animate={{
              boxShadow: [
                "0 0 20px rgba(168, 85, 247, 0.4)",
                "0 0 60px rgba(168, 85, 247, 0.8)",
                "0 0 20px rgba(168, 85, 247, 0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative size-32 shrink-0 rounded-full border-4 border-white/20 bg-gradient-to-br from-slate-900 to-slate-950 p-7 backdrop-blur-sm"
          >
            <AppIcon icon={icon} />
          </MotionSlot>
        </motion.div>

        {/* App Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col items-center gap-2"
          onAnimationComplete={openUrlHandler}
        >
          <h1 className="bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text font-bold text-4xl text-transparent">
            {name}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-indigo-300 text-sm"
          >
            {getRandomLoadingText()}
          </motion.p>
        </motion.div>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 200 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="h-1 overflow-hidden rounded-full bg-white/10"
        >
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-purple-400 to-transparent"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
