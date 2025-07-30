import clsx from "clsx"
import { useMemo } from "react"
import { shallow } from "zustand/shallow"
import { useImageStore } from "~/store/image-store"
import { useOptionsStore } from "~/store/options"
import { pick } from "~/utils"

const BackgroundImage = () => {
  const images = useImageStore((s) => s.images)
  const { bgImageId, isMonochromeBg, isBgBlur, isBgImage } = useOptionsStore(
    (s) => pick(s, ["bgImageId", "isMonochromeBg", "isBgBlur", "isBgImage"]),
    shallow,
  )

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
      <div className="-z-20 fixed size-full select-none bg-white">
        <img
          src={backgroundImage}
          style={isMonochromeBg ? { filter: "grayscale(100%)" } : {}}
          alt="background-image"
          loading="lazy"
          className="size-full object-cover"
        />
      </div>
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
