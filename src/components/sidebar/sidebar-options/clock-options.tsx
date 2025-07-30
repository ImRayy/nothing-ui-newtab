import { shallow } from "zustand/shallow"
import { pick } from "~/utils"
import { useOptionsStore } from "../../../store/options"
import OptionsGroup from "./shared/options-group"
import ToggleOption from "./shared/toggle-option"

const ClockOptions = () => {
  const {
    enableDigitalClock,
    toggleDidigtalClock,
    format24,
    toggleFormat24,
    greetings,
    toggelGreetings,
  } = useOptionsStore(
    (s) =>
      pick(s, [
        "enableDigitalClock",
        "toggleDidigtalClock",
        "format24",
        "toggleFormat24",
        "greetings",
        "toggelGreetings",
      ]),
    shallow,
  )
  return (
    <OptionsGroup title="Clock">
      <ToggleOption
        label="Digital clock"
        enabled={enableDigitalClock}
        onChange={toggleDidigtalClock}
      />
      <ToggleOption
        label="24 hours format"
        enabled={format24}
        onChange={toggleFormat24}
        disabled={!enableDigitalClock}
      />
      <ToggleOption
        label="Greeting message"
        enabled={greetings}
        onChange={toggelGreetings}
        disabled={!enableDigitalClock}
      />
    </OptionsGroup>
  )
}

export default ClockOptions
