import { colors, spacing } from "../theme"

import type { ImageStyle, TextStyle, ViewStyle } from "react-native"
import { Dimensions } from "react-native"

export const { width } = Dimensions.get("window")
export const isTablet = width > 600

/* Styles */

export const $screenContentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: colors.background,
}

export const $backgroundImage: ViewStyle = {
  flex: 1,
}

export const $balanceTextContainer: ViewStyle = { flex: 2 }

export const $balanceInput: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "flex-end",
}

export const $balanceIconContainer: ViewStyle = { justifyContent: "center" }

export const $contentContainer: ViewStyle = {
  flexDirection: "row",
  flex: 1,
  paddingVertical: spacing.xl,
  justifyContent: "center",
}

export const $mainContent: ViewStyle = {
  flex: 1,
  paddingTop: 80,
  paddingBottom: spacing.xxl,
}

export const $errorText: TextStyle = {
  color: "red",
  marginBottom: spacing.sm,
  textAlign: "center",
}

export const $enterDetails: TextStyle = {
  color: colors.palette.neutral100,
  // marginBottom: spacing.sm,
}

export const $sideButtonContainer: ViewStyle = {
  flex: 0.3,
  alignItems: "center",
}

export const $sideButtonText: TextStyle = {
  color: colors.palette.neutral100,
  alignSelf: "center",
  fontSize: isTablet ? 20 : 12,
}

export const $sideButtonTextPortrait: TextStyle = {
  color: colors.palette.neutral100,
  alignSelf: "center",
  fontSize: isTablet ? 16 : 12,
}

export const $darkText: TextStyle = {
  color: colors.palette.neutral900,
}

export const $pickRole: TextStyle = {
  marginTop: spacing.md,
  color: colors.palette.neutral100,
}

export const $selectionContainer: ViewStyle = {
  backgroundColor: colors.palette.neutral760,
  borderWidth: 1,
  borderColor: colors.palette.neutral710,
  marginBottom: 10,
  borderRadius: 5,
  flexDirection: "row",
  alignItems: "center",
  height: 55,
  paddingLeft: 20,
}

export const $selectionIcon: ImageStyle = {
  marginRight: 15,
}

export const $selectionText: TextStyle = {
  color: colors.palette.neutral100,
}

export const $balanceContainer: ViewStyle = {
  ...$selectionContainer,
  paddingLeft: 0,
  paddingRight: 0,
  flexDirection: "row",
}

export const $balanceText: TextStyle = {
  color: colors.palette.neutral400,
  fontSize: 12,
  marginHorizontal: spacing.sm,
}

export const $balanceIcon: ImageStyle = {
  marginLeft: 15,
}

export const $primaryButton: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

export const $secondaryButton: ViewStyle = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

export const $loader: ViewStyle = {
  marginTop: 20,
}

export const $actionIconStyle: ImageStyle = { alignSelf: "center" }

export const $roleSelector: ViewStyle = { flex: 2, flexDirection: "row" }

export const $selectedRole: ViewStyle = { flex: 1, alignItems: "flex-end", paddingRight: 15 }
