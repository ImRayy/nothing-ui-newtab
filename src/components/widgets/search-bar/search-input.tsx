import { Icon } from "@iconify/react"
import { type FormEvent, lazy, Suspense, useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import Button from "~/components/ui/button"
import { useOptionsStore } from "~/store/options"
import { useQueryStore } from "~/store/query-history"
import { useSearchEngineStore } from "~/store/search-engine"
import { checkUrlPrefix, getDomain, trimSpaces } from "~/utils"
import Input from "../../ui/input"

const QuerySuggestions = lazy(() => import("./query-suggestions"))

// This function is only valid for https://logo.clearbit.com as
// it returns nothing if domain isn't valid
// FIX: Make this a proper api checking rather than this, works but ehh!!
function isImage(query: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = `https://logo.clearbit.com/${query}`
  })
}

const SearchInput = () => {
  const { searchEngines, selectedEngine, setSelectedEngine } =
    useSearchEngineStore()
  const isQrySuggEnabled = useOptionsStore((s) => s.isQuerySuggestions)

  const [query, setQuery] = useState("")
  const addQuery = useQueryStore((s) => s.addQuery)
  const [debouncedQuery] = useDebounceValue<string>(query, 500)

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const baseUrl = searchEngines.find(
      ({ name }) => name === selectedEngine,
    )?.baseUrl

    if (baseUrl) {
      const url = checkUrlPrefix(query) ? query : new URL(baseUrl + query)
      const domain = getDomain(url.toString())
      const href = url.toString().startsWith("www.")
        ? `https://${domain}`
        : url.toString()

      if (isQrySuggEnabled) {
        try {
          const isImgFound = await isImage(domain)
          addQuery({ query, isIcon: isImgFound, id: crypto.randomUUID() })
        } catch {
          addQuery({ query, isIcon: false, id: crypto.randomUUID() })
        } finally {
          window.location.href = href
        }
      } else {
        window.location.href = href
      }
    }
  }

  useEffect(() => {
    if (
      debouncedQuery.startsWith("!") &&
      debouncedQuery.substring(0, 2).length > 1
    ) {
      const querySlices = query.split(" ")
      const short = querySlices[0].slice(1)
      if (short && short.length > 0) {
        const newEngine = searchEngines.find(
          (provider) => provider.short === short,
        )
        if (newEngine) {
          setSelectedEngine(newEngine.name)
          setQuery(querySlices.slice(1).join(" "))
        }
      }
    }
  }, [searchEngines, debouncedQuery, setSelectedEngine, query])

  return (
    <div className="relative">
      <form
        onSubmit={submitHandler}
        className="inline-flex w-full items-center gap-4 overflow-hidden rounded-xl bg-card p-2"
      >
        <span>
          <div className="flex size-11 items-center rounded-lg bg-foreground text-background">
            <Icon icon="tabler:search" className="mx-auto" />
          </div>
        </span>
        <Input
          id="search-engine-query"
          outline="ghost"
          value={query}
          onInput={(e) => setQuery(e.currentTarget.value)}
          autoFocus
          placeholder="Type here..."
          className="h-11 w-full bg-card px-0 text-base text-card-foreground"
          autoComplete="off"
        />
        <Button
          type="submit"
          tabIndex={isQrySuggEnabled ? -1 : 0}
          variant="destructive"
          className="rounded-lg"
          disabled={!query}
        >
          Search
        </Button>
      </form>
      <Suspense>
        {isQrySuggEnabled && (
          <QuerySuggestions
            className="absolute mt-2"
            filterString={trimSpaces(query)}
          />
        )}
      </Suspense>
    </div>
  )
}

export default SearchInput
