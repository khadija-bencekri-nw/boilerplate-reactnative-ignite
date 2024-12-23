import React, { useEffect, useState } from "react"

import styles from "./ProductListScreen.style"

import { MasonryFlashList } from "@shopify/flash-list"
import { Icon, Rating, Text } from "app/components"
import type { Purchase } from "app/models/Purchase"
import { colors } from "app/theme"
import Images from "assets/images"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { FlatList, Image, ImageBackground, TouchableOpacity, View } from "react-native"

interface ProductListScreenProps {
  purchases: Purchase[]
  goToProduct: (item: Purchase) => void
  isGridView: boolean
}

export const ProductListScreen: FC<ProductListScreenProps> = observer(
  function ProductListScreen(props) {
    const [isGridView, setIsGridView] = useState(false)

    useEffect(() => {
      setIsGridView(props.isGridView)
    }, [props.isGridView])

    const noItems = props.purchases.length === 0

    const renderItem = (param: { item: Purchase; index: number }) => {
      const { item } = param
      return (
        <TouchableOpacity
          onPress={() => {
            props.goToProduct(item)
          }}
          style={isGridView ? styles.gridItem : styles.listItem}
        >
          <View style={styles.imageContainer}>
            <Image
              source={item.images.length > 0 ? { uri: item.images[0] } : Images.backgroundImage}
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

    const renderGridItem = (param: { item: Purchase; index: number }) => {
      const { item } = param

      return (
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => {
            props.goToProduct(item)
          }}
        >
          <ImageBackground
            source={item.images.length > 0 ? { uri: item.images[0] } : Images.backgroundImage}
            resizeMode={"cover"}
            style={styles.gridImage}
            imageStyle={styles.gridImage}
          >
            <View style={styles.overlay}>
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
          />
          // {
          /* <FlatList
            data={props.purchases}
            renderItem={(item) => renderItem(item)}
            keyExtractor={(item) => item.id}
            numColumns={isGridView ? 3 : 1}
            key={isGridView ? "grid" : "list"}
            columnWrapperStyle={isGridView ? styles.columnWrapper : null}
          /> */
          // }
        )}
      </>
    )
  },
)
