import { Icon } from "@iconify/react/dist/iconify.js"
import { useOptionsStore } from "~/store/options"
import { googleFavIcon } from "~/utils"

interface AppIconProps {
  icon: string
  iconSize?: number
  className?: string
}

export default function AppIcon({ icon, iconSize, className }: AppIconProps) {
  const isMonochromeEnabled = useOptionsStore((s) => s.isMonochromeIcon)
  return (
    <span style={{ width: iconSize }} className={className}>
      {icon && !icon.startsWith("webicon:") ? (
        <Icon icon={icon} className="size-full" />
      ) : (
        <img
          src={googleFavIcon(icon.split(":")[1])}
          alt="icon-image"
          style={isMonochromeEnabled ? { filter: "grayscale(100%)" } : {}}
          className="size-full"
        />
      )}
    </span>
  )
}
