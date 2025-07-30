import { Icon } from "@iconify/react/dist/iconify.js"
import clsx from "clsx"
import { shallow } from "zustand/shallow"
import { useSearchEngineStore } from "~/store/search-engine"
import { pick } from "~/utils"

const SearchEngines = () => {
  const { searchEngines, selectedEngine, setSelectedEngine } =
    useSearchEngineStore(
      (s) => pick(s, ["searchEngines", "selectedEngine", "setSelectedEngine"]),
      shallow,
    )

  return (
    <div className="flex flex-wrap gap-3">
      {searchEngines.map(({ name, icon }) => (
        <button
          type="button"
          key={name}
          className="inline-flex items-center gap-2 rounded-xl bg-card p-1 pr-4 font-medium text-card-foreground text-sm transition-colors hover:bg-card-hover"
          onClick={() => setSelectedEngine(name)}
        >
          <span
            className={clsx(
              "inline-flex size-9 items-center justify-center rounded-lg bg-background text-sm",
              selectedEngine === name && "bg-foreground text-background",
            )}
          >
            <Icon icon={icon} fontSize={16} />
          </span>
          {name}
        </button>
      ))}
    </div>
  )
}

export default SearchEngines
