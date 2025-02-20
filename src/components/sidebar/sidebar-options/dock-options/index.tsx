import { disableCache, enableCache } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import Button from "~/components/ui/button"
import type { App } from "~/lib/variables"
import { useAppStore } from "~/store/app-store"
import { extractUniqueValues } from "~/utils"
import AppCard from "../shared/app-card"
import NewTabHeader from "../shared/newtab-header"

const DockOptions = () => {
  const [newApp, setNewApp] = useState<App | null>(null)
  const { addDockApp, dockApps, resetDockApp, updateDockApp, removeDockApp } =
    useAppStore()

  const addNewApp = () => {
    setNewApp({
      id: nanoid(),
      name: "",
      icon: "fe:bookmark",
      url: "",
    })
  }

  const saveEngineHandler = () => {
    if (!newApp) return

    if (Object.values(newApp).some((v) => v === "")) {
      alert("You must fill all the fields")
    } else {
      if (!dockApps.find(({ name }) => name === newApp.name)) {
        addDockApp(newApp)
        setNewApp(null)
      } else {
        alert(`App with name ${newApp.name} already exists`)
      }
    }
  }

  useEffect(() => {
    disableCache("all")
    return () => enableCache("local")
  }, [])

  return (
    <div className="space-y-6">
      <NewTabHeader
        rightButtons={
          <>
            <Button
              variant="secondary"
              size="icon"
              iconSize={20}
              icon="material-symbols:device-reset-rounded"
              onClick={resetDockApp}
            />
            <Button
              variant="secondary"
              size="icon"
              iconSize={20}
              icon="ic:round-plus"
              onClick={addNewApp}
            />
          </>
        }
      />
      <motion.div layout>
        {newApp && (
          <div className="rounded-xl bg-background">
            <AppCard app={newApp} setApp={setNewApp} />
            <div className="grid grid-cols-2 gap-3 p-4 pt-0">
              <Button onClick={() => setNewApp(null)}>Cancel</Button>
              <Button variant="accent" onClick={saveEngineHandler}>
                Save
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      <div className="h-full space-y-5">
        {dockApps.map((app) => (
          <motion.div layout key={`app-${app.name}`}>
            <AppCard
              cardLabel="App"
              app={app}
              appNames={extractUniqueValues(dockApps, "name", app.name)}
              update={updateDockApp}
              remove={removeDockApp}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default DockOptions
