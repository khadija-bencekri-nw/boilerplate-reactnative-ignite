import React from "react"

import { Icon } from "../components" // Adjust the import based on your icon component
import { colors } from "../theme"

import type { DrawerNavigationProp } from "@react-navigation/drawer"
import { StackActions } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { TextStyle, ViewStyle } from "react-native"
import { Text, TouchableOpacity, View } from "react-native"

type CustomHeaderProps = {
  navigation?: DrawerNavigationProp<any> | NativeStackNavigationProp<any>
  source?: string
  onDrawerToggle?: () => void
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ onDrawerToggle, navigation, source }) => {
  const sourceDashboard = source === "dashboard" || source === "help"

  return (
    <View style={$header}>
      <TouchableOpacity
        style={$iconContainerLeft}
        onPress={
          sourceDashboard
            ? onDrawerToggle
            : () => {
                navigation?.dispatch(StackActions.pop(1))
              }
        }
      >
        <Icon icon="nwDark" size={35} />
      </TouchableOpacity>
      <View style={$centerContainer}>
        {sourceDashboard ? (
          <>
            <View style={$balanceContainer}>
              <Text style={$balanceText}>6000,00</Text>
              <View style={$infoContainer}>
                <Text style={$infoText}>Balance</Text>
                <Icon
                  icon="info"
                  size={12}
                  color={colors.palette.neutral400}
                  containerStyle={$infoIcon}
                />
              </View>
            </View>
            <View style={$purchaseContainer}>
              <Text style={$balanceText}>1</Text>
              <View style={$infoContainer}>
                <Text style={$infoText}>Total purchases</Text>
                <Icon
                  icon="info"
                  size={12}
                  color={colors.palette.neutral400}
                  containerStyle={$infoIcon}
                />
              </View>
            </View>
          </>
        ) : null}
      </View>
      <View style={$iconContainerRight}>
        <TouchableOpacity
          onPress={() => {
            navigation?.navigate("AddProduct")
          }}
        >
          <Icon icon="add" size={30} containerStyle={[$circle, $transparentBackground]} />
        </TouchableOpacity>
        <View style={$circle}>
          <Text style={$initials}>KB</Text>
        </View>
      </View>
    </View>
  )
}

export default CustomHeader

const $header: ViewStyle = {
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

const $iconContainerLeft: ViewStyle = {
  flex: 1.5,
  marginLeft: 20,
}

const $centerContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "center",
}

const $balanceContainer: ViewStyle = {
  flex: 1,
  marginRight: 15,
}

const $purchaseContainer: ViewStyle = {
  flex: 1,
  marginLeft: 15,
}

const $balanceText: TextStyle = {
  color: colors.palette.neutral100,
}

const $infoContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
}

const $infoText: TextStyle = {
  color: colors.palette.neutral400,
}

const $infoIcon: ViewStyle = {
  marginLeft: 5,
}

const $iconContainerRight: ViewStyle = {
  flex: 1.5,
  flexDirection: "row",
  justifyContent: "flex-end",
  paddingRight: 10,
}

const $circle: ViewStyle = {
  width: 50,
  height: 50,
  backgroundColor: colors.palette.nwColor,
  borderRadius: 30,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 5,
}

const $transparentBackground: ViewStyle = {
  backgroundColor: "transparent",
}

const $initials: TextStyle = {
  color: "white",
  fontSize: 24,
  fontWeight: "bold",
  alignSelf: "center",
}
