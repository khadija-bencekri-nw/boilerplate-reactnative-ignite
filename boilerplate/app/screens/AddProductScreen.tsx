/* eslint-disable max-lines */
/* eslint-disable max-statements */
import React, { useEffect, useRef, useState } from "react"

import { StackActions } from "@react-navigation/native"
import type { AlertDialogRef } from "app/components"
import { AlertDialog, DropDownPickerNw, Icon, Loader, Text } from "app/components"
import type { TxKeyPath } from "app/i18n"
import { useStores } from "app/models"
import type { AppStackScreenProps } from "app/navigators"
import { api } from "app/services/api"
import { colors, spacing } from "app/theme"
import * as ImagePicker from "expo-image-picker"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import type { MIMEType } from "util"

const { width } = Dimensions.get("window")
// const isTablet = width > 600

interface AddProductScreenProps extends AppStackScreenProps<"AddProduct"> {
  data?: []
}

export const AddProductScreen: FC<AddProductScreenProps> = observer(function AddProductScreen(
  props: AddProductScreenProps,
) {
  const {
    authenticationStore: { user, logout },
  } = useStores()

  const [isPortrait, setIsPortrait] = useState(false)
  const [price, setPrice] = useState("")
  const [model, setModel] = useState("")
  const [screenWidth, setScreenWidth] = useState(width)
  const [file, setFile] = useState<string | null>(null)
  const [files, setFiles] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const alertRef = useRef<AlertDialogRef>(null)
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState([])
  const [stores, setStores] = useState([])
  const [brandOpen, setBrandOpen] = useState(false)
  const [storeOpen, setStoreOpen] = useState(false)
  const brandRef = useRef<AlertDialogRef>(null)
  const storeRef = useRef<AlertDialogRef>(null)

  const onChange = ({ window: { width, height } }: any) => {
    setScreenWidth(width)
    setIsPortrait(height >= width)
  }

  const handleApiError = (response: { kind: string }, mainAction: Function) => {
    const isSessionError = response.kind === "forbidden" || response.kind === "unauthorized"
    alertRef.current?.set({
      title: isSessionError ? "common.sessionExpired" : undefined,
      message: isSessionError ? "common.sessionExpiredMsg" : "common.errorUnexpected",
      redirectLabel: isSessionError ? "common.proceed" : "common.tryAgain",
      onRedirect: isSessionError ? logout : mainAction,
    })
    alertRef.current?.show()
  }

  const getFormData = async () => {
    setLoading(true)
    try {
      const response = await api.getFormData()
      if (response.kind === "ok") {
        setLoading(false)
        setBrands(response.data.brands)
        setStores(response.data.stores)
      } else {
        setLoading(false)
        handleApiError(response, getFormData)
      }
    } catch (error_) {
      setLoading(false)
      console.error("An error occurred while fetching purchases:", error_)
    }
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", onChange)
    getFormData()
    return () => {
      subscription.remove()
    }
  }, [])

  const validateForm = () => {
    if (!model) {
      setError("Model is required.")
      return false
    }
    if (!price) {
      setError("Price is required.")
      return false
    }
    if (files === null || files.length === 0) {
      setError("At least one image must be selected.")
      return false
    }
    setError(null)
    return true
  }

  async function saveProduct() {
    if (!validateForm()) return
    setLoading(true)
    const body = new FormData()
    const data = {
      brand: brandRef.current?.getValue()?.label,
      model,
      store: storeRef.current?.getValue()?.label,
      price,
      userId: user.id,
    }
    body.append("purchase", JSON.stringify(data))
    // body.append("files", files)
    files?.forEach((item: { uri: string; mimeType: MIMEType }) => {
      const localUri = item.uri
      const filename = localUri.split("/").pop()
      const type = item.mimeType || "image"
      body.append("files", {
        uri: localUri,
        name: filename,
        type,
      })
    })
    try {
      const response = await api.savePurchase(body)
      if (response.kind === "ok") {
        setLoading(false)
        const title = "addProductScreen.congrats"
        const message = "addProductScreen.congratsMsg"
        const redirectLabel = "addProductScreen.goToList"
        const onRedirect = () => {
          props.navigation.navigate("Main", { screen: "MainTabNavigator" })
        }
        showDialog(title, message, redirectLabel, onRedirect)
      } else {
        setLoading(false)
        if (response.kind === "forbidden" || response.kind === "unauthorized") {
          const title = "common.sessionExpired"
          const message = "common.sessionExpiredMsg"
          const redirectLabel = "common.loginAgain"
          const onRedirect = () => {
            logout()
          }
          showDialog(title, message, redirectLabel, onRedirect)
        } else if (response.kind === "bad-data") {
          const title = "addProductScreen.invalidTypes"
          const message = "addProductScreen.invalidTypesDesc"
          const redirectLabel = "addProductScreen.backToForm"
          const onRedirect = () => alertRef.current?.hide()
          showDialog(title, message, redirectLabel, onRedirect)
        } else {
          const message = "common.errorUnexpected"
          const redirectLabel = "common.tryAgain"
          const onRedirect = async () => saveProduct()
          showDialog(undefined, message, redirectLabel, onRedirect)
        }
      }
    } catch (error_) {
      setLoading(false)
      console.error("An error occurred while fetching purchases:", error_)
    }
  }

  const pickImage = async (allowsMultipleSelection: boolean) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need camera roll permission to upload images.")
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection })
    if (!result.canceled) {
      allowsMultipleSelection ? setFiles(result.assets) : setFile(result.assets[0]?.uri || null)
      setError(null)
    }
  }

  const showDialog = (
    title: TxKeyPath | undefined,
    message: TxKeyPath,
    redirectLabel: TxKeyPath,
    onRedirect: Function,
  ) => {
    alertRef.current?.set({
      title,
      message,
      redirectLabel,
      onRedirect,
    })
    alertRef.current?.show()
  }

  const handleDropdownOpen = (dropdown: string) => {
    if (dropdown === "brand") {
      setBrandOpen(!brandOpen)
      setStoreOpen(false)
    } else if (dropdown === "store") {
      setBrandOpen(false)
      setStoreOpen(!storeOpen)
    }
  }

  return (
    <View style={[styles.root, isPortrait ? styles.rootPortrait : styles.rootLandscape]}>
      <View style={styles.formContainer}>
        <DropDownPickerNw
          ref={brandRef}
          open={brandOpen}
          placeholder="Brand"
          data={brands}
          setOpen={() => {
            handleDropdownOpen("brand")
          }}
          zIndex={3000}
          zIndexInverse={1000}
        />
        <TextInput
          placeholder="Model"
          style={[
            styles.textInput,
            { width: screenWidth - 110 },
            isPortrait ? styles.textInputPortrait : styles.textInputLandscape,
          ]}
          onChangeText={setModel}
          value={model}
          placeholderTextColor={colors.palette.neutral100}
        />
        <TextInput
          placeholder="Price"
          style={[
            styles.textInput,
            { width: screenWidth - 110 },
            isPortrait ? styles.textInputPortrait : styles.textInputLandscape,
          ]}
          onChangeText={setPrice}
          value={price}
          keyboardType="numeric"
          placeholderTextColor={colors.palette.neutral100}
        />
        <DropDownPickerNw
          ref={storeRef}
          placeholder="Store"
          data={stores}
          open={storeOpen}
          setOpen={() => {
            handleDropdownOpen("store")
          }}
          zIndex={2000}
          zIndexInverse={2000}
        />
        <View
          style={[
            styles.invoiceSection,
            isPortrait ? styles.invoiceSectionPortrait : styles.invoiceSectionLandscape,
          ]}
        >
          <Text style={styles.sectionHeader} tx="productScreen.invoiceMedia" />
          <View style={[styles.mediaContainer, isPortrait ? null : styles.mediaContainerLandscape]}>
            {[1, 2].map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.pickPicture, isPortrait ? null : styles.pickPictureLandscape]}
                onPress={async () => pickImage(false)}
              >
                <View style={styles.imageContainer}>
                  {file ? (
                    <Image
                      source={{ uri: file }}
                      style={isPortrait ? styles.image : styles.imageLandscape}
                    />
                  ) : (
                    <Icon icon="add" color={colors.palette.neutral600P} style={{ flex: 1 }} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={async () => pickImage(true)} style={styles.button}>
            <Icon icon="add" size={30} style={styles.addIcon} />
            <Text style={styles.buttonText} tx="addProductScreen.multipleImages" />
          </TouchableOpacity>
          <View
            style={[styles.infoRow, isPortrait ? styles.infoRowPortrait : styles.infoRowLandscape]}
          >
            <Icon icon="info" color={colors.palette.neutral520} style={styles.infoIcon} />
            <Text
              style={[
                styles.infoText,
                isPortrait ? styles.infoTextPortrait : styles.infoTextLandscape,
              ]}
              tx="addProductScreen.qualityNote"
            />
          </View>
        </View>
        {error && <Text style={styles.errorMessage} tx="addProductScreen.fillForm" />}
      </View>
      <View style={isPortrait ? styles.footerPortrait : styles.footerLandscape}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            props.navigation.dispatch(StackActions.pop(1))
          }}
        >
          <Text style={styles.cancelText} tx="common.cancel" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={saveProduct}>
          <Text style={styles.confirmText} tx="common.confirm" />
        </TouchableOpacity>
      </View>
      <AlertDialog ref={alertRef} />
      <Loader loading={loading} />
    </View>
  )
})

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
