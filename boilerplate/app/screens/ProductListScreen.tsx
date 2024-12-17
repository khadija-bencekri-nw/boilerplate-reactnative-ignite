import React, { useEffect, useState } from "react"

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

const defaultImage = require("../../assets/images/backgroundLogin.png")

export const ProductListScreen: FC<ProductListScreenProps> = observer(
  function ProductListScreen(props) {
    const [isGridView, setIsGridView] = useState(false)

    useEffect(() => {
      setIsGridView(props.isGridView)
    }, [props.isGridView])

    const noItems = props.purchases?.length === 0

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
              source={item.images.length > 0 ? { uri: item.images[0] } : defaultImage}
              style={styles.imageStyle}
            />
          </View>
          <View style={styles.purchaseDescContainer}>
            <Text style={styles.purchaseTitleStyle}>{`${item.brand} ${item.model}`}</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Rating
              maxRating={5}
              initialRating={item.rating}
              onRatingChange={() => {}}
              starSize={20}
              starColor={colors.palette.neutral400}
              disabled={true}
            />
            <View style={styles.purchasedBadge}>
              <Icon
                icon="check"
                size={10}
                color={colors.palette.neutral100}
                style={styles.purchasedIcon}
              />
              <Text style={styles.purchasedTextStyle} tx="dashboardScreen.purchased" />
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
            source={item.images.length > 0 ? { uri: item.images[0] } : defaultImage}
            style={styles.gridItem}
          >
            <View style={styles.gridProductDescContainer}>
              <Text style={styles.emptyListText}>{`${item.brand} ${item.model}`}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <View style={styles.ratingContainerGrid}>
              <Rating
                maxRating={5}
                initialRating={item.rating}
                disabled={true}
                starSize={20}
                starColor={colors.palette.neutral400}
              />
              <View style={styles.purchasedBadge}>
                <Icon
                  icon="check"
                  size={10}
                  color={colors.palette.neutral100}
                  style={styles.purchasedIcon}
                />
                <Text style={styles.purchasedTextStyle} tx="dashboardScreen.purchased" />
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
    alignItems: "flex-start",
    backgroundColor: colors.tabColor,
    borderRadius: 5,
    flex: 1,
    height: 200,
    margin: 8,
    padding: 20,
  },
  gridProductDescContainer: { flex: 3, width: "100%" },
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
  purchasedBadge: {
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
  purchasedIcon: {
    marginRight: 4,
  },
  purchasedTextStyle: {
    color: colors.palette.neutral100,
    fontSize: 10,
    fontWeight: "bold",
  },
  ratingContainer: {
    alignItems: "center",
    flex: 1.5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  ratingContainerGrid: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
})
