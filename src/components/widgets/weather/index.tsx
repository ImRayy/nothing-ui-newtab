import { motion } from "framer-motion"
import { useEffect, useMemo, useState } from "react"
import { shallow } from "zustand/shallow"
import { icons } from "~/lib/icons"
import { useOptionsStore } from "~/store/options"
import { useThemeStore } from "~/store/theme"
import type { CurrentWeather } from "~/types/weather"
import { pick } from "~/utils"

const Weather = () => {
  const { weatherAPI, weatherLocation, isScaleFahrenheit, showLocation } =
    useOptionsStore(
      (s) =>
        pick(s, [
          "weatherAPI",
          "weatherLocation",
          "isScaleFahrenheit",
          "showLocation",
        ]),
      shallow,
    )
  const isLightMode = useThemeStore((s) => s.isLightMode)
  const [loading, setLoading] = useState(true)

  const [weatherData, setWeatherData] = useState<CurrentWeather | null>(null)
  useEffect(() => {
    if (weatherData) return
    ;(async () => {
      try {
        const data = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${weatherLocation}&appid=${weatherAPI || import.meta.env.VITE_WEATHER_API}`,
        )
        if (data.ok) {
          const jsonData = await data.json()
          setWeatherData(jsonData)
        }
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    })()
  }, [weatherData, weatherAPI, weatherLocation])

  const weatherIcon = useMemo(() => {
    const hours = new Date().getHours()
    const isDay = hours <= 18 && hours > 6
    const altImg = `https://openweathermap.org/img/wn/${weatherData?.weather[0].icon}@2x.png`

    const status = weatherData?.weather[0].main.toLowerCase()
    if (!status) return altImg

    return (
      // biome-ignore lint/suspicious/noExplicitAny: <too much work>
      (icons.weather_icons as any)[status]?.[isDay ? "day" : "night"] || altImg
    )
  }, [weatherData])

  return (
    <motion.div className="size-48 select-none rounded-xl bg-card p-3 text-card-foreground">
      {weatherData ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex h-full flex-col items-center justify-between"
        >
          <span className="text-lg">
            {isScaleFahrenheit
              ? convertFromKelvin(weatherData.main.temp, "F")
              : convertFromKelvin(weatherData.main.temp, "C")}
            &deg;{isScaleFahrenheit ? "F" : "C"}
          </span>
          <img
            src={weatherIcon}
            alt="wather-icon"
            width={78}
            style={isLightMode ? { filter: "invert(1)" } : {}}
          />
          <span>
            {showLocation ? weatherData.weather[0]?.main : weatherData.name}
          </span>
        </motion.div>
      ) : (
        !loading && (
          <p className="h-full px-2 font-bold font-rubik text-sm">
            Make sure your given location and API Key is valid
          </p>
        )
      )}
    </motion.div>
  )
}

function convertFromKelvin(kelvin: number, to: "F" | "C") {
  const celcious = kelvin - 273.15
  if (to === "F") {
    return Math.round((celcious * 9) / 5 + 32)
  }
  return Math.round(celcious)
}

export default Weather
