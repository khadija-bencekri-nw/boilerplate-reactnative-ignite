import React, { FC, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { View, TextInput, Dimensions, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { AlertDialog, AlertDialogRef, DropDownPickerNw, Icon, Loader , Text} from "app/components";
import * as ImagePicker from "expo-image-picker";
import { StackActions } from '@react-navigation/native';
import { AppStackScreenProps } from "app/navigators";
import { api } from "app/services/api";
import { runInAction } from "mobx";
import { useStores } from "app/models";
import { TxKeyPath } from "app/i18n";

const { width } = Dimensions.get("window");
const isTablet = width > 600;

interface AddProductScreenProps extends AppStackScreenProps<"AddProduct"> {
  data?: [];
}

export const AddProductScreen: FC<AddProductScreenProps> = observer(function AddProductScreen(props: AddProductScreenProps) {
  const {
    authenticationStore: { user, logout },
  } = useStores()
  
  const [isPortrait, setIsPortrait] = useState(false);
  const [price, setPrice] = useState("");
  const [model, setModel] = useState("");
  const [screenWidth, setScreenWidth] = useState(width);
  const [file, setFile] = useState<string | null>(null);
  const [files, setFiles] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const alertRef = useRef<AlertDialogRef>(null)
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState([]);
  const [stores, setStores] = useState([]);
  const [brandOpen, setBrandOpen] = useState(false);
  const [storeOpen, setStoreOpen] = useState(false);
  const brandRef = useRef<AlertDialogRef>(null)
  const storeRef = useRef<AlertDialogRef>(null)
  

  const onChange = ({ window: { width, height } }: any) => {
    setScreenWidth(width);
    setIsPortrait(height >= width);
  };

  const getFormData = async () => {
    setLoading(true);
    try {
      const response = await api.getFormData();
      if (response.kind == "ok") {
        setLoading(false);
        setBrands(response.data.brands)
        setStores(response.data.stores)
      } else {
        setLoading(false);
        if(response.kind == "forbidden" || response.kind == "unauthorized") {
          const title= "Session expired";
          const message= "Your session has expired. Please log in again.";
          const   redirectLabel= "Login again";
          const   onRedirect= () => logout();
          showDialog(title, message, redirectLabel, onRedirect);
        } else {
          const title= "";
          const message= "Une erreur est survenue, veuillez réessayer.";
          const   redirectLabel= "Réessayer";
          const   onRedirect= () => getFormData();
          showDialog(title, message, redirectLabel, onRedirect);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred while fetching purchases:", error);
    }
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", onChange);
    getFormData();
    return () => subscription?.remove();
  }, []);

  const saveProduct = async () => {
    setLoading(true);
    var body = new FormData();
 
    const data={
      brand: brandRef?.current?.getValue()?.label,
      model: model,
      store: storeRef?.current?.getValue()?.label,
      price: price,
      userId: user.id,
    }
    
    body.append("purchase", JSON.stringify(data));
    //body.append("files", files)
    files?.forEach((file, index) => {
      const localUri = file.uri;
      const filename = localUri.split("/").pop();
      const type = file.mimeType || "image"; // Use the correct MIME type
      body.append("files", {
        uri: localUri,
        name: filename,
        type,
      });
    });

    try {
      const response = await api.savePurchase(body);
      if (response.kind == "ok") {
        setLoading(false);
        const title= "addProductScreen.congrats";
        const message= "addProductScreen.congratsMsg";
        const   redirectLabel= "addProductScreen.goToList";
        const   onRedirect= () => props.navigation.navigate("Main", { screen: "MainTabNavigator"});
        showDialog(title, message, redirectLabel, onRedirect);
      } else {
        setLoading(false);
        if(response.kind == "forbidden" || response.kind == "unauthorized") {
          const title= "common.sessionExpired";
          const message= "common.sessionExpiredMsg";
          const   redirectLabel= "common.loginAgain";
          const   onRedirect= () => logout();
          showDialog(title, message, redirectLabel, onRedirect);
        } else if(response.kind == "bad-data") {
          const title= "addProductScreen.invalidTypes";
          const message= "addProductScreen.invalidTypesDesc";
          const   redirectLabel= "addProductScreen.backToForm";
          const   onRedirect= () => alertRef.current?.hide();
          showDialog(title, message, redirectLabel, onRedirect);
        }
         else {
          const message= "common.errorUnexpected";
          const   redirectLabel= "common.tryAgain";
          const   onRedirect= () => saveProduct();
          showDialog(undefined, message, redirectLabel, onRedirect);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("An error occurred while fetching purchases:", error);
    }
  }

  const pickImage = async (allowsMultipleSelection: boolean) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need camera roll permission to upload images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({allowsMultipleSelection});
    if (!result.canceled) {
      allowsMultipleSelection ? setFiles(result.assets) : setFile(result.assets[0]?.uri || null);
      setError(null);
    }
  };

  const showDialog = (title: TxKeyPath|undefined, message: TxKeyPath, redirectLabel: TxKeyPath, onRedirect: Function) => {
    alertRef?.current?.set({
      title,
      message,
      redirectLabel,
      onRedirect: onRedirect,
    })
    alertRef.current?.show()
  }

  const handleDropdownOpen = (dropdown: string) => {
    if (dropdown === "brand") {
      setBrandOpen(!brandOpen); 
      setStoreOpen(false);
    } else if (dropdown === "store") {
      setBrandOpen(false);
      setStoreOpen(!storeOpen); 
    }
  };

  return (
    <View style={[styles.root, isPortrait ? styles.rootPortrait : styles.rootLandscape]}>
      <View style={styles.formContainer}>
        <DropDownPickerNw 
          ref={brandRef}
          open={brandOpen}
          placeholder="Brand" data={brands} 
          setOpen={() => handleDropdownOpen("brand")}
          zIndex={3000} 
          zIndexInverse={1000} 
        />
        <TextInput
          placeholder="Model"
          style={[styles.textInput, { width: screenWidth - 110 }, isPortrait ? styles.textInputPortrait : styles.textInputLandscape]}
          onChangeText={setModel}
          value={model}
          placeholderTextColor={"white"}
        />
        <TextInput
          placeholder="Price"
          style={[styles.textInput, { width: screenWidth - 110 }, isPortrait ? styles.textInputPortrait : styles.textInputLandscape]}
          onChangeText={setPrice}
          value={price}
          keyboardType="numeric"
          placeholderTextColor={"white"}
        />
        <DropDownPickerNw 
          ref={storeRef}
          placeholder="Store" data={stores} 
          open={storeOpen}
          setOpen={() => handleDropdownOpen("store")}
          zIndex={2000}
          zIndexInverse={2000}
        />
        <View style={[styles.invoiceSection, isPortrait ? styles.invoiceSectionPortrait : styles.invoiceSectionLandscape]}>
          <Text style={styles.sectionHeader} tx="productScreen.invoiceMedia" />
          <View style={[styles.mediaContainer, isPortrait ? null : styles.mediaContainerLandscape]}>
            {[1, 2,].map((_, index) => (
              <TouchableOpacity key={index} style={[styles.pickPicture, !isPortrait ? styles.pickPictureLandscape : null]} onPress={() => pickImage(false)}>
                <View style={styles.imageContainer}>
                  {file ? (
                    <Image source={{ uri: file }} style={isPortrait ? styles.image : styles.imageLandscape} />
                  ) : (
                    <Icon icon="add" color="#404040" style={{flex:1}} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={() => pickImage(true)} style={styles.button}>
            <Icon icon="add" size={30} style={styles.addIcon} />
            <Text style={styles.buttonText} tx="addProductScreen.multipleImages" />
          </TouchableOpacity>
          <View style={[styles.infoRow, isPortrait ? styles.infoRowPortrait : styles.infoRowLandscape]}>
            <Icon icon="info" color="#515151" style={styles.infoIcon} />
            <Text style={[styles.infoText, isPortrait ? styles.infoTextPortrait : styles.infoTextLandscape]} tx="addProductScreen.qualityNote" />
          </View>
        </View>
      </View>
      <View style={[isPortrait ? styles.footerPortrait : styles.footerLandscape]}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => props.navigation?.dispatch(StackActions.pop(1))}>
          <Text style={styles.cancelText} tx="common.cancel" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton} onPress={saveProduct}>
          <Text style={styles.confirmText} tx="common.confirm" />
        </TouchableOpacity>
      </View>
      <AlertDialog ref={alertRef} />
      <Loader loading={loading}/>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#232324",
  },
  rootPortrait: {
    padding: 50,
  },
  rootLandscape: {
    paddingHorizontal: 50,
    paddingTop: 15,
    marginBottom: 50,
  },
  formContainer: {
    flex: 2,
    alignContent: "center",
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: "#404040",
    color: "white",
    borderRadius: 5,
    paddingHorizontal: 5,
    alignSelf: "center",
  },
  textInputPortrait: {
    marginVertical: 30,
  },
  textInputLandscape: {
    marginTop: 18,
    marginBottom: 5,
  },
  invoiceSection: {
    flex: 1,
    paddingHorizontal: 5,
  },
  invoiceSectionPortrait: {
    marginVertical: 35,
  },
  invoiceSectionLandscape: {
    marginTop: 30,
  },
  sectionHeader: {
    alignSelf: "flex-start",
    color: "white",
    fontWeight: "bold",
  },
  mediaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  mediaContainerLandscape: {
    marginHorizontal: 30,
  },
  pickPicture: {
    backgroundColor: "#2E2E2E",
    borderColor: "#404040",
    borderRadius: 8,
    borderStyle: "dashed",
    borderWidth: 1,
    height: 250,
    marginTop: 30,
    width: 300,
  },
  pickPictureLandscape: {
    width: 100,
    height: 100,
  },
  imageContainer: {
    borderRadius: 8,
    alignSelf: "center",
  },
  image: {
    width: 300,
    height: 250,
    borderRadius: 8,
    alignSelf: "center",
  },
  imageLandscape: {
    width: 100,
    height: 80,
    borderRadius: 8,
    alignSelf: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 15,
    borderColor: "#ffffff",
    borderWidth: 2,
    borderRadius: 30,
    padding: 10,
  },
  addIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: "white",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoRowPortrait: {
    justifyContent: "center",
    marginTop: 20,
  },
  infoRowLandscape: {
    justifyContent: "flex-start",
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    color: "#515151",
  },
  infoTextPortrait: {
    fontSize: 20,
  },
  infoTextLandscape: {
    fontSize: 16,
  },
  footerPortrait: {
    flex: 0.14,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 100,
    marginHorizontal: 30,
  },
  footerLandscape: {
    flex: 0.2,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    marginHorizontal: 30,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 30,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  confirmButton: {
    flex: 2.8,
    borderRadius: 30,
    marginLeft: 20,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#404040",
    fontWeight: "bold",
    fontSize: 18,
  },
});
