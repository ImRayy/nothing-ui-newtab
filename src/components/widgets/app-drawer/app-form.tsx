import { disableCache, enableCache, Icon } from "@iconify/react"
import clsx from "clsx"
import { motion } from "framer-motion"
import { nanoid } from "nanoid"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import Button from "~/components/ui/button"
import Input from "~/components/ui/input"
import Modal from "~/components/ui/modal"
import type { App } from "~/lib/variables"
import { useAppStore } from "~/store/app-store"
import type { Setter } from "~/types/react"
import { getDomain, googleFavIcon } from "~/utils"

const IconPreview = ({
  url,
  icon,
  btnFunc,
}: {
  url: string
  icon: string
  btnFunc: () => void
}) => {
  const [debouncedUrl] = useDebounceValue(url, 300)
  const [debouncedIcon] = useDebounceValue(icon, 300)

  useEffect(() => {
    disableCache("all")
    return () => enableCache("local")
  }, [])

  return (
    <motion.span
      layoutId="app-preview-icon"
      className="relative z-10 flex size-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-background p-4"
    >
      {!icon || icon.startsWith("webicon:") ? (
        <img
          src={googleFavIcon(debouncedUrl)}
          alt="website-favicon"
          width={40}
        />
      ) : (
        <Icon
          icon={debouncedIcon || "tdesign:icon-filled"}
          fontSize={30}
          className="text-foreground"
        />
      )}
      <Button
        variant="accent"
        onClick={btnFunc}
        className="absolute right-3 bottom-3 size-6 flex-shrink-0 p-0"
      >
        <Icon icon="tabler:pencil" fontSize={18} />
      </Button>
    </motion.span>
  )
}

interface AppFormProps {
  isOpen: boolean
  setIsOpen: Setter<boolean>
  app?: App | null
}

const AppForm = ({ isOpen, setIsOpen, app }: AppFormProps) => {
  // Store functions
  const { addDrawerApp, updateDrawerApp } = useAppStore()

  // Form vars
  const [name, setName] = useState(app?.name ?? "")
  const [url, setUrl] = useState(app?.url ?? "")
  const [icon, setIcon] = useState(app?.icon ?? "")
  const [isIconInput, setIsIconInput] = useState(false)
  const [formTitle, setFormTitle] = useState("")
  const timeoutID = useRef<number | null>(null)

  const resetFormValues = useCallback(() => {
    setName("")
    setUrl("")
    setIcon("")
    setFormTitle("ADD APP")
  }, [])

  useEffect(() => {
    if (!isOpen && timeoutID.current) {
      clearTimeout(timeoutID.current)
      timeoutID.current = null
    }
  }, [isOpen])

  useEffect(() => {
    if (!app) {
      timeoutID.current = setTimeout(() => {
        resetFormValues()
        setIsIconInput(false)
      }, 250)
      return
    }

    setName(app.name)
    setUrl(app.url)
    setIcon(app.icon)
    setFormTitle("UPDATE APP")

    if (app.icon && !app.icon.startsWith("webicon:")) {
      setIsIconInput(true)
    }
  }, [app, resetFormValues])

  const submitHandler = () => {
    if (!name || !url) return

    if (!app) {
      addDrawerApp({
        id: nanoid(),
        name,
        url,
        icon: !icon ? `webicon:${getDomain(url)}` : icon,
      })
    } else {
      updateDrawerApp(app.id, {
        id: app.id,
        name,
        url,
        icon: icon || `webicon:${getDomain(url ?? app.url)}`,
      })
    }
    setIsOpen(false)
  }

  const isSubmitBtnDisabled =
    !name ||
    !url ||
    JSON.stringify({ name: app?.name, icon: app?.icon, url: app?.url }) ===
      JSON.stringify({ name, icon, url })

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      btnFunc={submitHandler}
      btnDisabled={isSubmitBtnDisabled}
    >
      <div
        className={clsx(
          "flex gap-3",
          isIconInput ? "items-start" : "items-center",
        )}
      >
        {(url || icon) && (
          <div className="flex justify-center gap-3 pt-8">
            <IconPreview
              icon={icon}
              url={url}
              btnFunc={() => setIsIconInput((prev) => !prev)}
            />
          </div>
        )}

        <motion.div
          initial={{ x: -20, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ ease: "linear" }}
          className="w-full"
        >
          <div className="pb-3 font-medium text-sm">{formTitle}</div>
          {isIconInput && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Input
                id="add-app-icon"
                value={icon}
                onInput={(e) => setIcon(e.currentTarget.value)}
                placeholder="e.g. solar:gallery-bold"
                className="mb-2 h-11"
              />
            </motion.span>
          )}
          <motion.div layoutId="fucker" className="space-y-2">
            <Input
              id="add-app-name"
              value={name}
              onInput={(e) => setName(e.currentTarget.value)}
              placeholder="e.g. Wallhaven"
              className="h-11"
            />
            <Input
              id="add-app-url"
              value={url}
              onInput={(e) => setUrl(e.currentTarget.value)}
              placeholder="e.g. https://wallhaven.cc"
              className="h-11"
            />
          </motion.div>
        </motion.div>
      </div>
    </Modal>
  )
}

export default AppForm
