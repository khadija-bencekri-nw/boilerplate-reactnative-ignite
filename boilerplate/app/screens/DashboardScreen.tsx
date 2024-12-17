import React, { useEffect, useRef, useState } from "react"

import { ProductListScreen } from "./ProductListScreen"

import { useIsFocused } from "@react-navigation/native"
import type { AlertDialogRef } from "app/components"
import { AlertDialog, Icon, Loader, Rating, Text } from "app/components"
import { useStores } from "app/models"
import type { AppStackScreenProps } from "app/navigators"
import type { User } from "app/services/api"
import { api } from "app/services/api"
import { colors } from "app/theme"
import { runInAction } from "mobx"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen(props) {
  const {
    authenticationStore: { logout, setUser, getUser },
  } = useStores()

  const [isGridView, setIsGridView] = useState(false)
  const [purchases, setPurchases] = useState([])
  const [userState, setUserState] = useState<User>()
  const [loading, setLoading] = useState(false)
  const alertRef = useRef<AlertDialogRef>(null)

  const isFocused = useIsFocused()

  useEffect(() => {
    setLoading(true)
    fetchUser()
  }, [])

  useEffect(() => {
    isFocused && fetchUser()
  }, [isFocused])

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

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await api.getUser()
      if (response.kind == "ok") {
        runInAction(() => {
          setUserState(response.user)
          setUser(response.user)
          fetchPurchases(response.user.id)
        })
      } else {
        handleApiError(response, fetchUser)
      }
    } catch (error) {
      console.error("An error occurred while fetching purchases:", error)
    }
  }

  const fetchPurchases = async (id: string) => {
    const user = getUser()
    setLoading(true)
    try {
      const response = await api.getPurchases(id)
      if (response.kind == "ok") {
        setLoading(false)
        runInAction(() => {
          setPurchases(response.purchases)
        })
      } else {
        handleApiError(response, async () => fetchPurchases(user.id))
      }
    } catch (error) {
      console.error("An error occurred while fetching purchases:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleView = () => {
    setIsGridView((prev) => !prev)
  }

  const goToProduct = (item: object) => {
    props.navigation.navigate("Product", { item })
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 12, fontWeight: "bold", color: "#ffffff" }}>2022</Text>
          <Icon icon={"arrowDown"} size={5} style={{ paddingLeft: 20, alignItems: "flex-end" }} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flexDirection: "row" }} onPress={toggleView}>
          <Icon
            icon={"list"}
            size={20}
            color={isGridView ? "grey" : "white"}
            style={{ paddingRight: 50 }}
          />
          <Icon icon={"grid"} size={20} color={isGridView ? "white" : "grey"} />
        </TouchableOpacity>
      </View>
      <ProductListScreen purchases={purchases} goToProduct={goToProduct} isGridView={isGridView} />
      <AlertDialog ref={alertRef} />
      <Loader loading={loading} />
    </View>
  )
})

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: "space-between", // Space out grid items
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    padding: 10,
    paddingHorizontal: 30,
  },
  gridItem: {
    alignItems: "center",
    backgroundColor: colors.tabColor,
    borderRadius: 5,
    flex: 1,
    margin: 8,
    padding: 20, // Center content for grid view
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerText: {
    color: colors.palette.neutral100,
    fontSize: 20,
    fontWeight: "bold",
  },
  listItem: {
    backgroundColor: colors.tabColor,
    borderRadius: 10,
    height: 120,
    margin: 10,
    padding: 10,
  },
  price: {
    color: colors.palette.neutral100,
    marginTop: 5,
  },
})
