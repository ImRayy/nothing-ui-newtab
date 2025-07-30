import { Icon } from "@iconify/react"
import clsx from "clsx"
import Compressor from "compressorjs"
import { motion } from "framer-motion"
import { del } from "idb-keyval"
import { useEffect, useRef, useState } from "react"
import { shallow } from "zustand/shallow"
import Button from "~/components/ui/button"
import Input from "~/components/ui/input"
import Modal from "~/components/ui/modal"
import { useImageStore } from "~/store/image-store"
import { useOptionsStore } from "~/store/options"
import type { ImageFile } from "~/types"
import { pick } from "~/utils"
import NewTabHeader from "../shared/newtab-header"

type ImageSize = {
  id: string
  width: number
  height: number
  size: number
}

const GalleryTab = () => {
  const {
    images,
    addImages,
    removeImage,
    shouldSave,
    saveImagesToDB,
    setImages,
  } = useImageStore(
    (s) =>
      pick(s, [
        "images",
        "addImages",
        "removeImage",
        "shouldSave",
        "saveImagesToDB",
        "setImages",
      ]),
    shallow,
  )

  const { isBgImage, bgImageId, setBgImageId, setCurrentImageIndex } =
    useOptionsStore(
      (s) =>
        pick(s, [
          "isBgImage",
          "bgImageId",
          "setBgImageId",
          "setCurrentImageIndex",
        ]),
      shallow,
    )

  const inputRef = useRef<HTMLInputElement | null>(null)

  const [prevImagesLength] = useState(images.length)
  const [imgSizeData, setImgSizeData] = useState<ImageSize[]>([])
  const [openModal, setOpenModal] = useState(false)

  const saveImageHandler = async () => {
    // Reset data
    setImgSizeData([])

    // Main logic
    const files = images.map(({ file, id }) => ({ file, id }))
    if (!files || files.length === 0) return

    const imgData: ImageSize[] = []

    await Promise.all(
      Array.from(files).map(
        (imgFile) =>
          new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
              const img = new Image()
              img.onload = () => {
                if (img.width > 1920 && img.height > 1080) {
                  imgData.push({
                    id: imgFile.id,
                    height: img.height,
                    width: img.width,
                    size: imgFile.file.size,
                  })
                }
                resolve({})
              }
              img.src = e.target?.result as string
            }
            reader.readAsDataURL(imgFile.file)
          }),
      ),
    )

    if (imgData.length > 0 && prevImagesLength !== images.length) {
      setImgSizeData(imgData)
      setOpenModal(true)
    } else {
      saveImagesToDB()
    }
  }

  const compressImageHandler = async () => {
    const newImageList: ImageFile[] = []

    await Promise.all(
      Array.from(images).map(
        (image) =>
          new Promise((resolve) => {
            if (!imgSizeData.some(({ id }) => id === image.id)) {
              newImageList.push(image)
              resolve({})
              return
            }

            new Compressor(image.file, {
              width: 1920,
              height: 1080,
              success(result: Blob) {
                const compressedFile: ImageFile = {
                  ...image,
                  file: new File([result], image.file.name, {
                    type: image.file.type,
                  }),
                }
                newImageList.push(compressedFile)
                resolve({})
              },
            })
          }),
      ),
    )

    // Set compressed images
    setImages(newImageList)

    // Save images to db
    saveImagesToDB(newImageList)

    // Close modal
    setOpenModal(false)
  }

  const handleOnSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (files && files.length > 0) {
      const newImages: ImageFile[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        type: file.type,
        imageUrl: URL.createObjectURL(file),
      }))
      addImages(newImages)
    }
  }

  useEffect(() => {
    if (images.length === 0) {
      setBgImageId(null)
    }
  }, [images, setBgImageId])

  return (
    <div className="h-[86%] space-y-6">
      <NewTabHeader
        rightButtons={
          <>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => {
                inputRef.current?.click()
              }}
            >
              <Icon icon="ri:image-add-fill" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={async () => {
                await del("gallery-images").then(() => {
                  setImages([])
                  setCurrentImageIndex(0)
                })
              }}
            >
              <Icon icon="tabler:trash" />
            </Button>
            <Button
              variant={shouldSave ? "accent" : "secondary"}
              size="icon"
              onClick={saveImageHandler}
              disabled={images.length === prevImagesLength}
            >
              <Icon icon="mdi:content-save-all" />
            </Button>
          </>
        }
      />

      {images?.length > 0 ? (
        <div className="flex flex-col gap-3 ">
          {images?.map((img) => (
            <motion.div
              layout
              key={img.id}
              className="group relative h-48 rounded-xl shadow-md transition-all duration-500"
              onClick={() => isBgImage && setBgImageId(img.id)}
              style={bgImageId === img.id ? { padding: "10px" } : {}}
            >
              {bgImageId === img.id && (
                <motion.div
                  layoutId="selected-image"
                  className="absolute top-0 left-0 z-10 h-full w-full rounded-xl border-4 border-foreground"
                />
              )}
              <img
                loading="lazy"
                className="size-full rounded-md object-cover"
                src={img.imageUrl}
                alt="gallary-image"
              />
              <Button
                variant="destructive"
                size="icon"
                className={clsx([
                  "absolute top-2 right-3 hidden size-8",
                  bgImageId !== img.id && "group-hover:flex",
                ])}
                onClick={(e) => {
                  e.stopPropagation()
                  removeImage(img.id)
                }}
              >
                <Icon icon="lucide:x" />
              </Button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-card-foreground/40">
          <Icon icon="uil:image-block" fontSize={80} />
          <span>No image found!</span>
        </div>
      )}
      <Input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleOnSelect}
        className="hidden"
        multiple
      />
      <Modal
        title="Image sizes"
        description="Images should be 1920x1080 pixels for optimal performance, red border indicates the image exceeds the recommended size, which may cause laggyness"
        isOpen={openModal}
        setIsOpen={setOpenModal}
      >
        <div className="space-y-3">
          <div className="mt-4 h-44 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
              {images.map(({ id, imageUrl, name }) => (
                <img
                  key={id}
                  src={imageUrl}
                  alt={name}
                  className={clsx([
                    "size-full rounded-md border-2",
                    imgSizeData.find((img) => img.id === id)
                      ? "border-destructive"
                      : "border-transparent",
                  ])}
                />
              ))}
            </div>
          </div>
          <div className="inline-flex w-full justify-end gap-3">
            <Button
              variant="destructive"
              className="w-24"
              onClick={() => {
                saveImagesToDB()
                setOpenModal(false)
              }}
            >
              Save
            </Button>
            <Button variant="accent" onClick={compressImageHandler}>
              Compress &amp; save
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default GalleryTab
