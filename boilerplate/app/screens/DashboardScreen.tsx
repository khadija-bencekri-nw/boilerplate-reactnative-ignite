import React, { FC, useEffect, useRef, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, TouchableOpacity, Image, ImageBackground, FlatList, StyleSheet } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Icon, Rating, AlertDialog, AlertDialogRef, Loader } from "app/components"
import { colors } from "app/theme"
import PurchaseListScreen from "./PurchaseListScreen"
import { MasonryFlashList } from "@shopify/flash-list"
import { api } from "app/services/api"
import { runInAction } from "mobx"
import { useStores } from "app/models"
import { useIsFocused } from "@react-navigation/native"

interface DashboardScreenProps extends AppStackScreenProps<"Dashboard"> {}

export const DashboardScreen: FC<DashboardScreenProps> = observer(function DashboardScreen(props) {

  const {
    authenticationStore: { logout, setUser },
  } = useStores()
  
  const [isGridView, setIsGridView] = useState(false);
  const [purchases, setPurchases] = useState([]);
  const [userState, setUserState] = useState({});
  const [loading, setLoading] = useState(false)
  const alertRef = useRef<AlertDialogRef>(null)

  const isFocused = useIsFocused();


  useEffect(() => {
    fetchUser();
  }, [])
  
  useEffect(() => {
    isFocused && fetchUser()
  },[isFocused]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await api.getUser();
      if (response.kind == "ok") {
        runInAction(() => {
          setUserState(response.user);
          setUser(response.user)
          fetchPurchases(response.user.id)
        });
      } else {
        setLoading(false);
        if(response.kind == "forbidden" || response.kind == "unauthorized") {
          alertRef?.current.set({
            title: "Session expired",
            message: "Your session has expired. Please log in again.",
            redirectLabel: "Proceed",
            onRedirect: () => logout(),
          })
          alertRef.current?.show()
        } else {
          alertRef?.current.set({
            title: "",
            message: "An error has occured, please try again.",
            redirectLabel: "Proceed",
            onRedirect: () => logout(),
          })
          alertRef.current?.show()
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching purchases:", error);
    }
  };

  const fetchPurchases = async (id: string) => {
    try {
      const response = await api.getPurchases(id);
      if (response.kind == "ok") {
        setLoading(false);
        runInAction(() => {
          setPurchases(response.purchases); 
        });
      } else {
        setLoading(false);
        if(response.kind == "forbidden" || response.kind == "unauthorized") {
          alertRef?.current.set({
            title: "Session expired",
            message: "Your session has expired. Please log in again.",
            redirectLabel: "Log in again",
            onRedirect: () => logout(),
          })
          alertRef.current?.show()
        } else {
          alertRef?.current.set({
            title: "",
            message: "An error has occured, please try again.",
            redirectLabel: "try again",
            onRedirect: () => fetchPurchases(id),
          })
          alertRef.current?.show()
        }
      }
    } catch (error) {
      console.error("An error occurred while fetching purchases:", error);
    }
  };

  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  const handleRatingChange = (rating: number) => {
    console.log("Selected Rating:", rating)
  }

  const goToProduct =(item) => {
    props.navigation.navigate("Product", {item})
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToProduct(item)} style={[isGridView ? styles.gridItem : styles.listItem, {flexDirection: 'row'}]}>
      <View style={{flex:0.7, alignItems: 'center', paddingHorizontal: 10}}>
        <Image source={item.images.length > 0? { uri: item.images[0]} : require("../../assets/images/backgroundLogin.png")}  style={{width: 120, height: 100, borderRadius: 10, paddingRight: 10}} />
      </View>
      <View style={{flex: 3, marginHorizontal: 15}}>
        <Text style={{color: colors.palette.neutral100, fontSize:16, fontWeight: "bold"}} >{item.brand+" "+item.model}</Text>
        <Text style={{color: colors.palette.neutral300, fontSize:12}}>{item.price}</Text>
      </View>
      <View style={{flex: 1.5, justifyContent:"flex-end", flexDirection: 'row', alignItems: 'center'}}>
        <Rating
          maxRating={5}
          initialRating={item.rating}
          onRatingChange={handleRatingChange}
          starSize={20}
          starColor={"#646464"}
        />
        <View style={{width: 100, height: 28, backgroundColor: "#404040", marginLeft: 10, borderRadius: 5, justifyContent: 'center', paddingHorizontal: 2, flexDirection: "row", alignItems: "center" }}>
          <Icon icon="check"  size={10} color={colors.palette.neutral100} style={{marginRight: 4}}/>
          <Text style={{color: colors.palette.neutral100, fontSize:10, fontWeight: "bold"}}>PURCHASED</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderGridItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToProduct(item)}>
      <ImageBackground source={{uri: item.images[0]}} style={[styles.gridItem, {alignItems: 'flex-start',height: 200}]}>
        <View style={{flex: 3, width:'100%'}}>
          <Text style={{color: colors.palette.neutral100, fontSize:16, fontWeight: "bold"}} >{item.brand+" "+item.model}</Text>
          <Text style={{color: colors.palette.neutral300, fontSize:12}}>{item.price}</Text>
        </View>
        <View style={{flex: 1,  width:'100%', justifyContent:"space-between", flexDirection: 'row', alignItems: 'center'}}>
          <Rating
            maxRating={5}
            initialRating={item.rating}
            onRatingChange={handleRatingChange}
            starSize={20}
            starColor={"#646464"}
          />
          <View style={{width: 100, height: 28, backgroundColor: "#404040", marginLeft: 10, borderRadius: 5, justifyContent: 'center', paddingHorizontal: 2, flexDirection: "row", alignItems: "center" }}>
            <Icon icon="check"  size={10} color={colors.palette.neutral100} style={{marginRight: 4}}/>
            <Text style={{color: colors.palette.neutral100, fontSize:10, fontWeight: "bold"}}>PURCHASED</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
  
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

      <Text style={styles.headerText}>Purchases: </Text>
      {isGridView ?   
        <MasonryFlashList
          data={purchases}
          numColumns={3}
          renderItem={renderGridItem}
          estimatedItemSize={200}
        />
        :
        <FlatList
        data={purchases}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={isGridView ? 3 : 1} 
        key={isGridView ? 'grid' : 'list'} 
        columnWrapperStyle={isGridView ? styles.columnWrapper : null} 
      />}
        <AlertDialog ref = {alertRef} />
        <Loader loading={loading} />
    </View>
  );
})

const $purchasesSection: ViewStyle = {
  flex: 4,
  backgroundColor:'#232324',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: 20,
  borderTopWidth: 1,
  borderTopColor: '#B0B0B0', // Grey line
}

const $title: TextStyle ={
  fontSize: 24,
  color: '#FFFFFF', // White text for title
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
