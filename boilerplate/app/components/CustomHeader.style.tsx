import { colors } from "app/theme"
import type { TextStyle, ViewStyle } from "react-native"

export const $header: ViewStyle = {
  height: 120,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: colors.background,
  borderBottomWidth: 1,
  borderBottomColor: colors.palette.neutral600,
  paddingTop: 20,
  padding: 10,
}

export const $iconContainerLeft: ViewStyle = {
  flex: 1.5,
  marginLeft: 20,
}

export const $centerContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "center",
}

export const $balanceContainer: ViewStyle = {
  flex: 1,
  marginRight: 15,
}

export const $purchaseContainer: ViewStyle = {
  flex: 1,
  marginLeft: 15,
}

export const $balanceText: TextStyle = {
  color: colors.palette.neutral100,
}

export const $infoContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

export const $infoText: TextStyle = {
  color: colors.palette.neutral400,
}

export const $infoIcon: ViewStyle = {
  marginLeft: 5,
}

export const $iconContainerRight: ViewStyle = {
  flex: 1.5,
  flexDirection: "row",
  justifyContent: "flex-end",
  paddingRight: 10,
}

export const $circle: ViewStyle = {
  width: 50,
  height: 50,
  backgroundColor: colors.palette.nwColor,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 5,
  paddingTop: 5,
}

export const $transparentBackground: ViewStyle = {
  backgroundColor: "transparent",
}

export const $initials: TextStyle = {
  color: "white",
  fontSize: 24,
  fontWeight: "bold",
  alignSelf: "center",
}
