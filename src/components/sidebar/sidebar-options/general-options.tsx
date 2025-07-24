import { Icon } from "@iconify/react/dist/iconify.js"
import { checkForAppUpdate, useSWStore } from "~/components/pwa/update-prompt"
import Button from "~/components/ui/button"
import { useThemeStore } from "~/store/theme"
import OptionsGroup from "./shared/options-group"
import TabSwitchButton from "./shared/tab-switch-button"
import ToggleOption from "./shared/toggle-option"

const GeneralOptions = () => {
  const { isLightMode, toggleLightMode } = useThemeStore()
  const { registration, url } = useSWStore()

  return (
    <OptionsGroup title="General">
      <ToggleOption
        label="Enable light mode"
        enabled={isLightMode}
        onChange={toggleLightMode}
      />
      <TabSwitchButton
        title="Search Engines"
        desc="Add, edit, update, delete ai links"
        icon="tdesign:internet"
        tabToSwitch="search-engines"
      />
      <Button
        className="justify-between px-0 hover:bg-inherit"
        hidden={!url || !registration}
        onClick={() => {
          if (url && registration) {
            checkForAppUpdate(url, registration)
          }
        }}
      >
        Check for updates
        <Icon icon="tabler:reload" fontSize={20} />
      </Button>
    </OptionsGroup>
  )
}

export default GeneralOptions
