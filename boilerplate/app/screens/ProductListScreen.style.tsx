import { colors } from "app/theme"
import { StyleSheet } from "react-native"

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
  gridImage: {
    alignItems: "flex-start",
    backgroundColor: colors.tabColor,
    borderRadius: 5,
    flex: 1,
  },
  gridItem: {
    height: 200,
    margin: 2,
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
    flexDirection: "row",
    height: 120,
    margin: 10,
    padding: 10,
  },
  overlay: {
    backgroundColor: colors.palette.overlay50,
    height: "100%",
    padding: 15,
    width: "100%",
  },
  price: {
    color: colors.palette.neutral300,
    fontSize: 12,
  },
  purchaseDescContainer: { flex: 3, marginHorizontal: 15 },
  purchaseTitleStyle: {
    color: colors.palette.neutral100,
    fontSize: 16,
    fontWeight: "bold",
  },
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

export default styles
