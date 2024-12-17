import React, { useState } from "react"

import { Icon, Rating, Text } from "../components"

import { MasonryFlashList } from "@shopify/flash-list"
import type { AppStackScreenProps } from "app/navigators"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { FlatList, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native"

const DATA = [
  {
    id: "1",
    image: require("../../assets/images/backgroundLogin.png"),
    title: "Apple AirPods Pro",
    price: "3299,00 DH",
  },
  {
    id: "2",
    image: require("../../assets/images/airpods.png"),
    title: "Samsung Galaxy Buds",
    price: "2999,00 DH",
  },
  {
    id: "3",
    image: require("../../assets/images/airpods.png"),
    title: "Bose QuietComfort",
    price: "3799,00 DH",
  },
  {
    id: "4",
    image: require("../../assets/images/backgroundLogin.png"),
    title: "Apple AirPods Pro",
    price: "3299,00 DH",
  },
  {
    id: "5",
    image: require("../../assets/images/backgroundImage.png"),
    title: "Samsung Galaxy Buds",
    price: "2999,00 DH",
  },
  {
    id: "6",
    image: require("../../assets/images/airpods.png"),
    title: "Bose QuietComfort",
    price: "3799,00 DH",
  },
  {
    id: "7",
    image: require("../../assets/images/backgroundImage.png"),
    title: "Apple AirPods Pro",
    price: "3299,00 DH",
  },
  // Add more items as needed
]

interface ProductListScreenProps extends AppStackScreenProps<"Product"> {
  props: object
}

const PurchaseListScreen: FC<ProductListScreenProps> = observer(function ProductScreen(props) {
  const [isGridView, setIsGridView] = useState(false)

  const toggleView = () => {
    setIsGridView((prev) => !prev)
  }

  const handleRatingChange = (rating: number) => {
    console.log("Selected Rating:", rating)
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[isGridView ? styles.gridItem : styles.listItem, { flexDirection: "row" }]}
    >
      <View style={styles.renderItemContainer}>
        <Image source={item.image} style={styles.itemImage} />
      </View>
      <View style={styles.itemDescContainer}>
        <Text style={styles.itemTitleStyle}>{item.title}</Text>
        <Text style={styles.itemPriceStyle}>{item.price}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <Rating
          maxRating={5}
          initialRating={3}
          onRatingChange={handleRatingChange}
          starSize={20}
          starColor={"#646464"}
          disabled={true}
        />
        <View style={styles.purchasedBadgeStyle}>
          <Icon icon="check" size={10} color={colors.palette.neutral100} style={styles.iconStyle} />
          <Text style={styles.purchasedTitle} tx="dashboardScreen.purchased" />
        </View>
      </View>
    </TouchableOpacity>
  )

  const renderGridItem = ({ item }) => (
    <TouchableOpacity>
      <ImageBackground source={item.image} style={styles.gridItem}>
        <View style={styles.gridTitleContainer}>
          <Text style={styles.itemTitleStyle}>{item.title}</Text>
          <Text style={styles.gridPriceTextStyle}>{item.price}</Text>
        </View>
        <View style={styles.gridRatingContainer}>
          <Rating
            maxRating={5}
            initialRating={3}
            onRatingChange={handleRatingChange}
            starSize={20}
            starColor={"#646464"}
            disabled={true}
          />
          <View style={styles.purchasedTickStyle}>
            <Icon
              icon="check"
              size={10}
              color={colors.palette.neutral100}
              style={{ marginRight: 4 }}
            />
            <Text style={styles.purchasedTitle} tx="dashboardScreen.purchased" />
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  )

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
            style={styles.iconStyle}
          />
          <Icon icon={"grid"} size={20} color={isGridView ? "white" : "grey"} />
        </TouchableOpacity>
      </View>

      <Text style={styles.headerText} tx="dashboardScreen.purchases" />
      {isGridView ? (
        <MasonryFlashList
          data={DATA}
          numColumns={3}
          renderItem={renderGridItem}
          estimatedItemSize={200}
        />
      ) : (
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={isGridView ? 3 : 1}
          key={isGridView ? "grid" : "list"}
          columnWrapperStyle={isGridView ? styles.columnWrapper : null}
        />
      )}
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
    alignItems: "flex-start",
    backgroundColor: colors.tabColor,
    borderRadius: 5,
    flex: 1,
    height: 200,
    margin: 8,
    padding: 20,
  },
  gridPriceTextStyle: {
    color: colors.palette.neutral300,
    fontSize: 12,
  },
  gridRatingContainer: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  gridTitleContainer: {
    flex: 3,
    width: "100%",
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
  iconStyle: { paddingRight: 50 },
  itemDescContainer: {
    flex: 3,
    marginHorizontal: 15,
  },
  itemImage: {
    borderRadius: 10,
    height: 100,
    paddingRight: 10,
    width: 120,
  },
  itemPriceStyle: {
    color: colors.palette.neutral300,
    fontSize: 12,
  },
  itemTitleStyle: {
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "bold",
  },
  listItem: {
    backgroundColor: colors.tabColor,
    borderRadius: 10,
    height: 120,
    margin: 10,
    padding: 10,
  },
  purchasedBadgeStyle: {
    alignItems: "center",
    backgroundColor: colors.palette.neutral600P,
    borderRadius: 5,
    flexDirection: "row",
    height: 28,
    justifyContent: "center",
    marginLeft: 10,
    paddingHorizontal: 2,
    width: 100,
  },
  purchasedTitle: { color: colors.palette.neutral100, fontSize: 10, fontWeight: "bold" },
  ratingContainer: {
    alignItems: "center",
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  renderItemContainer: {
    alignItems: "center",
    flex: 0.7,
    paddingHorizontal: 10,
  },
})

export default PurchaseListScreen
