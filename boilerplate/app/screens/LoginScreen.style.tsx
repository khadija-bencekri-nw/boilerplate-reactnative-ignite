import { colors, spacing } from "app/theme"
import { Dimensions, type ImageStyle, type TextStyle, type ViewStyle } from "react-native"

const { width } = Dimensions.get("window")
const isTablet = width > 600

export const $screenContentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: colors.background,
}

export const $backgroundImg: ViewStyle = {
  flex: 1,
}

export const $contentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  paddingTop: spacing.md,
  justifyContent: "center",
  marginTop: 10,
  paddingBottom: spacing.xxxl,
}

export const $mainContent: ViewStyle = {
  flex: 1,
  marginBottom: spacing.xxl,
  marginRight: isTablet ? 100 : 50,
  marginTop: 10,
}

export const $sideButtonContainer: ViewStyle = {
  flex: 0.2,
  alignItems: "center",
}

export const $sideButtonText: TextStyle = {
  color: colors.palette.neutral100,
}

export const $textField: ViewStyle = {
  marginBottom: spacing.xxl,
}

export const $tapButton: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

export const $textContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: spacing.xl,
  paddingTop: spacing.xxxl,
}

export const $logo: ImageStyle = {
  width: isTablet ? width * 0.05 : 80,
  height: isTablet ? width * 0.05 : 80,
  // marginBottom: spacing.xs,
}

export const $headline: TextStyle = {
  fontSize: isTablet ? 35 : 24,
  fontWeight: "bold",
  textAlign: "center",
  color: colors.palette.neutral100,
  marginBottom: spacing.sm,
  paddingTop: spacing.sm,
}

export const $secondaryButton: ViewStyle = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

export const $buttonIcon: ImageStyle = {
  width: 12,
  height: 12,
  paddingRight: 30,
}

export const $joinButtonStyle: ViewStyle = { alignItems: "center", marginTop: 20 }
