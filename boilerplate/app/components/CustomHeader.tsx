import React, { useEffect, useRef, useState } from "react"

import type { AlertDialogRef } from "../components"
import { AlertDialog, Icon, Text } from "../components"
import { colors } from "../theme"

import {
  $balanceContainer,
  $balanceText,
  $centerContainer,
  $circle,
  $header,
  $iconContainerLeft,
  $iconContainerRight,
  $infoContainer,
  $infoIcon,
  $infoText,
  $initials,
  $purchaseContainer,
  $transparentBackground,
} from "./CustomHeader.style"

import type { DrawerNavigationProp } from "@react-navigation/drawer"
import { StackActions } from "@react-navigation/native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { User } from "app/services/api"
import { TouchableOpacity, View } from "react-native"

type CustomHeaderProps = {
  navigation?: DrawerNavigationProp<any> | NativeStackNavigationProp<any>
  source?: string
  onDrawerToggle?: () => void
  user?: User | null | undefined
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  onDrawerToggle,
  navigation,
  source,
  user,
}) => {
  const sourceDashboard = source === "dashboard" || source === "help"

  const [connectedUser, setConnectedUser] = useState<User>()
  const [initials, setInitials] = useState("")

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  useEffect(() => {
    user !== null && user !== undefined && setConnectedUser(user)
    user !== null && user !== undefined && setInitials(getInitials(user.name))
  }, [user])

  const alertRef = useRef<AlertDialogRef>(null)

  const handleIconPress = (sourceIcon: string) => {
    const isBalance = sourceIcon === "balance"
    alertRef.current?.set({
      message: isBalance ? "header.balanceInfo" : "header.totalInfo",
      messageOptions: isBalance ? { days: "62" } : undefined,
      closeLabel: "common.close",
    })
    alertRef.current?.show()
  }

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
              <Text style={$balanceText}>{connectedUser?.balance}</Text>
              <View style={$infoContainer}>
                <Text style={$infoText} tx="header.balance" />
                <TouchableOpacity
                  onPress={() => {
                    handleIconPress("balance")
                  }}
                >
                  <Icon
                    icon="info"
                    size={12}
                    color={colors.palette.neutral400}
                    containerStyle={$infoIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={$purchaseContainer}>
              <Text style={$balanceText}>{connectedUser?.purchasesTotal}</Text>
              <View style={$infoContainer}>
                <Text style={$infoText} tx="header.total" />
                <TouchableOpacity
                  onPress={() => {
                    handleIconPress("total")
                  }}
                >
                  <Icon
                    icon="info"
                    size={12}
                    color={colors.palette.neutral400}
                    containerStyle={$infoIcon}
                  />
                </TouchableOpacity>
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
          <Text style={$initials}>{initials}</Text>
        </View>
      </View>
      <AlertDialog ref={alertRef} />
    </View>
  )
}

export default CustomHeader
