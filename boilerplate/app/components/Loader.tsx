import * as React from "react"

import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { StyleProp, ViewStyle } from "react-native"
import { ActivityIndicator, View } from "react-native"

export interface LoaderProps {
  loading?: boolean
  style?: StyleProp<ViewStyle>
}

export const Loader = observer(function Loader(props: LoaderProps) {
  const { style } = props
  const $styles = [$container, style]
  if (!props.loading) return null

  return (
    <View style={$loaderContainer}>
      <ActivityIndicator size="large" color={colors.palette.primary500} />
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $loaderContainer: ViewStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  zIndex: 999, // Ensure it's above other content
}
