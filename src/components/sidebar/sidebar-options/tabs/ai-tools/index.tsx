import { disableCache, enableCache, Icon } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
import { nanoid } from "nanoid"
import { useEffect, useState } from "react"
import Button from "~/components/ui/button"
import type { App } from "~/lib/variables"
import { useAppStore } from "~/store/app-store"
import { extractUniqueValues } from "~/utils"
import AppCard from "../../shared/app-card"
import NewTabHeader from "../../shared/newtab-header"

const AIToolsTab = () => {
  const {
    aiTools,
    addAITool: add,
    resetAITools: reset,
    updateAITool,
    removeAITool,
  } = useAppStore()
  const [newAITool, setNewAITool] = useState<App | null>(null)

  const addNewAITool = () => {
    setNewAITool({ id: nanoid(), name: "", icon: "mingcute:ai-fill", url: "" })
  }

  const saveEngineHandler = () => {
    if (!newAITool) return

    if (!aiTools.find(({ name }) => name === newAITool.name)) {
      add(newAITool)
      setNewAITool(null)
    } else {
      alert(
        "The name for the new AI tool must be unique. Please choose a different one",
      )
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
            <Button variant="secondary" size="icon" onClick={reset}>
              <Icon
                icon="material-symbols:device-reset-rounded"
                fontSize={20}
              />
            </Button>
            <Button variant="secondary" size="icon" onClick={addNewAITool}>
              <Icon icon="ic:round-plus" fontSize={20} />
            </Button>
          </>
        }
      />
      <div className="space-y-3">
        <motion.div layout>
          {newAITool && (
            <div className="rounded-xl bg-background">
              <AppCard app={newAITool} setApp={setNewAITool} />
              <div className="grid grid-cols-2 gap-3 p-4 pt-0">
                <Button onClick={() => setNewAITool(null)}>Cancel</Button>
                <Button variant="accent" onClick={saveEngineHandler}>
                  Save
                </Button>
              </div>
            </div>
          )}
        </motion.div>
        {aiTools.map((tool) => (
          <motion.div layout key={`ai-tool-card-${tool.name}`}>
            <AppCard
              cardLabel="AI Tool"
              app={tool}
              appNames={extractUniqueValues(aiTools, "name", tool.name)}
              update={updateAITool}
              remove={removeAITool}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AIToolsTab
