/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from "react"

import { Rating, Text } from "app/components"
import type { TxKeyPath } from "app/i18n"
import type { AppStackScreenProps } from "app/navigators"
import { api } from "app/services/api"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { ScaledSize } from "react-native"
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"

const { width, height } = Dimensions.get("window")
// const isTablet = width > 600

interface ProductScreenProps extends AppStackScreenProps<"Product"> {}
export const ProductScreen: FC<ProductScreenProps> = observer(({ route }) => {
  const { item } = route.params
  const [isPortrait, setIsPortrait] = useState(height >= width)

  const onChange = (window: ScaledSize) => {
    setIsPortrait(window.height >= window.width)
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      onChange(window)
    })
    return () => {
      subscription.remove()
    }
  }, [onChange])

  const handleRatingChange = (rating: number) => {
    const response = api.ratePurchase(rating, item.id)
    console.log("response", response)
    console.log("Selected Rating:", rating)
  }

  const renderDetails = () =>
    [
      { title: "brand", value: item.brand },
      { title: "model", value: item.model },
      { title: "store", value: item.store },
      { title: "purchaseDate", value: item.purchaseDate },
      { title: "price", value: `$${item.price}` },
    ].map(({ title, value }, index) => (
      <View key={index} style={styles.detailRow}>
        <Text style={styles.detailTitle} tx={`productScreen.${title}` as TxKeyPath} />
        <Text style={styles.detailValue}>{value as string}</Text>
      </View>
    ))

  const renderMedia = () =>
    item.images.map((image, index) => (
      <Image
        key={index}
        source={{ uri: image }}
        style={isPortrait ? styles.productImage : styles.productImageLandscape}
        resizeMode="cover"
      />
    ))

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={isPortrait ? styles.header : styles.headerLandscape}>
        <TouchableOpacity style={styles.purchaseStatus}>
          <Text style={styles.purchaseText} tx={"productScreen.purchased"} />
        </TouchableOpacity>
        <Text style={styles.productName}>{`${item.brand} ${item.model}`}</Text>
      </View>

      <View style={styles.productDetails}>{renderDetails()}</View>

      <View style={isPortrait ? styles.mediaSection : styles.mediaSectionLandscape}>
        <Text style={styles.mediaText} tx="productScreen.invoiceMedia" />
        <View style={isPortrait ? styles.mediaWrapper : styles.mediaWrapperLandscape}>
          {renderMedia()}
        </View>
      </View>

      <View style={isPortrait ? styles.reviewSection : styles.reviewSectionLandscape}>
        <Text style={styles.reviewText} tx="productScreen.review" />
        <View style={styles.reviewSubSection}>
          <View style={styles.ratingSectionConrainer}>
            <Text style={styles.reviewTitle} tx="productScreen.rateAction" />
            <Rating
              maxRating={5}
              initialRating={item.rating}
              onRatingChange={handleRatingChange}
              starSize={20}
              starColor={colors.palette.nwColor}
              style={styles.ratingConrainer}
              starsContainerStyle={styles.starsContainerStyle}
            />
          </View>
          <Text style={styles.reviewDescription} tx="productScreen.rateText" />
        </View>
      </View>
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingHorizontal: 50,
    paddingVertical: 50,
  },
  detailRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailTitle: {
    color: colors.palette.neutral500,
    fontSize: 16,
  },
  detailValue: {
    color: colors.palette.neutral100,
    fontSize: 16,
  },
  header: {
    alignItems: "flex-start",
    flex: 0.5,
    marginTop: 25,
  },
  headerLandscape: {
    alignItems: "flex-start",
    flex: 0.2,
    marginTop: 25,
  },
  mediaSection: {
    alignItems: "flex-start",
    flex: 0.2,
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 20,
    paddingVertical: 10,
  },
  mediaSectionLandscape: {
    alignItems: "flex-start",
    flex: 0.2,
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 20,
    marginVertical: 10,
    paddingVertical: 10,
  },
  mediaText: {
    color: colors.palette.neutral100,
    fontWeight: "bold",
  },
  mediaWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  mediaWrapperLandscape: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  productDetails: {
    backgroundColor: colors.palette.subbackgroundColor1,
    borderColor: colors.palette.neutral710,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.6,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  productImage: {
    borderRadius: 10,
    height: 150,
    marginHorizontal: 5,
    width: 150,
  },
  productImageLandscape: {
    borderRadius: 10,
    height: 150,
    marginHorizontal: 5,
    width: 200,
  },
  productName: {
    color: colors.palette.neutral100,
    fontSize: 40,
    fontWeight: "bold",
    paddingTop: 25,
  },
  purchaseStatus: {
    borderColor: colors.palette.neutral700,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 10,
    paddingBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  purchaseText: {
    color: colors.palette.neutral100,
    fontWeight: "bold",
    marginBottom: 5,
  },
  rating: {
    color: colors.palette.accent600,
    fontSize: 22,
  },
  ratingConrainer: { alignItems: "flex-end", maxHeight: 30 },
  ratingSectionConrainer: { flexDirection: "row", justifyContent: "space-between" },
  reviewDescription: {
    color: colors.palette.neutral300,
    fontSize: 14,
    marginTop: 10,
  },
  reviewSection: {
    backgroundColor: colors.palette.subbackgroundColor1,
    borderColor: colors.palette.neutral710,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.5,
    padding: 20,
  },
  reviewSectionLandscape: {
    backgroundColor: colors.palette.subbackgroundColor1,
    borderColor: colors.palette.neutral710,
    borderRadius: 10,
    borderWidth: 1,
    flex: 0.4,
    marginTop: 10,
    padding: 20,
  },
  reviewSubSection: { flex: 1 },
  reviewText: {
    color: colors.palette.neutral100,
    fontWeight: "bold",
    paddingBottom: 10,
  },
  reviewTitle: {
    color: colors.palette.neutral100,
    fontSize: 18,
    marginBottom: 10,
  },
  starsContainerStyle: { justifyContent: "flex-end" },
})
