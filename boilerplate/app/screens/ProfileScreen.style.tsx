import { colors, spacing } from "app/theme"
import type { TextStyle, ViewStyle } from "react-native"

// Root container style
export const $root: ViewStyle = {
  flexGrow: 1,
  backgroundColor: colors.background,
  padding: 30,
}

// Inner container style
export const $container: ViewStyle = {
  marginVertical: 20,
}

// Title text style
export const $title: TextStyle = {
  color: "white",
  fontSize: 22,
  marginHorizontal: 10,
  paddingBottom: 15,
  fontWeight: "900",
}

export const $separator: ViewStyle = {
  backgroundColor: colors.palette.neutral500,
  height: 1,
  width: "100%",
  marginBottom: 30,
}

export const $infoContainer: ViewStyle = { flexDirection: "row", justifyContent: "space-around" }

export const $textField: ViewStyle = {
  marginHorizontal: 10,
  flex: 1,
  borderColor: colors.palette.neutral500,
}

export const $disabledTextStyle: TextStyle = { color: colors.palette.neutral500 }
export const $activeTextStyle: TextStyle = { color: colors.palette.neutral500 }
export const $disabledWrapperStyle: ViewStyle = { borderColor: colors.palette.neutral500 }
export const $labelTextPropsStyle: TextStyle = { paddingTop: 15, marginBottom: 0 }

export const $button: ViewStyle = {
  marginBottom: spacing.xs,
  width: 120,
  borderRadius: 40,
  marginHorizontal: 20,
  borderWidth: 1,
  borderColor: colors.palette.neutral100,
}

export const $checkViewContainer: ViewStyle = {
  flexDirection: "row",
  marginBottom: 30,
  justifyContent: "space-between",
}

export const $checkTextContainer: ViewStyle = { marginHorizontal: 10, justifyContent: "flex-start" }

export const $checkBoxTitle: TextStyle = {
  color: "white",
  fontSize: 18,
  fontWeight: "bold",
  paddingBottom: 5,
}

export const $checkBoxSubTitle: TextStyle = { color: colors.palette.neutral500, fontWeight: "400" }

export const $picketStyle: ViewStyle = { marginVertical: 35 }

export const $actionButtonContainer: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-end",
}

export const $cancelTextStyle: TextStyle = { color: colors.palette.neutral100 }

export const $largeButtonStyle: ViewStyle = { width: 250 }
