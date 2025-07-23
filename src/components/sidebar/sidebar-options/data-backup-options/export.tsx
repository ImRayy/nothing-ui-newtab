import { Icon } from "@iconify/react/dist/iconify.js"
import * as idb from "idb-keyval"
import { useState } from "react"
import Button from "~/components/ui/button"
import Checkbox from "~/components/ui/checkbox"
import Modal from "~/components/ui/modal"
import {
  drawerApps as initialDrawerApps,
  searchProviders as initialSearchProviders,
} from "~/lib/variables"
import type { ImageFile } from "~/types"
import { toBase64 } from "~/utils"
import type { Backup } from "./type"

export default function Export() {
  const [open, setOpen] = useState(false)
  const [weather, setWeather] = useState(true)
  const [queryHist, setQueryHist] = useState(true)
  const [images, setImages] = useState(true)
  const [icons, setIcons] = useState(false)

  const exportHandler = async () => {
    // Variables
    let galleryImages = null
    const appStore = (await idb.get("app-store")) || null
    let iconData = null

    const newTabOptions = (() => {
      try {
        return (
          JSON.parse(localStorage.getItem("nothing-newtab-options") || "") || {}
        )
      } catch {
        return {}
      }
    })()

    // Options
    if (images) {
      galleryImages = await idb.get("gallery-images")
    } else {
      newTabOptions.state.bgImageId = null
      newTabOptions.state.currentImageIndex = 0
    }

    if (!weather) {
      newTabOptions.state.weatherAPI = ""
      newTabOptions.state.weatherLocation = ""
    }

    if (icons) {
      iconData = Object.keys(localStorage)
        .filter((key) => key.startsWith("iconify"))
        .map((key) => ({
          key: key,
          value: localStorage.getItem(key),
        }))
    }

    // Final Object
    const finalData = {
      // To check if backup file valid, btoa not necessary just to make it look
      // like a little professional
      "backup-code": btoa("nothing-ui-newtab"),
      date: Date.now(),

      // IndexDB items
      "gallery-images": galleryImages
        ? await Promise.all(
            galleryImages.map(async (image: ImageFile) => ({
              ...image,
              file: await toBase64(image.file),
            })),
          )
        : null,
      // "app-store": appStore,
      "app-store":
        appStore.match(/"drawerApps":(\[.*?\])/)[1] !==
        JSON.stringify(initialDrawerApps)
          ? appStore
          : null,

      // LocalStorage Items
      "data-theme": localStorage.getItem("data-theme") || null,
      "query-history": queryHist
        ? localStorage.getItem("query-histories")
        : null,
      "search-engines": (() => {
        const items = localStorage.getItem("search-engines")
        return items !== JSON.stringify(initialSearchProviders) ? items : null
      })(),
      icons: iconData,
      "nothing-newtab-options": JSON.stringify(newTabOptions),
    } satisfies Backup

    // Download Link
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(finalData))}`

    const link = document.createElement("a")
    link.href = jsonString
    link.download = `nothing-ui-newtab-${Date.now()}.json`
    link.click()
    setOpen(false)
  }

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <Icon icon="mdi:cloud-upload-outline" fontSize={20} />
        Export
      </Button>
      <Modal isOpen={open} setIsOpen={setOpen}>
        <div className="flex flex-col space-y-2">
          <Checkbox
            id="weather"
            label="Weather (api, location)"
            checked={weather}
            setChecked={setWeather}
          />
          <Checkbox
            id="query-hist"
            label="Query History"
            checked={queryHist}
            setChecked={setQueryHist}
          />
          <Checkbox
            id="images"
            label="Images"
            checked={images}
            setChecked={setImages}
          />
          <Checkbox
            id="icons"
            label="Icons (cache of iconify)"
            checked={icons}
            setChecked={setIcons}
          />
          <span className="pt-4">
            <Button variant="accent" onClick={exportHandler} className="w-full">
              Export
            </Button>
          </span>
        </div>
      </Modal>
    </>
  )
}
