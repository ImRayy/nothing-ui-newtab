import clsx from "clsx"
import { useEffect, useRef, useState } from "react"
import { shallow } from "zustand/shallow"
import { pick } from "~/utils"
import { useOptionsStore } from "../../store/options"
import { getGreetings, parseDate } from "../../utils/datetime"

const date = new Date()

const getFirstWords = (str: string) => str.split("").splice(0, 3).join("")
const textPlaceHolder = "Click here to edit"

export const CustomText = () => {
  const {
    customText,
    setCustomText,
    enableDigitalClock: isDigitalClockEnabled,
    greetings,
    isBgImage,
  } = useOptionsStore(
    (s) =>
      pick(s, [
        "customText",
        "setCustomText",
        "enableDigitalClock",
        "greetings",
        "isBgImage",
      ]),
    shallow,
  )

  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const parentRef = useRef<HTMLDivElement>(null)
  const hiddenSpanRef = useRef<HTMLSpanElement>(null)

  const { day, month, weekDay } = parseDate(date)

  // biome-ignore lint/correctness/useExhaustiveDependencies: false
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`

      if (parentRef.current && hiddenSpanRef.current) {
        const parentWidth = parentRef.current.scrollWidth
        const textWidth = hiddenSpanRef.current.scrollWidth

        const newWidth = Math.min(
          Math.max(textWidth + (isFocused ? 40 : 20), 50),
          parentWidth,
        )
        inputRef.current.style.width = `${newWidth}px`
      }
    }
  }, [customText, isFocused])

  return (
    <div
      ref={parentRef}
      className={clsx(
        "flex w-full flex-col items-start text-foreground text-lg",
        isBgImage && "space-y-2",
      )}
    >
      <span className="invisible" ref={hiddenSpanRef}>
        {customText || textPlaceHolder}
      </span>
      <textarea
        ref={inputRef}
        id="custom-text"
        placeholder={textPlaceHolder}
        value={customText}
        onInput={(e) => setCustomText(e.currentTarget.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        spellCheck={false}
        rows={1}
        className={clsx(
          "resize-none overflow-hidden rounded-xl border-none px-2 py-1 text-foreground text-lg transition-all placeholder:text-foreground focus:border-none focus:ring-0",
          isBgImage ? "bg-card" : "bg-inherit",
        )}
      />
      {isDigitalClockEnabled ? (
        greetings && (
          <span
            className={clsx(
              "rounded-xl px-2 py-1",
              isBgImage ? " bg-card" : "bg-inherit",
            )}
          >
            {getGreetings(date)}
          </span>
        )
      ) : (
        <span
          className={clsx(
            "rounded-xl px-2 py-1",
            isBgImage ? " bg-card" : "bg-inherit",
          )}
        >{`${getFirstWords(weekDay)}, ${getFirstWords(month)} ${day}`}</span>
      )}
    </div>
  )
}
