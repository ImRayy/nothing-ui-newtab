import { Icon } from "@iconify/react/dist/iconify.js"
import { useState } from "react"
import { useAppStore } from "~/store/app-store"
import type { Setter } from "../../../types/react"
import Button from "../../ui/button"
import AppForm from "./app-form"
import { appListStore } from "./selected-app.store"

interface EditAppListProps {
  removeMode: boolean
  setRemoveMode: Setter<boolean>
}

const EditAppList = ({ removeMode, setRemoveMode }: EditAppListProps) => {
  const resetDrawerApp = useAppStore((s) => s.resetDrawerApp)
  const [isOpen, setIsOpen] = useState(false)

  const { selectedApp, setSelectedApp } = appListStore()

  return (
    <>
      <div className="inline-flex gap-2">
        <Button
          size="icon"
          className="rounded-xl"
          onClick={() => setIsOpen(true)}
        >
          <Icon icon="tabler:plus" fontSize={20} />
        </Button>
        <Button
          variant={removeMode ? "destructive" : "primary"}
          size="icon"
          className="rounded-xl"
          onClick={() => setRemoveMode((prev) => !prev)}
        >
          <Icon icon="tabler:trash" fontSize={20} />
        </Button>
        <Button size="icon" className="rounded-xl" onClick={resetDrawerApp}>
          <Icon icon="material-symbols:device-reset-rounded" fontSize={20} />
        </Button>
      </div>
      <AppForm
        isOpen={isOpen || selectedApp !== null}
        setIsOpen={
          selectedApp !== null ? () => setSelectedApp(null) : setIsOpen
        }
        app={selectedApp}
      />
    </>
  )
}

export default EditAppList
