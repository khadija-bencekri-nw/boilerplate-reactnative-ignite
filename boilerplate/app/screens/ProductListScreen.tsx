import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { FlatList, ImageBackground, TouchableOpacity, View, StyleSheet, Image } from "react-native"
import { Icon, Rating, Text } from "app/components"
import { colors } from "app/theme"
import { MasonryFlashList } from "@shopify/flash-list"
import { PurchaseItem } from "app/services/api"

interface ProductListScreenProps {
  purchases: Array<PurchaseItem>
  goToProduct: (item: {}) => void
  isGridView: boolean
}

export const ProductListScreen: FC<ProductListScreenProps> = observer(function ProductListScreen(props) {

  const [isGridView, setIsGridView] = useState(false);

  useEffect(() => {
    setIsGridView(props.isGridView)
  }, [props.isGridView])
  
  const noItems = (props.purchases?.length == 0)
 
  const renderItem =  (param: {item: PurchaseItem, index: number}) => {
    const { item } = param;
    return(
      <TouchableOpacity onPress={() => props.goToProduct(item)} style={[isGridView ? styles.gridItem : styles.listItem, {flexDirection: 'row'}]}>
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
            onRatingChange={() => {}}
            starSize={20}
            starColor={"#646464"}
          />
          <View style={{width: 100, height: 28, backgroundColor: "#404040", marginLeft: 10, borderRadius: 5, justifyContent: 'center', paddingHorizontal: 2, flexDirection: "row", alignItems: "center" }}>
            <Icon icon="check"  size={10} color={colors.palette.neutral100} style={{marginRight: 4}}/>
            <Text style={{color: colors.palette.neutral100, fontSize:10, fontWeight: "bold"}}>PURCHASED</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  };

  const renderGridItem = (param: {item: PurchaseItem, index: number}) => {
    const { item } = param;

    return (
      <TouchableOpacity onPress={() => props.goToProduct(item)}>
        <ImageBackground source={{uri: item.images[0]}} style={[styles.gridItem, {alignItems: 'flex-start',height: 200}]}>
          <View style={{flex: 3, width:'100%'}}>
            <Text style={{color: colors.palette.neutral100, fontSize:16, fontWeight: "bold"}} >{item.brand+" "+item.model}</Text>
            <Text style={{color: colors.palette.neutral300, fontSize:12}}>{item.price}</Text>
          </View>
          <View style={{flex: 1,  width:'100%', justifyContent:"space-between", flexDirection: 'row', alignItems: 'center'}}>
            <Rating
              maxRating={5}
              initialRating={item.rating}
              disabled={true}
              starSize={20}
              starColor={"#646464"}
            />
            <View style={{width: 100, height: 28, backgroundColor: "#404040", marginLeft: 10, borderRadius: 5, justifyContent: 'center', paddingHorizontal: 2, flexDirection: "row", alignItems: "center" }}>
              <Icon icon="check"  size={10} color={colors.palette.neutral100} style={{marginRight: 4}}/>
              <Text style={{color: colors.palette.neutral100, fontSize:10, fontWeight: "bold"}} tx="dashboardScreen.purchased" />
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    )
  };

  return (
    noItems ? 
      <View style={styles.emptyList}>
        <Text style={styles.emptyListText} tx="dashboardScreen.noPurchases"/>
      </View> 
    :
    (
      <>
        <Text style={styles.headerText} tx="dashboardScreen.purchasesListTitle" />
        {isGridView ?   
          <MasonryFlashList
            data={props.purchases}
            numColumns={3}
            renderItem={item => renderGridItem(item)}
            estimatedItemSize={200}
          />
          :
          <FlatList
          data={props.purchases}
          renderItem={item => renderItem(item)}
          keyExtractor={(item) => item.id}
          numColumns={isGridView ? 3 : 1} 
          key={isGridView ? 'grid' : 'list'} 
          columnWrapperStyle={isGridView ? styles.columnWrapper : null} 
        />}
      </>
    )
  )
})

const styles = StyleSheet.create({
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
    alignItems: 'center',
  },
  price: {
    marginTop: 5,
    color: '#ffff',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyListText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff'
  }
});