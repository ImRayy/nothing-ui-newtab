import { disableCache, enableCache, Icon } from "@iconify/react/dist/iconify.js"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Button from "~/components/ui/button"
import { type SearchEngine, useSearchEngineStore } from "~/store/search-engine"
import { extractUniqueValues } from "~/utils"
import NewTabHeader from "../../shared/newtab-header"
import SearchEngineCard from "./search-engine-card"

const SearchEnginesTab = () => {
  const { searchEngines, add, reset, update, remove } = useSearchEngineStore()
  const [newEngine, setNewEngine] = useState<SearchEngine | null>(null)

  const addNewEngine = () => {
    setNewEngine({
      name: "",
      short: "",
      icon: "tdesign:internet",
      baseUrl: "https://",
    })
  }

  const saveEngineHandler = () => {
    if (!newEngine) return

    if (
      !searchEngines.find(
        ({ name, short }) =>
          name === newEngine.name || short === newEngine.short,
      )
    ) {
      add(newEngine)
      setNewEngine(null)
    } else {
      alert(
        "The name or shortcut for the new engine must be unique. Please choose a different one",
      )
    }
  }

  useEffect(() => {
    disableCache("all")
    return () => enableCache("local")
  }, [])

  return (
    <div className="space-y-3">
      <NewTabHeader
        rightButtons={
          <>
            <Button variant="secondary" size="icon" onClick={reset}>
              <Icon
                icon="material-symbols:device-reset-rounded"
                fontSize={20}
              />
            </Button>
            <Button variant="secondary" size="icon" onClick={addNewEngine}>
              <Icon icon="ic:round-plus" />
            </Button>
          </>
        }
      />
      <motion.div layout className="pt-3">
        {newEngine && (
          <div className="rounded-xl bg-background">
            <SearchEngineCard
              index={searchEngines.length}
              engine={newEngine}
              setEngine={setNewEngine}
            />
            <div className="flex gap-4 p-4 pt-0">
              <Button
                className="ml-auto h-9 w-full"
                onClick={() => setNewEngine(null)}
              >
                Cancel
              </Button>
              <Button
                variant="accent"
                className="ml-auto h-9 w-full"
                onClick={saveEngineHandler}
                disabled={!newEngine?.name || !newEngine?.baseUrl}
              >
                Save
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      <div className="space-y-3">
        {searchEngines.map((engine, index) => (
          <motion.div layout key={`search-engine-card-${engine.name}`}>
            <SearchEngineCard
              index={index}
              engine={engine}
              engineNames={extractUniqueValues(
                searchEngines,
                "name",
                engine.name,
              )}
              engineShortcuts={extractUniqueValues(
                searchEngines,
                "short",
                engine.short,
              )}
              update={update}
              remove={remove}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default SearchEnginesTab
