import { Icon } from "@iconify/react/dist/iconify.js"
import clsx from "clsx"
import { AnimatePresence, motion, wrap } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { useImageStore } from "~/store/image-store"
import { useOptionsStore } from "~/store/options"
import Menu from "../ui/menu"

const ImgTag = (props: {
  src: string | undefined
  alt: string | undefined
}) => {
  if (!props.src || !props.alt) {
    return null
  }

  return (
    <motion.img
      initial={{ y: 40, scale: 0.4 }}
      animate={{ y: 0, scale: 1 }}
      exit={{ y: -200, scale: 0.6 }}
      transition={{ ease: "linear", duration: 0.3 }}
      src={props.src}
      alt={props.alt}
      className="size-full rounded-lg object-cover object-top"
    />
  )
}

const PinnedIcon = () => {
  const [hide, setHide] = useState(false)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHide(true)
    }, 4000)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <AnimatePresence>
      {!hide && (
        <motion.span
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          exit={{ y: -20, opacity: 0 }}
          className={clsx(
            "absolute top-2 right-2 inline-flex items-center gap-1 rounded-md border-2 border-green-600 bg-green-600/20 p-1 pr-2 font-medium font-rubik text-green-600 text-sm backdrop-blur",
          )}
        >
          <Icon icon="solar:pin-bold" />
          Pinned
        </motion.span>
      )}
    </AnimatePresence>
  )
}

const Gallery = () => {
  const { loading, images } = useImageStore()

  const {
    isMonochromeWidgetImg,
    isBgImage,
    pinnedWidgetImgIndex: pinnedImgIndex,
    setPinnedWidgetImgIndex: setPinnedImgIndex,
    currentImageIndex: selectedImage,
    setCurrentImageIndex: setSelectedImage,
    bgImageId,
    setBgImageId,
    gallaryImageInterval,
  } = useOptionsStore()
  const imageIndex = wrap(0, images.length, selectedImage)

  const next = useCallback(() => {
    if (selectedImage >= images.length - 1) {
      setSelectedImage(0)
    } else setSelectedImage(selectedImage + 1)
  }, [images, selectedImage, setSelectedImage])

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>

    if (pinnedImgIndex === null && images.length > 0) {
      intervalId = setInterval(
        () => next(),
        (gallaryImageInterval || 10) * 1000,
      )
    }

    return () => clearInterval(intervalId)
  }, [gallaryImageInterval, pinnedImgIndex, images, next])

  return (
    <div className="h-48 w-96 rounded-xl bg-card p-3">
      <div
        className="size-full overflow-hidden rounded-lg"
        style={isMonochromeWidgetImg ? { filter: "grayscale(100%)" } : {}}
      >
        {images.length > 0 && images[selectedImage] ? (
          <Menu
            menuTrigger={
              <AnimatePresence initial={false} mode="wait">
                <div className="relative">
                  {pinnedImgIndex !== null ? (
                    <ImgTag
                      src={images[pinnedImgIndex].imageUrl}
                      alt={images[pinnedImgIndex].name}
                    />
                  ) : (
                    <ImgTag
                      key={imageIndex}
                      src={images[selectedImage].imageUrl}
                      alt={images[selectedImage].name}
                    />
                  )}
                  {pinnedImgIndex !== null && <PinnedIcon />}
                </div>
              </AnimatePresence>
            }
            data={[
              {
                label: "Pin Image",
                icon: "solar:pin-bold",
                func: () => setPinnedImgIndex(imageIndex),
                hidden: pinnedImgIndex !== null,
              },
              {
                label: "Unpin",
                icon: "fluent:pin-off-16-filled",
                func: () => setPinnedImgIndex(null),
                hidden: pinnedImgIndex === null,
              },
              {
                label: "Set as background",
                icon: "solar:gallery-bold",
                func: () => setBgImageId(images[selectedImage].id),
                disabled: !isBgImage || bgImageId === images[selectedImage].id,
              },
            ]}
          />
        ) : (
          !loading && (
            <img
              src="https://res.cloudinary.com/stylesh/image/upload/v1734109577/placeholder/vxuhoiscbldol8nlg94x.jpg"
              alt="fallback-image"
            />
          )
        )}
      </div>
    </div>
  )
}

export default Gallery
