import { Icon } from "@iconify/react/dist/iconify.js"
import { forwardRef } from "react"
import { useOptionsStore } from "~/store/options"
import { googleFavIcon } from "~/utils"

interface AppIconProps {
  icon: string
  iconSize?: number
  className?: string
}

const AppIcon = forwardRef<HTMLDivElement, AppIconProps>(
  ({ icon, iconSize, className, ...props }, ref) => {
    const isMonochromeEnabled = useOptionsStore((s) => s.isMonochromeIcon)
    const isWebIcon = icon.startsWith("webicon:")
    return (
      <div
        ref={ref}
        style={{ width: !isWebIcon ? iconSize : (iconSize || 0) * 1.38 }}
        className={className}
        {...props}
      >
        {icon && !isWebIcon ? (
          <Icon icon={icon} className="size-full" />
        ) : (
          <img
            src={googleFavIcon(icon.split(":")[1])}
            alt="icon-image"
            style={isMonochromeEnabled ? { filter: "grayscale(100%)" } : {}}
            className="size-full rounded-full"
          />
        )}
      </div>
    )
  },
)

export default AppIcon
