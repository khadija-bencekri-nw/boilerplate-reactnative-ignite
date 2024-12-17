import React from "react"

import { Screen, Text } from "app/components"
import type { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { ViewStyle } from "react-native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface LogoutScreenProps extends AppStackScreenProps<"Logout"> {}

export const LogoutScreen: FC<LogoutScreenProps> = observer(function LogoutScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="logout" />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
