import { colors, typography } from "app/theme"
import type { TextStyle, ViewStyle } from "react-native"

export const $overlay: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
}

export const $container: ViewStyle = {
  padding: 20,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 10,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
}

export const $title: TextStyle = {
  alignSelf: "center",
  fontFamily: typography.primary.bold,
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 20,
  color: colors.palette.primary500,
}

export const $message: TextStyle = {
  fontSize: 14,
  textAlign: "center",
  color: "black",
}

export const $actionsContainer: ViewStyle = {
  marginTop: 20,
  flexDirection: "row",
  justifyContent: "center",
}

export const $button: ViewStyle = {
  padding: 10,
  backgroundColor: colors.palette.primary500,
  borderRadius: 5,
  alignItems: "center",
}

export const $buttonText: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.neutral100,
}
