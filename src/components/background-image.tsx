import clsx from "clsx"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { shallow } from "zustand/shallow"
import { useImageStore } from "~/store/image-store"
import { useOptionsStore } from "~/store/options"
import { pick } from "~/utils"
import { useSidebarOptions } from "./sidebar/sidebar-store"

interface BackgroundImageProps {
  isZoomOut?: boolean
}

const BackgroundImage = ({ isZoomOut = false }: BackgroundImageProps) => {
  const images = useImageStore((s) => s.images)
  const { bgImageId, isMonochromeBg, isBgBlur, isBgImage } = useOptionsStore(
    (s) => pick(s, ["bgImageId", "isMonochromeBg", "isBgBlur", "isBgImage"]),
    shallow,
  )
  const isSidebarOpen = useSidebarOptions((state) => state.isOpen)

  const backgroundImage = useMemo(() => {
    return images.find(({ id }) => id === bgImageId)?.imageUrl
  }, [images, bgImageId])

  if (
    !isBgImage ||
    bgImageId === null ||
    images.length === 0 ||
    !backgroundImage
  ) {
    return null
  }

  return (
    <>
      <motion.div
        initial={{
          scale: 1.2,
          filter: "blur(8px) brightness(0.2)",
        }}
        animate={{
          scale: isZoomOut || isSidebarOpen ? 1 : 1.1,
          filter:
            isZoomOut || isSidebarOpen
              ? "blur(8px) brightness(0.7)"
              : "blur(0px) brightness(1)",
        }}
        transition={{
          duration: 0.4,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="-z-20 fixed size-full select-none bg-white"
      >
        <img
          src={backgroundImage}
          style={isMonochromeBg ? { filter: "grayscale(100%)" } : {}}
          alt="background-image"
          loading="lazy"
          className="size-full object-cover"
        />
      </motion.div>
      <div
        className={clsx(
          "-z-10 fixed size-full select-none",
          isBgBlur && "backdrop-blur-md",
        )}
      />
    </>
  )
}

export default BackgroundImage
