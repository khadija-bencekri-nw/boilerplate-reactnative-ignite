import * as React from "react"
import { ActivityIndicator, StyleProp, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"

export interface LoaderProps {
  loading ?: boolean
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Loader = observer(function Loader(props: LoaderProps) {
  const { style } = props
  const $styles = [$container, style]
  if (!props.loading) return null;

  return (
    <View style={$loaderContainer}>
      <ActivityIndicator size="large" color="#6200EE" />
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
