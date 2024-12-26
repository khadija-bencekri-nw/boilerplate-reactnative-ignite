import { useEffect, useState } from "react"

import { width } from "app/screens/JoinSecondScreen.style"
import type { ScaledSize } from "react-native"
import { Dimensions } from "react-native"

export const useOrientation = () => {
  const [isPortrait, setIsPortrait] = useState(true)
  const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width)

  useEffect(() => {
    const handleChange = (window: ScaledSize) => {
      setIsPortrait(window.height >= window.width)
      setScreenWidth(width)
    }
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      handleChange(window)
    })
    return () => {
      subscription.remove()
    }
  }, [])

  return { isPortrait, screenWidth }
}
