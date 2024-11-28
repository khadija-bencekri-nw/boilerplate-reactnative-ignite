import React, { FC, useState } from 'react';
import { observer } from "mobx-react-lite"
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, ImageBackground } from 'react-native';
import { AppStackScreenProps } from "app/navigators"
import { Card, Icon, Rating } from '../components'; // Adjust this import based on your project structure
import { colors } from 'app/theme';
import { MasonryFlashList } from '@shopify/flash-list';

const DATA = [
  { id: '1', image : require("../../assets/images/backgroundLogin.png") , title: 'Apple AirPods Pro', price: '3299,00 DH' },
  { id: '2',image : require("../../assets/images/airpods.png"), title: 'Samsung Galaxy Buds', price: '2999,00 DH' },
  { id: '3', image : require("../../assets/images/airpods.png"), title: 'Bose QuietComfort', price: '3799,00 DH' },
  { id: '4', image : require("../../assets/images/backgroundLogin.png") , title: 'Apple AirPods Pro', price: '3299,00 DH' },
  { id: '5',image : require("../../assets/images/backgroundImage.png"), title: 'Samsung Galaxy Buds', price: '2999,00 DH' },
  { id: '6', image : require("../../assets/images/airpods.png"), title: 'Bose QuietComfort', price: '3799,00 DH' },
  { id: '7', image : require("../../assets/images/backgroundImage.png") , title: 'Apple AirPods Pro', price: '3299,00 DH' },
  // Add more items as needed
];

interface ProductListScreenProps extends AppStackScreenProps<"Product"> {
  props: object
}

const PurchaseListScreen: FC<ProductListScreenProps> = observer(function ProductScreen(props) {
  const [isGridView, setIsGridView] = useState(false);

  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  const handleRatingChange = (rating: number) => {
    console.log("Selected Rating:", rating)
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={[isGridView ? styles.gridItem : styles.listItem, {flexDirection: 'row'}]}>
      <View style={{flex:0.7, alignItems: 'center', paddingHorizontal: 10}}>
        <Image source={item.image}  style={{width: 120, height: 100, borderRadius: 10, paddingRight: 10}} />
      </View>
      <View style={{flex: 3, marginHorizontal: 15}}>
        <Text style={{color: colors.palette.neutral100, fontSize:16, fontWeight: "bold"}} >{item.title}</Text>
        <Text style={{color: colors.palette.neutral300, fontSize:12}}>{item.price}</Text>
      </View>
      <View style={{flex: 1.5, justifyContent:"flex-end", flexDirection: 'row', alignItems: 'center'}}>
        <Rating
          maxRating={5}
          initialRating={3}
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
    <TouchableOpacity>
    <ImageBackground source={item.image} style={[styles.gridItem, {alignItems: 'flex-start',height: 200}]}>
      <View style={{flex: 3, width:'100%'}}>
        <Text style={{color: colors.palette.neutral100, fontSize:16, fontWeight: "bold"}} >{item.title}</Text>
        <Text style={{color: colors.palette.neutral300, fontSize:12}}>{item.price}</Text>
      </View>
      <View style={{flex: 1,  width:'100%', justifyContent:"space-between", flexDirection: 'row', alignItems: 'center'}}>
        <Rating
          maxRating={5}
          initialRating={3}
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
          data={DATA}
          numColumns={3}
          renderItem={renderGridItem}
          estimatedItemSize={200}
        />
        :
        <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={isGridView ? 3 : 1} 
        key={isGridView ? 'grid' : 'list'} 
        columnWrapperStyle={isGridView ? styles.columnWrapper : null} 
      />}
    </View>
  );

});

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

export default PurchaseListScreen;
