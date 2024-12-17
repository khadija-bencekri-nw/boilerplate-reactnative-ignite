import React, { useEffect, useState } from "react"

import PurchaseListScreen from "./PurchaseListScreen"

import { MasonryFlashList } from "@shopify/flash-list"
import { Icon, Rating, Text } from "app/components"
import type { PurchaseItem } from "app/services/api"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { FlatList, Image, ImageBackground, StyleSheet, TouchableOpacity, View } from "react-native"

interface ProductListScreenProps {
  purchases: PurchaseItem[]
  goToProduct: (item: object) => void
  isGridView: boolean
}

export const ProductListScreen: FC<ProductListScreenProps> = observer(
  function ProductListScreen(props) {
    const [isGridView, setIsGridView] = useState(false)

    useEffect(() => {
      setIsGridView(props.isGridView)
    }, [props.isGridView])

    const noItems = props.purchases.length === 0

    const renderItem = (param: { item: PurchaseItem; index: number }) => {
      const { item } = param
      return (
        <TouchableOpacity
          onPress={() => {
            props.goToProduct(item)
          }}
          style={[isGridView ? styles.gridItem : styles.listItem, { flexDirection: "row" }]}
        >
          <View style={styles.imageContainer}>
            <Image
              source={
                item.images.length > 0
                  ? { uri: item.images[0] }
                  : require("../../assets/images/backgroundLogin.png")
              }
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.purchaseDescContainer}>
            <Text style={styles.purchaseTitleStyle}>{`${item.brand} ${item.model}`}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
          <View
            style={{
              flex: 1.5,
              justifyContent: "flex-end",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Rating
              maxRating={5}
              initialRating={item.rating}
              onRatingChange={() => {}}
              starSize={20}
              starColor={"#646464"}
            />
            <View
              style={{
                width: 100,
                height: 28,
                backgroundColor: colors.palette.neutral600P,
                marginLeft: 10,
                borderRadius: 5,
                justifyContent: "center",
                paddingHorizontal: 2,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon
                icon="check"
                size={10}
                color={colors.palette.neutral100}
                style={{ marginRight: 4 }}
              />
              <Text
                style={{ color: colors.palette.neutral100, fontSize: 10, fontWeight: "bold" }}
                tx="dashboardScreen.purchased"
              />
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    const renderGridItem = (param: { item: PurchaseItem; index: number }) => {
      const { item } = param

      return (
        <TouchableOpacity
          onPress={() => {
            props.goToProduct(item)
          }}
        >
          <ImageBackground
            source={{ uri: item.images[0] }}
            style={[styles.gridItem, { alignItems: "flex-start", height: 200 }]}
          >
            <View style={{ flex: 3, width: "100%" }}>
              <Text style={{ color: colors.palette.neutral100, fontSize: 16, fontWeight: "bold" }}>
                {`${item.brand} ${item.model}`}
              </Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <View style={styles.ratingContainerGrid}>
              <Rating
                maxRating={5}
                initialRating={item.rating}
                disabled={true}
                starSize={20}
                starColor={"#646464"}
              />
              <View
                style={{
                  width: 100,
                  height: 28,
                  backgroundColor: colors.palette.neutral600P,
                  marginLeft: 10,
                  borderRadius: 5,
                  justifyContent: "center",
                  paddingHorizontal: 2,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Icon
                  icon="check"
                  size={10}
                  color={colors.palette.neutral100}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={{ color: colors.palette.neutral100, fontSize: 10, fontWeight: "bold" }}
                  tx="dashboardScreen.purchased"
                />
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )
    }

    return noItems ? (
      <View style={styles.emptyList}>
        <Text style={styles.emptyListText} tx="dashboardScreen.noPurchases" />
      </View>
    ) : (
      <>
        <Text style={styles.headerText} tx="dashboardScreen.purchasesListTitle" />
        {isGridView ? (
          <MasonryFlashList
            data={props.purchases}
            numColumns={3}
            renderItem={(item) => renderGridItem(item)}
            estimatedItemSize={200}
          />
        ) : (
          <FlatList
            data={props.purchases}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item) => item.id}
            numColumns={isGridView ? 3 : 1}
            key={isGridView ? "grid" : "list"}
            columnWrapperStyle={isGridView ? styles.columnWrapper : null}
          />
        )}
      </>
    )
  },
)

const styles = StyleSheet.create({
  PurchaseTitleStyle: {
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "bold",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyList: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  emptyListText: {
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "bold",
  },
  gridItem: {
    alignItems: "center",
    backgroundColor: colors.tabColor,
    borderRadius: 5,
    flex: 1,
    margin: 8,
    padding: 20,
  },
  headerText: {
    color: colors.palette.neutral100,
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainer: {
    alignItems: "center",
    flex: 0.7,
    paddingHorizontal: 10,
  },
  imageStyle: {
    borderRadius: 10,
    height: 100,
    paddingRight: 10,
    width: 120,
  },
  listItem: {
    backgroundColor: colors.tabColor,
    borderRadius: 10,
    height: 120,
    margin: 10,
    padding: 10,
  },
  price: {
    color: colors.palette.neutral300,
    fontSize: 12,
  },
  purchaseDescContainer: { flex: 3, marginHorizontal: 15 },
  ratingContainerGrid: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
})
