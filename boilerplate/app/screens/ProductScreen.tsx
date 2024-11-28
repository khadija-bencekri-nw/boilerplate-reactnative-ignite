import React, { FC, useEffect, useState } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Rating, Screen, Text } from "app/components"
import { colors } from "app/theme"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

const { width, height } = Dimensions.get("window")
const isTablet = width > 600
interface ProductScreenProps extends AppStackScreenProps<"Product"> {}

export const ProductScreen: FC<ProductScreenProps> = observer(function ProductScreen(props) {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    setIsPortrait(height >= width);
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, [])

  const onChange = ({ window: { width, height  } }) => {
    setIsPortrait(height >= width);
  };

  const handleRatingChange = (rating: number) => {
    console.log("Selected Rating:", rating)
  }


  return (
    <View style={styles.container} >
      <View style={[styles.header, isPortrait ? { flex: 0.5 } : { flex: 0.2}]}>
        <TouchableOpacity style={styles.purchaseStatus}>
          <Text style={styles.purchaseText}>✓ PURCHASED</Text>
        </TouchableOpacity>
        <Text style={styles.productName}>Apple AirPods Pro</Text>
      </View>

      <View style={[styles.productDetails , isPortrait ? { flex: 0.6, marginBottom: 20 } : { flex: 0.6 }]}>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Brand</Text>
          <Text style={styles.detailValue}>Apple</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Model</Text>
          <Text style={styles.detailValue}>AirPods Pro</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Store</Text>
          <Text style={styles.detailValue}>Virgin Megastore</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Query Date</Text>
          <Text style={styles.detailValue}>26/09/2021</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Price</Text>
          <Text style={styles.detailValue}>3299,00 DH</Text>
        </View>
      </View>

      <View style={[styles.mediaSection, isPortrait ? { flex: 0.6, paddingVertical: 10, marginBottom: 50 } : { flex: 0.5, marginVertical: 10 }]}>
        <Text style={{ fontWeight: 'bold', color: colors.palette.neutral100, paddingTop: 20 }}>Invoice and media</Text>
        <View style={{ width: '100%', flexDirection: isPortrait ? 'row' : 'row', flexWrap: isPortrait ? 'wrap' : 'nowrap', justifyContent: "space-between", marginTop: 10 }}>
          <Image source={require("../../assets/images/backgroundLogin.png")} style={[styles.productImage, isPortrait ? { width: 150 } : { width: 200 }]} />
          <Image source={require("../../assets/images/backgroundLogin.png")} style={[styles.productImage, isPortrait ? { width: 150 } : { width: 200 }]} />
          <Image source={require("../../assets/images/backgroundLogin.png")} style={[styles.productImage, isPortrait ? { width: 150 } : { width: 200 }]} />
        </View>
      </View>

      <View style={[styles.reviewSection, isPortrait ? { flex: 0.6 } : { flex: 0.4 }]}>
        <Text style={{ fontWeight: 'bold', color: colors.palette.neutral100, paddingBottom: 10 }}>Review</Text>
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <Text style={styles.reviewTitle}>How would you rate this product?</Text>
            <Rating  
              maxRating={5}
              initialRating={3}
              onRatingChange={handleRatingChange}
              starSize={20}
              starColor={"#EB514E"}
              style={{ flex: 1, justifyContent: 'flex-start' }}
            />
          </View>
          <Text style={styles.reviewDescription}>
            Rating this product will help other NIMBLERS make the right choice in terms of gear.
          </Text>
        </View>
      </View>
      <View style={[styles.mediaSection, isPortrait ? { flex: 0.6 } : { flex: 0.01 }]}></View>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#232324',
    paddingHorizontal: 50,
  },
  header: {
    flex: 0.5,
    alignItems: "flex-start",
    marginVertical: 25,
  },
  purchaseStatus: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 5,
    paddingBottom: 5,
  },
  purchaseText: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 5,
  },
  productName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    paddingTop: 25,
  },
  productDetails: {
    flex: 2,
    marginTop: 30,
    paddingHorizontal: 20,
    backgroundColor: '#212121',
    borderColor: '#393939',
    borderWidth: 1,
    borderRadius: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailTitle: {
    fontSize: 16,
    color: "#bbb",
  },
  detailValue: {
    fontSize: 16,
    color: "#fff",
  },
  mediaSection: {
    flex: 1.5,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  productImage: {
    height: 150,
    borderRadius: 10,
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
    color: "#fff",
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
