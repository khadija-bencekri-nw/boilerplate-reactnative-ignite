import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { View, TextInput, Dimensions, Text, TouchableOpacity, Alert, StyleSheet, Image } from "react-native";
import { DropDownPickerNw, Icon } from "app/components";
import * as ImagePicker from "expo-image-picker";
import { StackActions } from '@react-navigation/native';
import { AppStackScreenProps } from "app/navigators";

const { width } = Dimensions.get("window");
const isTablet = width > 600;

interface AddProductScreenProps extends AppStackScreenProps<"AddProduct"> {
  data?: [];
}

export const AddProductScreen: FC<AddProductScreenProps> = observer(function AddProductScreen(props: AddProductScreenProps) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [price, setPrice] = useState("");
  const [screenWidth, setScreenWidth] = useState(width);
  const [file, setFile] = useState<string | null>(null);
  const [files, setFiles] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onChange = ({ window: { width, height } }: any) => {
    setScreenWidth(width);
    setIsPortrait(height >= width);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need camera roll permission to upload images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled) {
      setFile(result.assets[0]?.uri || null);
      setError(null);
    }
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Sorry, we need camera roll permission to upload images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true });
    if (!result.canceled) {
      setFiles(result.assets || null);
      setError(null);
    }
  };

  return (
    <View style={[styles.root, isPortrait ? styles.rootPortrait : styles.rootLandscape]}>
      <View style={styles.formContainer}>
        <DropDownPickerNw placeholder="Brand" data={[{ label: "Apple", value: "apple" }, { label: "Banana", value: "banana" }]} />
        <DropDownPickerNw placeholder="Model" data={[{ label: "Apple", value: "apple" }, { label: "Banana", value: "banana" }]} />
        <TextInput
          placeholder="Price"
          style={[styles.textInput, { width: screenWidth - 110 }, isPortrait ? styles.textInputPortrait : styles.textInputLandscape]}
          onChangeText={setPrice}
          value={price}
          placeholderTextColor={"white"}
        />
        <DropDownPickerNw placeholder="Store" data={[{ label: "Apple", value: "apple" }, { label: "Banana", value: "banana" }]} />
        <View style={[styles.invoiceSection, isPortrait ? styles.invoiceSectionPortrait : styles.invoiceSectionLandscape]}>
          <Text style={styles.sectionHeader}>INVOICE AND MEDIA</Text>
          <View style={[styles.mediaContainer, isPortrait ? null : styles.mediaContainerLandscape]}>
            {[1, 2,].map((_, index) => (
              <TouchableOpacity key={index} style={[styles.pickPicture, !isPortrait ? styles.pickPictureLandscape : null]} onPress={pickImage}>
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
          <TouchableOpacity onPress={pickImages} style={styles.button}>
            <Icon icon="add" size={30} style={styles.addIcon} />
            <Text style={styles.buttonText}>Add multiple photos</Text>
          </TouchableOpacity>
          <View style={[styles.infoRow, isPortrait ? styles.infoRowPortrait : styles.infoRowLandscape]}>
            <Icon icon="info" color="#515151" style={styles.infoIcon} />
            <Text style={[styles.infoText, isPortrait ? styles.infoTextPortrait : styles.infoTextLandscape]}>
              Adding more high-resolution photos will help the platform stay consistent and evolve in terms of products imagery.
            </Text>
          </View>
        </View>
      </View>
      <View style={[isPortrait ? styles.footerPortrait : styles.footerLandscape]}>
        <TouchableOpacity style={styles.cancelButton} onPress={() => props.navigation?.dispatch(StackActions.pop(1))}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
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
