/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useRef, useState } from "react"

import styles from "./AddProductScreen.styles"

import { StackActions } from "@react-navigation/native"
import type { AlertDialogRef, DropDownPickerNwRef } from "app/components"
import { AlertDialog, DropDownPickerNw, Icon, Loader, Text } from "app/components"
import type { TxKeyPath } from "app/i18n"
import { useStores } from "app/models"
import type { AppStackScreenProps } from "app/navigators"
import type { Brand, PurchaseItem, Store } from "app/services/api"
import { api } from "app/services/api"
import type { GeneralApiProblem } from "app/services/api/apiProblem"
import { colors } from "app/theme"
import {
  constructFormData,
  getValueFromDropDown,
  transformtpDropDownData,
} from "app/utils/formDataUtils"
import { handleApiError } from "app/utils/handleApiReturns"
import { useOrientation } from "app/utils/useOrientation"
import * as ImagePicker from "expo-image-picker"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native"

// const { width } = Dimensions.get("window")
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

  const [price, setPrice] = useState("")
  const [model, setModel] = useState("")
  const [files, setFiles] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const alertRef = useRef<AlertDialogRef>(null)
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>()
  const [stores, setStores] = useState<Store[]>()
  const [brandOpen, setBrandOpen] = useState(false)
  const [storeOpen, setStoreOpen] = useState(false)
  const brandRef = useRef<DropDownPickerNwRef>(null)
  const storeRef = useRef<DropDownPickerNwRef>(null)

  const { isPortrait, screenWidth } = useOrientation()

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
        handleApiError(alertRef, response, logout, getFormData)
      }
    } catch (error_) {
      setLoading(false)
      console.error("An error occurred while fetching purchases:", error_)
    }
  }

  useEffect(() => {
    getFormData().catch((er) => {
      console.log("er", er)
    })
  }, [])

  const validateForm = () => {
    if (model === "") {
      setError("Model is required.")
      return false
    }
    if (price === "") {
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

  const handleResponse = (response: GeneralApiProblem | { kind: "ok"; purchase: PurchaseItem }) => {
    if (response.kind === "ok") {
      setLoading(false)
      const title = "addProductScreen.congrats"
      const message = "addProductScreen.congratsMsg"
      const redirectLabel = "addProductScreen.goToList"
      const onRedirect = () => {
        props.navigation.navigate("Main")
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
  }

  async function saveProduct() {
    if (!validateForm()) return
    setLoading(true)
    const productData = {
      brand: getValueFromDropDown(brandRef),
      model,
      store: getValueFromDropDown(storeRef),
      price,
      userId: user.id,
      files,
    }
    const body = constructFormData(productData)
    try {
      const response = await api.savePurchase(body)
      handleResponse(response)
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
      allowsMultipleSelection
        ? setFiles(result.assets)
        : setFiles([result.assets.length > 0 ? result.assets[0].uri : null])
      setError(null)
    }
  }

  const showDialog = (
    title: TxKeyPath | undefined,
    message: TxKeyPath,
    redirectLabel: TxKeyPath,
    onRedirect: (() => Promise<void>) | (() => void),
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
          data={transformtpDropDownData(brands)}
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
          data={transformtpDropDownData(stores)}
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
                  {files === null ? (
                    <Icon
                      icon="add"
                      color={colors.palette.neutral600P}
                      style={styles.iconContainer}
                    />
                  ) : (
                    <Image
                      source={{ uri: files[index] as string }}
                      style={isPortrait ? styles.image : styles.imageLandscape}
                    />
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
        {error !== null && <Text style={styles.errorMessage} tx="addProductScreen.fillForm" />}
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
