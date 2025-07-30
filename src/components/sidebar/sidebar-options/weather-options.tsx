import { useState } from "react"
import { shallow } from "zustand/shallow"
import { pick } from "~/utils"
import { useOptionsStore } from "../../../store/options"
import Button from "../../ui/button"
import Input from "../../ui/input"
import OptionsGroup from "./shared/options-group"
import ToggleOption from "./shared/toggle-option"

const WeatherOptions = () => {
  const {
    weatherAPI,
    setWeatherAPI,
    weatherLocation,
    setWeatherLocation,
    isScaleFahrenheit,
    toggleFahrenheitScale,
    showLocation,
    toggleShowLocation,
  } = useOptionsStore(
    (s) =>
      pick(s, [
        "weatherAPI",
        "setWeatherAPI",
        "weatherLocation",
        "setWeatherLocation",
        "isScaleFahrenheit",
        "toggleFahrenheitScale",
        "showLocation",
        "toggleShowLocation",
      ]),
    shallow,
  )

  const [api, setApi] = useState(weatherAPI)
  const [location, setLocation] = useState(weatherLocation)

  return (
    <OptionsGroup title="Weather">
      <ToggleOption
        label="Fahrenheit"
        enabled={isScaleFahrenheit}
        onChange={toggleFahrenheitScale}
      />
      <ToggleOption
        label="Show Location"
        desc="If disabled, only the weather condition will be shown instead of the location."
        enabled={showLocation}
        onChange={toggleShowLocation}
      />
      <div className="flex h-full flex-col items-end gap-2">
        <Input
          id="weather-location"
          placeholder="Enter Location"
          value={location}
          onInput={(e) => setLocation(e.currentTarget.value)}
        />
        <Button
          variant="secondary"
          onClick={() => {
            setWeatherLocation(location)
            window.location.reload()
          }}
        >
          Save
        </Button>
      </div>
      <div className="flex h-full flex-col items-end gap-2">
        <Input
          type="password"
          id="weather-api"
          placeholder="Enter Api Key"
          value={api}
          onInput={(e) => setApi(e.currentTarget.value)}
        />
        <div className="inline-flex w-full items-center justify-between">
          <a
            href="https://openweathermap.org/price"
            className="pl-1 decoration-destructive underline-offset-4 transition-all hover:underline"
          >
            Learn More
          </a>
          <Button
            variant="secondary"
            onClick={() => {
              setWeatherAPI(api)
              window.location.reload()
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </OptionsGroup>
  )
}

export default WeatherOptions
