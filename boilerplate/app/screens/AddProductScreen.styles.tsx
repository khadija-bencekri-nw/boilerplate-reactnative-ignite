import { colors, spacing } from "app/theme"
import { StyleSheet } from "react-native"

// const { width } = Dimensions.get("window")
// const isTablet = width > 600

const styles = StyleSheet.create({
  addIcon: {
    marginRight: 10,
  },
  button: {
    borderColor: colors.palette.neutral100,
    borderRadius: 30,
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
    padding: 10,
  },
  buttonText: {
    color: colors.palette.neutral100,
  },
  cancelButton: {
    alignItems: "center",
    borderColor: colors.palette.neutral100,
    borderRadius: 30,
    borderWidth: 2,
    flex: 1,
    justifyContent: "center",
    marginRight: 20,
  },
  cancelText: {
    color: colors.palette.neutral100,
    fontSize: 18,
    fontWeight: "bold",
  },
  confirmButton: {
    alignItems: "center",
    backgroundColor: colors.palette.neutral100,
    borderRadius: 30,
    flex: 2.8,
    justifyContent: "center",
    marginLeft: 20,
  },
  confirmText: {
    color: colors.palette.neutral600P,
    fontSize: 18,
    fontWeight: "bold",
  },
  errorMessage: {
    color: colors.error,
    marginBottom: spacing.md,
  },
  footerLandscape: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    marginHorizontal: 30,
  },
  footerPortrait: {
    flex: 0.14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
    marginHorizontal: 30,
  },
  formContainer: {
    alignContent: "center",
    flex: 2,
  },
  iconContainer: { flex: 1 },
  image: {
    alignSelf: "center",
    borderRadius: 8,
    height: 250,
    width: 300,
  },
  imageContainer: {
    alignSelf: "center",
    borderRadius: 8,
  },
  imageLandscape: {
    alignSelf: "center",
    borderRadius: 8,
    height: 80,
    width: 100,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  infoRowLandscape: {
    justifyContent: "flex-start",
  },
  infoRowPortrait: {
    justifyContent: "center",
    marginTop: 20,
  },
  infoText: {
    color: colors.palette.neutral520,
  },
  infoTextLandscape: {
    fontSize: 16,
  },
  infoTextPortrait: {
    fontSize: 20,
  },
  invoiceSection: {
    flex: 1,
    paddingHorizontal: 5,
  },
  invoiceSectionLandscape: {
    marginTop: 30,
  },
  invoiceSectionPortrait: {
    marginVertical: 35,
  },
  mediaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mediaContainerLandscape: {
    marginHorizontal: 30,
  },
  pickPicture: {
    backgroundColor: colors.palette.neutral750,
    borderColor: colors.palette.neutral600P,
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 250,
    marginTop: 30,
    width: 300,
  },
  pickPictureLandscape: {
    height: 100,
    width: 100,
  },
  root: {
    backgroundColor: colors.background,
    flex: 1,
  },
  rootLandscape: {
    marginBottom: 50,
    paddingHorizontal: 50,
    paddingTop: 15,
  },
  rootPortrait: {
    padding: 50,
  },
  sectionHeader: {
    alignSelf: "flex-start",
    color: colors.palette.neutral100,
    fontWeight: "bold",
  },
  textInput: {
    alignSelf: "center",
    borderBottomWidth: 1,
    borderColor: colors.palette.neutral600P,
    borderRadius: 5,
    color: colors.palette.neutral100,
    paddingHorizontal: 5,
  },
  textInputLandscape: {
    marginBottom: 5,
    marginTop: 18,
  },
  textInputPortrait: {
    marginVertical: 30,
  },
})

export default styles
