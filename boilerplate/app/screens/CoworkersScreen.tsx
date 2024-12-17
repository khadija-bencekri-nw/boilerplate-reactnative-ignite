import React, { useEffect, useRef, useState } from "react"

import { ProductListScreen } from "./ProductListScreen"

import { AlertDialog, Loader, Screen } from "app/components"
import { useStores } from "app/models"
import type { Purchase } from "app/models/Purchase"
import type { AppStackScreenProps } from "app/navigators"
import { api } from "app/services/api"
import { spacing } from "app/theme"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { ViewStyle } from "react-native"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface CoworkersScreenProps extends AppStackScreenProps<"Coworkers"> {}

export const CoworkersScreen: FC<CoworkersScreenProps> = observer(function CoworkersScreen(props) {
  const {
    authenticationStore: { logout },
  } = useStores()

  const [purchases, setPurchases] = useState()
  const [isGridView, setIsGridView] = useState(false)
  const [loading, setLoading] = useState(false)
  const alertRef = useRef(null)

  const handleApiError = (response: { kind: string }, mainAction: Function) => {
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
      setPurchases(response.purchases)
    } else {
      setLoading(false)
      handleApiError(response, () => {
        console.log("empty")
      })
    }
  }

  useEffect(() => {
    fetchPurchases()
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
      {/* <ListView
        contentContainerStyle={$listContentContainer}
        data={purchases}
        renderItem={item => purchaseItem(item.item)}
        estimatedItemSize={50}
      /> */}
      <ProductListScreen purchases={purchases} goToProduct={goToProduct} isGridView={isGridView} />
      <AlertDialog ref={alertRef} />
      <Loader loading={loading} />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor: "#232324",
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}
