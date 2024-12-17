import * as React from "react"
import { useState } from "react"

import { FontAwesome } from "@expo/vector-icons"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { StyleProp, ViewStyle } from "react-native"
import { TouchableOpacity, View } from "react-native"

export interface RatingProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>

  starsContainerStyle?: StyleProp<ViewStyle>

  /**
   * Maximum number of stars.
   */
  maxRating?: number

  /**
   * Initial rating value.
   */
  initialRating?: number

  /**
   * Function to handle rating changes.
   */
  onRatingChange?: (rating: number) => void

  /**
   * Size of the stars.
   */
  starSize?: number

  /**
   * Color of the stars.
   */
  starColor?: string

  disabled?: boolean
}

/**
 * Rating component with customizable stars.
 */
export const Rating = observer(function Rating(props: RatingProps) {
  const {
    style,
    maxRating = 5,
    initialRating = 0,
    onRatingChange,
    starSize = 20,
    starColor = colors.palette.primary300,
    starsContainerStyle,
    disabled,
  } = props
  const [rating, setRating] = useState(initialRating)

  const handleRatingPress = (rate: number) => {
    setRating(rate)
    if (onRatingChange != null) {
      onRatingChange(rate)
    }
  }

  return (
    <View style={[$container, style]}>
      <View style={[$starsContainer, starsContainerStyle]}>
        {Array.from({ length: maxRating }, (_, index) => (
          <TouchableOpacity
            key={index}
            disabled={disabled}
            onPress={() => {
              handleRatingPress(index + 1)
            }}
          >
            <FontAwesome
              name={rating > index ? "star" : "star-o"}
              size={starSize}
              color={starColor}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
}

const $starsContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
}
