import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, TouchableOpacity, Image, ImageBackground, FlatList, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Text, Icon, Rating, AlertDialog, AlertDialogRef, Loader } from "app/components"
import { api, User } from "app/services/api"
import { runInAction } from "mobx"
import { useStores } from "app/models"
import { useIsFocused } from "@react-navigation/native"
import { ProductListScreen } from "./ProductListScreen"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen(props) {

  const {
    authenticationStore: { logout, setUser, getUser },
  } = useStores()
  
  const [isGridView, setIsGridView] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [userState, setUserState] = useState<User>();
  const [loading, setLoading] = useState(false)
  const alertRef = useRef<AlertDialogRef>(null)

  const isFocused = useIsFocused();


  useEffect(() => {
    setLoading(true);
    fetchUser();
  }, [])
  
  useEffect(() => {
    isFocused && fetchUser()
  },[isFocused]);

  const handleApiError = (response: {kind: string}, mainAction: Function) => {
    const isSessionError = response.kind === "forbidden" || response.kind === "unauthorized";
    alertRef?.current?.set({
      title: isSessionError ? "common.sessionExpired" : undefined,
      message: isSessionError ? "common.sessionExpiredMsg" : "common.errorUnexpected",
      redirectLabel: isSessionError ? "common.proceed" : "common.tryAgain",
      onRedirect: isSessionError ? logout : mainAction,
    });
    alertRef.current?.show();
  }

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await api.getUser();
      if (response.kind == "ok") {;
        runInAction(() => {
          setUserState(response.user)
          setUser(response.user)
          fetchPurchases(response.user.id)
        });
      } else {
        handleApiError(response, fetchUser)
      }
    } catch (error) {
      console.error("An error occurred while fetching purchases:", error);
    }
  };

  const fetchPurchases = async (id: string) => {
    let user= getUser();
    setLoading(true);
    try {
      const response = await api.getPurchases(id);
      if (response.kind == "ok") {
        setLoading(false);
        runInAction(() => {
          setPurchases(response.purchases); 
        });
      } else {
        handleApiError(response, () => fetchPurchases(user.id))
      }
    } catch (error) {
      console.error("An error occurred while fetching purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  
  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  const goToProduct =(item: object) => {
    props.navigation.navigate("Product", {item})
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={[{fontSize: 12, fontWeight: 'bold', color: '#ffffff'}]}>2022</Text>
          <Icon icon={"arrowDown"} size={5} style={{paddingLeft: 20, alignItems: 'flex-end'}} />
          </TouchableOpacity>
        <TouchableOpacity style={{flexDirection: 'row'}} onPress={toggleView}>
          <Icon icon={"list"} size={20} color={isGridView ? 'grey': 'white'} style={{paddingRight: 50}}/>
          <Icon icon={"grid" } size={20} color={isGridView ? 'white': 'grey'}/>
        </TouchableOpacity>
      </View>
      <ProductListScreen purchases={purchases} goToProduct={goToProduct} isGridView={isGridView} />
      <AlertDialog ref = {alertRef} />
      <Loader loading={loading} />
    </View>
  );
})

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
