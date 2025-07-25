import { useRegisterSW } from "virtual:pwa-register/react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { nanoid } from "nanoid"
import { toast } from "sonner"
import { create } from "zustand"

export const useSWStore = create<{
  url: string | null
  registration: ServiceWorkerRegistration | null
}>(() => ({
  url: null,
  registration: null,
}))

export default function PWAUpdatePrompt() {
  // Check for update every 30 minutes
  const period = 30 * 60 * 1000

  const {
    offlineReady: [_, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      useSWStore.setState({ url: swUrl, registration: r })
      if (period <= 0) return
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r)
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r)
        })
      }
    },
  })

  const showUpdateToast = () =>
    toast.info("New update available", {
      duration: Number.POSITIVE_INFINITY,
      icon: <Icon icon="tabler:rosette-discount-check" fontSize={23} />,
      onDismiss: () => {
        setOfflineReady(false)
        setNeedRefresh(false)
      },
      action: {
        label: "Update",
        onClick: () => updateServiceWorker(true),
      },
    })

  if (needRefresh) {
    showUpdateToast()
  }

  return null
}

/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration,
) {
  if (period <= 0) return

  setInterval(async () => checkForAppUpdate(swUrl, r), period)
}

export async function checkForAppUpdate(
  swUrl: string,
  r: ServiceWorkerRegistration,
) {
  const toastId = nanoid()
  toast.loading("Checking for updates...", { id: toastId })

  if ("onLine" in navigator && !navigator.onLine) {
    toast.dismiss(toastId)
    return
  }

  const resp = await fetch(swUrl, {
    cache: "no-store",
    headers: {
      cache: "no-store",
      "cache-control": "no-cache",
    },
  })

  if (resp?.status === 200) await r.update()

  toast.dismiss(toastId)
}
