import React, { useEffect, useRef, useState } from "react"

import { ProductListScreen } from "./ProductListScreen"

import type { AlertDialogRef } from "app/components"
import { AlertDialog, Icon, Loader, Screen } from "app/components"
import { useStores } from "app/models"
import type { Purchase } from "app/models/Purchase"
import type { AppStackScreenProps } from "app/navigators"
import { api } from "app/services/api"
import { colors, spacing } from "app/theme"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { ImageStyle, TextStyle } from "react-native"
import { Text, TouchableOpacity, View, type ViewStyle } from "react-native"

// STYLE START
const $root: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg,
  paddingBottom: spacing.lg,
}
const $header: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 10,
}
const $toggleViewStyle: ViewStyle = {
  flexDirection: "row",
}
const $yearFilterContainer: ViewStyle = {
  alignItems: "center",
  flexDirection: "row",
}
const $yearIcon: ImageStyle = {
  alignItems: "flex-end",
  paddingLeft: 20,
}
const $yearTextStyle: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 12,
  fontWeight: "bold",
}
const $iconStyle: ImageStyle = {
  paddingRight: 50,
}
// STYLE END

interface CoworkersScreenProps extends AppStackScreenProps<"Coworkers"> {}

export const CoworkersScreen: FC<CoworkersScreenProps> = observer(function CoworkersScreen(props) {
  const {
    authenticationStore: { logout },
  } = useStores()

  const [purchases, setPurchases] = useState<Purchase[]>()
  const [isGridView, setIsGridView] = useState(false)
  const [loading, setLoading] = useState(false)
  const alertRef = useRef<AlertDialogRef>(null)

  const handleApiError = (response: { kind: string }, mainAction: () => void) => {
    const isSessionError = response.kind === "forbidden" || response.kind === "unauthorized"
    alertRef.current?.set({
      title: isSessionError ? "common.sessionExpired" : undefined,
      message: isSessionError ? "common.sessionExpiredMsg" : "common.errorUnexpected",
      redirectLabel: isSessionError ? "common.proceed" : "common.tryAgain",
      onRedirect: isSessionError ? logout : mainAction,
    })
    alertRef.current?.show()
  }

  const fetchPurchases = async () => {
    const response = await api.getCoworkerPurchases("t")
    if (response.kind === "ok") {
      setLoading(false)
      setPurchases(response.purchases as Purchase[])
    } else {
      setLoading(false)
      handleApiError(response, () => {
        console.log("empty")
      })
    }
  }

  useEffect(() => {
    fetchPurchases().catch((er) => {
      console.log("er", er)
    })
    setLoading(true)
  }, [])

  const toggleView = () => {
    setIsGridView((prev) => !prev)
  }

  const goToProduct = (item: Purchase) => {
    props.navigation.navigate("Product", { item })
  }

  return (
    <Screen
      preset="fixed"
      // safeAreaEdges={["top"]}
      contentContainerStyle={$root}
    >
      <View style={$header}>
        <TouchableOpacity style={$yearFilterContainer}>
          <Text style={$yearTextStyle}>2022</Text>
          <Icon icon={"arrowDown"} size={5} style={$yearIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={$toggleViewStyle} onPress={toggleView}>
          <Icon icon={"list"} size={20} color={isGridView ? "grey" : "white"} style={$iconStyle} />
          <Icon icon={"grid"} size={20} color={isGridView ? "white" : "grey"} />
        </TouchableOpacity>
      </View>
      {/* <ListView
        contentContainerStyle={$listContentContainer}
        data={purchases}
        renderItem={item => purchaseItem(item.item)}
        estimat
        edItemSize={50}
      /> */}
      {purchases !== undefined && (
        <ProductListScreen
          purchases={purchases}
          goToProduct={goToProduct}
          isGridView={isGridView}
        />
      )}
      <AlertDialog ref={alertRef} />
      <Loader loading={loading} />
    </Screen>
  )
})
