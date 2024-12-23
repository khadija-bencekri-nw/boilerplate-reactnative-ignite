import React from "react"

import { Screen, Text } from "app/components"
import type { AppStackScreenProps } from "app/navigators"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { ViewStyle } from "react-native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface HelpScreenProps extends AppStackScreenProps<"Help"> {}

const $root: ViewStyle = {
  flex: 1,
}

export const HelpScreen: FC<HelpScreenProps> = observer(function HelpScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="help" />
    </Screen>
  )
})
