import uFuzzy from "@leeoniya/ufuzzy"
import { motion } from "framer-motion"
import { useMemo } from "react"
import { useQueryStore } from "~/store/query-history"
import { useSearchEngineStore } from "~/store/search-engine"
import type { Query } from "~/types"
import { cn } from "~/utils"
import SuggestionItem from "./suggestion-item"

interface QuerySuggestionsProps {
  className?: string
  filterString: string | null
}

export default function QuerySuggestions(props: QuerySuggestionsProps) {
  const { className, filterString } = props

  const { list, removeQuery } = useQueryStore()

  const getSelectedEngine = useSearchEngineStore((s) => s.getSelectedEngine)

  const uf = new uFuzzy({ intraMode: 1 })

  // Filtering query from db matching user input query
  const filteredList: Query[] = useMemo(() => {
    if (!filterString) return []

    const matchedItems: Query[] = []

    const haystack = list.map(({ query }) => query)
    const idxs = uf.filter(haystack, filterString)

    if (idxs !== null && idxs.length > 0) {
      for (let i = 0; i < idxs.length; i++) {
        matchedItems.push(list[idxs[i]])
      }
    }

    return matchedItems
  }, [list, filterString, uf])

  if (filteredList.length === 0 || !filterString) {
    return null
  }

  return (
    <motion.ul
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      tabIndex={-1}
      layout
      id="query-suggestions"
      className={cn(
        "z-10 max-h-64 w-full overflow-auto rounded-xl bg-card p-1",
        className,
      )}
    >
      {filteredList.map((query) => (
        <li key={query.id}>
          <SuggestionItem
            qry={query}
            remove={() => removeQuery(query.id)}
            selectedEngine={getSelectedEngine()?.baseUrl!}
            filterString={filterString}
          />
        </li>
      ))}
    </motion.ul>
  )
}
