import { shallow } from "zustand/shallow"
import { useOptionsStore } from "~/store/options"
import { pick } from "~/utils"
import OptionsGroup from "../shared/options-group"
import TabSwitchButton from "../shared/tab-switch-button"
import ToggleOption from "../shared/toggle-option"
import IntervalInput from "./interval-input"

const GalleryOptions = () => {
  const {
    isBgImage,
    toggleBgImage,
    isMonochromeWidgetImg,
    toggleMonochromeWidgetImg,
    isMonochromeBg,
    toggleMonochromeBg,
    isBgBlur,
    toggleBgBlur,
  } = useOptionsStore(
    (s) =>
      pick(s, [
        "isBgImage",
        "toggleBgImage",
        "isMonochromeWidgetImg",
        "toggleMonochromeWidgetImg",
        "isMonochromeBg",
        "toggleMonochromeBg",
        "isBgBlur",
        "toggleBgBlur",
      ]),
    shallow,
  )

  return (
    <OptionsGroup title="Gallery">
      <ToggleOption
        label="Enable background image"
        enabled={isBgImage}
        onChange={toggleBgImage}
      />
      <ToggleOption
        label="Monochrome background"
        enabled={isMonochromeBg}
        onChange={toggleMonochromeBg}
        disabled={!isBgImage}
      />
      <ToggleOption
        label="Blur background"
        enabled={isBgBlur}
        onChange={toggleBgBlur}
        disabled={!isBgImage}
      />
      <ToggleOption
        label="Monochrome images"
        desc="For gallery widget"
        enabled={isMonochromeWidgetImg}
        onChange={toggleMonochromeWidgetImg}
      />
      <TabSwitchButton
        title="Image Gallery"
        desc="Upload images for widget"
        icon="solar:gallery-bold"
        tabToSwitch="gallery"
      />
      <IntervalInput />
    </OptionsGroup>
  )
}

export default GalleryOptions
