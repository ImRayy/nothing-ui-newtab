import { useContext } from "react"
import { SplashScreenContext } from "./context"

export default function useSplashScreen() {
  const context = useContext(SplashScreenContext)

  if (!context) {
    throw new Error(
      "useSplashScreen provider must be used within SplashScreenProvider",
    )
  }

  return context
}
