import React, { FC, useEffect, useState, useCallback } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView, View, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Rating, Screen, Text } from "app/components"
import { colors } from "app/theme"
import { api } from "app/services/api"

const { width, height } = Dimensions.get("window")
const isTablet = width > 600

interface ProductScreenProps extends AppStackScreenProps<"Product"> {}
export const ProductScreen: FC<ProductScreenProps> = observer(({ route }) => {
  const { item } = route.params;
  const [isPortrait, setIsPortrait] = useState(height >= width);

  const onChange = useCallback(({ window: { width, height } }) => {
    setIsPortrait(height >= width);
  }, []);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, [onChange]);

  const handleRatingChange = (rating: number) => {
    const response = api.ratePurchase(rating, item.id);
    console.log('response', response)
    console.log("Selected Rating:", rating);
  };

  const renderDetails = () =>
    [
      { title: "brand", value: item.brand },
      { title: "model", value: item.model },
      { title: "store", value: item.store },
      { title: "purchaseDate", value: item.purchaseDate },
      { title: "price", value: `$${item.price}` },
    ].map(({ title, value }, index) => (
      <View key={index} style={styles.detailRow}>
        <Text style={styles.detailTitle} tx={"productScreen."+title} />
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    ));

  const renderMedia = () =>
    item.images.map((image, index) => (
      <Image
        key={index}
        source={{ uri: image }}
        style={[styles.productImage, { width: isPortrait ? 150 : 200 }]}
        resizeMode="cover"
      />
    ));

  return (
    <ScrollView  contentContainerStyle={styles.container}>
      <View style={[styles.header, { flex: isPortrait ? 0.5 : 0.2 }]}>
        <TouchableOpacity style={styles.purchaseStatus}>
          <Text style={styles.purchaseText} tx={"productScreen.purchased"}/>
        </TouchableOpacity>
        <Text style={styles.productName}>{`${item.brand} ${item.model}`}</Text>
      </View>

      <View style={[styles.productDetails, { flex: 0.6 }]}>{renderDetails()}</View>

      <View style={[styles.mediaSection, isPortrait ? { flex: 0.2, paddingVertical: 10, marginBottom: 30 } : { flex: 0.5, marginVertical: 10 }]}>
        <Text style={{ fontWeight: 'bold', color: colors.palette.neutral100}} tx="productScreen.invoiceMedia" />
        <View style={{ width: '100%', flexDirection: isPortrait ? 'row' : 'row', flexWrap: isPortrait ? 'wrap' : 'nowrap', justifyContent: "space-between", marginTop: 10 }}>{renderMedia()}</View>
      </View>

      <View style={[styles.reviewSection, { flex: isPortrait ? 0.5 : 0.4 }]}>
        <Text style={{ fontWeight: 'bold', color: colors.palette.neutral100, paddingBottom: 10 }} tx="productScreen.review" />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row' , justifyContent: "space-between"}}>
            <Text style={styles.reviewTitle} tx="productScreen.rateAction" />
            <Rating
              maxRating={5}
              initialRating={item.rating}
              onRatingChange={handleRatingChange}
              starSize={20}
              starColor="#EB514E"
              style={{alignItems: 'flex-end', maxHeight: 30}}
              starsContainerStyle = {{justifyContent: 'flex-end'}}
              />
          </View>
          <Text style={styles.reviewDescription} tx="productScreen.rateText" />
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flexGrow: 1,
    paddingHorizontal: 50,
    paddingVertical: 50,
  },
  header: {
    alignItems: "flex-start",
    flex: 0.5,
    marginTop: 25,
  },
  purchaseStatus: {
    borderColor: "grey",
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
  productName: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.palette.neutral100,
    paddingTop: 25,
  },
  productDetails: {
    flex: 2,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#212121',
    borderColor: '#393939',
    borderWidth: 1,
    borderRadius: 10,
  },
  detailRow: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 16,
    color: "#bbb",
  },
  detailValue: {
    color: colors.palette.neutral100,
    fontSize: 16,
  },
  mediaSection: {
    alignItems: "flex-start",
    flex: 1.5,
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  productImage: {
    borderRadius: 10,
    height: 150,
    marginHorizontal: 5,
  },
  reviewSection: {
    flex: 1,
    backgroundColor: '#212121',
    borderColor: '#393939',
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginTop: 10
  },
  reviewTitle: {
    fontSize: 18,
    color: colors.palette.neutral100,
    marginBottom: 10,
  },
  rating: {
    fontSize: 22,
    color: "#FFD700",
  },
  reviewDescription: {
    fontSize: 14,
    color: "#ccc",
    marginTop: 10,
  },
})
