import { get as idbGet, set as idbSet } from "idb-keyval"
import { create } from "zustand"
import type { ImageFile } from "~/types"

type ImageStore = {
  shouldSave: boolean
  loading: boolean
  images: ImageFile[]
  setImages: (images: ImageFile[]) => void
  addImages: (images: ImageFile[]) => void
  fetchImages: () => void
  removeImage: (id: string) => void
  saveImagesToDB: (images?: ImageFile[]) => void
}
export const useImageStore = create<ImageStore>((set, get) => ({
  shouldSave: false,
  loading: true,
  images: [],
  setImages: (images) => set({ images }),
  addImages: (images) => {
    const prevImages = get().images
    const newImages = images.filter(
      (img) => !prevImages.find(({ name }) => name === img.name),
    )

    if (newImages.length > 0) {
      set((prev) => ({
        images: prev.images.concat(newImages),
        shouldSave: true,
      }))
    }
  },
  fetchImages: async () => {
    const prevImages = get().images
    if (!prevImages || prevImages.length === 0) {
      const images = await idbGet("gallery-images")
      if (images) {
        const newImgList: ImageFile[] = images.map((img: ImageFile) => ({
          ...img,
          imageUrl: URL.createObjectURL(img.file),
        }))
        set({
          images: newImgList,
        })
      }
    }
    set({ loading: false })
  },
  removeImage: (id) =>
    set((prev) => ({
      shouldSave: true,
      images: prev.images.filter((img) => img.id !== id),
    })),
  saveImagesToDB: async (images?: ImageFile[]) => {
    try {
      await idbSet(
        "gallery-images",
        [...(images || get().images)].map(({ imageUrl, ...rest }) => rest),
      )
      set({ shouldSave: false })

      console.log("Images saved to IndexedDB successfully")
    } catch (error) {
      console.error("Error saving images to IndexedDB:", error)
    }
  },
}))
