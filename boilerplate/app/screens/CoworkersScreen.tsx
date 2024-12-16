import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { TouchableOpacity, View, ViewStyle, Image, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { AlertDialog, Icon, ListView, Loader, Rating, Screen, Text } from "app/components"
import { api } from "app/services/api"
import { ContentStyle } from "@shopify/flash-list"
import { colors, spacing } from "app/theme"
import { Purchase } from "app/models/Purchase"
import { useStores } from "app/models"
import { ProductListScreen } from "./ProductListScreen"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface CoworkersScreenProps extends AppStackScreenProps<"Coworkers"> {}

export const CoworkersScreen: FC<CoworkersScreenProps> = observer(function CoworkersScreen(props) {
  const {
    authenticationStore: { logout },
  } = useStores()

  const [purchases, setPurchases] = useState();
  const [isGridView, setIsGridView] = useState(false);
  const [loading, setLoading] = useState(false);
  const alertRef = useRef(null)

  useEffect(() => {
    fetchPurchases();
    setLoading(true)
  }, [])

  const fetchPurchases = async() => {
    const response = await api.getCoworkerPurchases("t");
    if (response.kind == "ok") {
      setLoading(false);
      setPurchases(response?.purchases);
    } else {
      setLoading(false);
      if(response.kind == "forbidden" || response.kind == "unauthorized") {
        const title= "Session expired";
        const message= "Your session has expired. Please log in again.";
        const   redirectLabel= "Login again";
        showDialog(title, message, redirectLabel, logout);
      } else {
        const title= "";
        const message= "Une erreur est survenue, veuillez réessayer";
        const   redirectLabel= "try again";
        const   onRedirect= () => {};
        showDialog(title, message, redirectLabel, onRedirect);
      }
    }
  }

  const showDialog = (title: string, message: string, redirectLabel: string, onRedirect: Function) => {
    alertRef?.current.set({
      title,
      message,
      redirectLabel,
      onRedirect: onRedirect,
    })
    alertRef.current?.show()
  }
  
  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  const goToProduct =(item) => {
    props.navigation.navigate("Product", {item})
  }

  return (
    <Screen  preset="fixed"
      //safeAreaEdges={["top"]}
      contentContainerStyle={$root}>
      {/* <ListView
        contentContainerStyle={$listContentContainer}
        data={purchases}
        renderItem={item => purchaseItem(item.item)}
        estimatedItemSize={50}
      /> */}
      <ProductListScreen purchases={purchases}  goToProduct={goToProduct} isGridView={isGridView}/>
      <AlertDialog ref={alertRef} />
      <Loader loading={loading}/>
    </Screen>
  )

})

const $root: ViewStyle = {
  flex: 1,
  backgroundColor:'#232324',
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}
const $listContentContainer: ContentStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor:'#232324',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  listItem: {
    height: 120,
    backgroundColor: "#373737",
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  gridItem: {
    flex: 1,
    margin: 8,
    padding: 20,
    backgroundColor: '#373737',
    borderRadius: 5,
    alignItems: 'center', // Center content for grid view
  },
  price: {
    marginTop: 5,
    color: '#ffff',
  },
  columnWrapper: {
    justifyContent: 'space-between', // Space out grid items
  },
});
