import { Icon } from "@iconify/react/dist/iconify.js"
import { forwardRef } from "react"
import { useOptionsStore } from "~/store/options"
import { googleFavIcon } from "~/utils"

interface AppIconProps {
  icon: string
  iconSize?: number
  className?: string
}

const AppIcon = forwardRef<HTMLSpanElement, AppIconProps>(
  ({ icon, iconSize, className, ...props }, ref) => {
    const isMonochromeEnabled = useOptionsStore((s) => s.isMonochromeIcon)
    return (
      <span
        ref={ref}
        style={{ width: iconSize }}
        className={className}
        {...props}
      >
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
  },
)

export default AppIcon
