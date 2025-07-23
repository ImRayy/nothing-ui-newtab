"use client"

import {
  AnimatePresence,
  type MotionValue,
  motion,
  type SpringOptions,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { cn } from "~/utils"

const DOCK_HEIGHT = 20
const DEFAULT_MAGNIFICATION = 76
const DEFAULT_DISTANCE = 140
const DEFAULT_PANEL_HEIGHT = 64
const DEFAULT_ICON_SIZE = 44

export type DockProps = {
  children: React.ReactNode
  className?: string
  distance?: number
  panelHeight?: number
  magnification?: number
  spring?: SpringOptions
}

export type DockItemProps = {
  className?: string
  onClick: () => void
  children: React.ReactNode
}

export type DockLabelProps = {
  className?: string
  children: React.ReactNode
}

export type DockIconProps = {
  className?: string
  children: React.ReactNode
}

export type DocContextType = {
  mouseX: MotionValue
  spring: SpringOptions
  magnification: number
  distance: number
}

export type DockProviderProps = {
  children: React.ReactNode
  value: DocContextType
}

const DockContext = createContext<DocContextType | undefined>(undefined)

function DockProvider({ children, value }: DockProviderProps) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>
}

function useDock() {
  const context = useContext(DockContext)
  if (!context) {
    throw new Error("useDock must be used within an DockProvider")
  }
  return context
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}: DockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const isHovered = useMotionValue(0)

  const maxHeight = useMemo(() => {
    return Math.max(DOCK_HEIGHT, magnification + magnification / 2 + 4)
  }, [magnification])

  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight])
  const height = useSpring(heightRow, spring)

  return (
    <motion.div
      style={{
        height: height,
        scrollbarWidth: "none",
      }}
      className="mx-2 flex max-w-full items-end overflow-x-auto"
    >
      <motion.div
        onMouseMove={({ pageX }) => {
          isHovered.set(1)
          mouseX.set(pageX)
        }}
        onMouseLeave={() => {
          isHovered.set(0)
          mouseX.set(Number.POSITIVE_INFINITY)
        }}
        className={cn(
          "mx-auto flex w-fit gap-4 rounded-2xl bg-gray-50 px-4",
          className,
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockProvider>
      </motion.div>
    </motion.div>
  )
}

function DockItem({ children, className, onClick }: DockItemProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const { distance, magnification, mouseX, spring } = useDock()

  const isHovered = useMotionValue(0)

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - domRect.x - domRect.width / 2
  })

  const widthTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [DEFAULT_ICON_SIZE, magnification, DEFAULT_ICON_SIZE],
  )

  const width = useSpring(widthTransform, spring)

  return (
    <motion.button
      type="button"
      ref={ref}
      style={{ width }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      tabIndex={0}
      aria-haspopup="true"
      onClick={onClick}
    >
      {Children.map(children, (child) =>
        cloneElement(child as React.ReactElement, { width, isHovered }),
      )}
    </motion.button>
  )
}

function DockLabel({ children, className, ...rest }: DockLabelProps) {
  const restProps = rest as Record<string, unknown>
  const isHovered = restProps.isHovered as MotionValue<number>
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1)
    })

    return () => unsubscribe()
  }, [isHovered])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.span
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "-top-6 absolute left-1/2 w-fit whitespace-pre rounded-md border border-card-foreground/10 bg-card px-3 py-1 text-card-foreground text-xs",
            className,
          )}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  )
}

function DockIcon({ children, className, ...rest }: DockIconProps) {
  const restProps = rest as Record<string, unknown>
  const width = restProps.width as MotionValue<number>

  const widthTransform = useTransform(width, (val) => val / 2)

  return (
    <motion.div
      style={{ width: widthTransform }}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  )
}

export { Dock, DockIcon, DockItem, DockLabel }
