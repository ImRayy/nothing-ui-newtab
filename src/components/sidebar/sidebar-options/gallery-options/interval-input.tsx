import clsx from "clsx"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import Input from "~/components/ui/input"
import { useOptionsStore } from "~/store/options"

const IntervalInput = () => {
  const gallaryImageInterval = useOptionsStore((s) => s.gallaryImageInterval)
  const setGallaryImageInterval = useOptionsStore(
    (s) => s.setGallaryImageInterval,
  )
  const [value, setValue] = useState(gallaryImageInterval)
  const [dValue] = useDebounceValue(value, 1400)

  useEffect(() => {
    setGallaryImageInterval(dValue)
  }, [dValue, setGallaryImageInterval])

  return (
    <div>
      <span>Gallery image switch interval</span>
      <p className="mb-2 text-foreground/60 text-sm">
        It will be saved automatically upon input, and the time is measured in
        seconds
      </p>
      <Input
        type="number"
        id="gallery-interval-input"
        className={clsx([
          value !== gallaryImageInterval
            ? "focus:ring-destructive"
            : "focus:ring-green-600",
        ])}
        value={value}
        onInput={(e) => setValue(Number.parseInt(e.currentTarget.value))}
        placeholder="Gallary image switch interval"
      />
    </div>
  )
}

export default IntervalInput
