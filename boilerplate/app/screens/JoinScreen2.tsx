import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { View, TextInput, ImageBackground, TouchableOpacity, ViewStyle, TextStyle, Dimensions, ActivityIndicator, Alert, ImageStyle } from "react-native"
import { Button, Icon, Screen, Text, Modal } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import DateTimePicker from '@react-native-community/datetimepicker'; 
import DatePicker from 'react-native-date-picker'
import { api } from "app/services/api"

const { width } = Dimensions.get("window")
const isTablet = width > 600
const backgroundImage = require("../../assets/images/signup-background-img2.png")

interface JoinScreen2Props extends AppStackScreenProps<"Join2"> {}

export const JoinScreen2: FC<JoinScreen2Props> = observer(function JoinScreen2(_props) {
  const {signUpStore} = useStores()

  const [selectedRole, setSelectedRole] = useState<string | null>(null) // State for selected role
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isPortrait, setIsPortrait] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [modalVisible, setModalVisible] = useState(false); // Modal state

  const onChange = ({ window: { width, height  } }) => {
    setIsPortrait(height >= width);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role === selectedRole ? null : role) 
    signUpStore.setRole(role);
  }


   const onDateChange = (event: any, selectedDate_: Date | undefined) => {
    setShowPicker(false);
    if (selectedDate_) {
      setSelectedDate(selectedDate_);
      signUpStore.setJoiningDate(selectedDate_);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };


  const handleJoin = async () => {
    setValidationError(null);

    if (!selectedRole) {
      setValidationError("Please select a role.");
      return;
    }
    if (!selectedDate) {
      setValidationError("Please pick a date.");
      return;
    }

    setLoading(true);

    // Now you can send the concatenated data to your backend
    const signUpData = {
      name: signUpStore.name,
      email: signUpStore.email,
      password: signUpStore.password,
      position: signUpStore.role,
      employmentDate: signUpStore.joiningDate,
      amount: signUpStore.amount,
      joiningDate: signUpStore.joiningDate,
    };

    const result = await api.signUp(signUpData)

    setLoading(false); // Hide loading indicator

    if (result.kind === "ok") {
      _props.navigation.navigate("Main", {result})
      // Show confirmation modal
      //setModalVisible(true);
    } else {
      let message = ""
      if(result.kind == "user-already-exists") {
        message = "Un compte avec cet e-mail existe déjà. Veuillez vous connecter ou utiliser un autre e-mail."
      }
      Alert.alert("Sign-Up Failed", message); 
    }
  }

  const handleRedirectToLogin = () => {
    _props.navigation.navigate("Login");
  };

  return (
    <Screen preset="auto" contentContainerStyle={$screenContentContainer} safeAreaEdges={["top", "bottom"]}>
      {isTablet && (<ImageBackground source={backgroundImage} style={$backgroundImage} />)}
      
      <View style={$contentContainer}>
        <BackButton onPress={() => _props.navigation.goBack()} isPortrait={isPortrait}/>

        <View style={$mainContent}>
        {validationError && ( <Text style={$errorText}>{validationError} </Text>)}

          <Text tx="signUpScreen.step2" preset="subheading" style={[$enterDetails]} />
          <Text testID="signUpScreen-headline" tx="signUpScreen.headline2" preset="heading" style={$pickRole} />

          <RoleSelection 
            title="signUpScreen.pickRole" 
            icon="code" 
            label="signUpScreen.developer" 
            isSelected={selectedRole === "developer"} 
            onSelect={() => handleRoleSelect("developer")} 
          />
          <RoleSelection 
            title="signUpScreen.pickRole" 
            icon="tl" 
            label="signUpScreen.techLead" 
            isSelected={selectedRole === "tl"} 
            onSelect={() => handleRoleSelect("tl")} 
          />

          <Text tx="signUpScreen.chooseDate" style={$pickRole} />

          <TouchableOpacity onPress={showDatePicker}>
            <DatePicker_ label="signUpScreen.startdate" selectedDate={selectedDate}/>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          {/* <DatePicker
            modal
            open={true}
            date={new Date()}
            onConfirm={(date) => {
              setShowPicker(false)
              setSelectedDate(date)
            }}
            onCancel={() => {
              setShowPicker(false)
            }}
          /> */}

        <View style={$balanceContainer}>
            <View style={{flex:2}}>
              <Text tx="signUpScreen.balance" style={$balanceText} />
            </View>
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Icon icon="info" size={15} color={colors.palette.neutral100} containerStyle={{justifyContent: 'center'}} style={$balanceIcon} />
              <TextInput 
                placeholder="0,00" 
                placeholderTextColor={colors.palette.neutral100} 
                keyboardType="numeric" 
                style={$balanceText} 
                onChangeText={signUpStore.setAmount}
            />
            </View>
          </View>

          <Button
            testID="sign-up-button"
            tx="signUpScreen.create"
            style={$primaryButton}
            preset="reversed"
            textStyle={$darkText}
            onPress={handleJoin}
          />
          <Button
            testID="back-button"
            tx="signUpScreen.back"
            style={$secondaryButton}
            preset="reversed"
            onPress={() => _props.navigation.goBack()}
            LeftAccessory={(props) => <Icon style={props.style} icon="arrowleft" />}
          />
          {loading && <ActivityIndicator size="large" color="#0000ff" style={$loader} />}
          <Modal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onRedirectToLogin={handleRedirectToLogin}
          />
        </View>
        <CloseButton onPress={() => _props.navigation.navigate("Welcome")} isPortrait={isPortrait} />
      </View>
    </Screen>
  )
})

/* Subcomponents for Reusability */

const BackButton: FC<{ onPress: () => void, isPortrait : boolean }> = ({ onPress, isPortrait }) => (
  <View style={$sideButtonContainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon icon="back" style={{alignSelf: 'center'}} color={colors.palette.neutral100} size={(isTablet&& !isPortrait)? 35 : 20} />
      <Text text="back" style={isPortrait ? $sideButtonTextPortrait :$sideButtonText} />
    </TouchableOpacity>
  </View>
)

const CloseButton: FC<{ onPress: () => void, isPortrait : boolean }> = ({ onPress, isPortrait }) => (
  <View style={$sideButtonContainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon icon="close" style={{alignSelf: 'center'}} color={colors.palette.neutral100} size={(isTablet && !isPortrait)? 35 : 20} />
      <Text tx="common.cancel" style={isPortrait ? $sideButtonTextPortrait :$sideButtonText} />
    </TouchableOpacity>
  </View>
)

const RoleSelection: FC<{ title: string; icon: string; label: string; isSelected: boolean; onSelect: () => void }> = ({ title, icon, label, isSelected, onSelect }) => (
  <TouchableOpacity onPress={onSelect} style={[$selectionContainer, isSelected && { borderColor: colors.palette.neutral100 }]}>
    <View style={{flex:2, flexDirection:'row'}}>
      <Icon icon={icon} size={35} style={$selectionIcon} />
      <Text tx={label} style={[ $selectionText ]} />
    </View>
    <View style={{flex:1, alignItems: 'flex-end', paddingRight: 15}}>
      {isSelected && <Icon icon="check" size={25} style={{tintColor: colors.palette.neutral100}} />}
    </View>
  </TouchableOpacity>
)

const DatePicker_: FC<{ label: string; selectedDate?: Date }> = ({ label, selectedDate }) => (
  <View style={$selectionContainer}>
    <Icon icon="calendar" size={20} style={$selectionIcon} />
    {selectedDate ? 
        <Text style={$selectionText} text={selectedDate.toLocaleDateString()} />
      : <Text tx={label} style={$selectionText}  />
    }
  </View>
)

/* Styles */

const $screenContentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: colors.background,
}

const $backgroundImage: ViewStyle = {
  flex: 1,
}

const $contentContainer: ViewStyle = {
  flexDirection: "row",
  flex: 1,
  paddingVertical: spacing.xl,
  justifyContent: "center",
}

const $mainContent: ViewStyle = {
  flex: 1,
  paddingTop: 80,
  paddingBottom: spacing.xxl,
}

const $errorText: TextStyle = {
  color: "red",
  marginBottom: spacing.sm,
  textAlign: "center",
}

const $enterDetails: TextStyle = {
  color: colors.palette.neutral100,
  // marginBottom: spacing.sm,
}

const $sideButtonContainer: ViewStyle = {
  flex: 0.3,
  alignItems: "center",
}

const $sideButtonText: TextStyle = {
  color: colors.palette.neutral100,
  alignSelf: "center",
  fontSize: isTablet ? 20 : 12,
}

const $sideButtonTextPortrait: TextStyle = {
  color: colors.palette.neutral100,
  alignSelf: "center",
  fontSize: isTablet ? 16 : 12,
}

const $darkText: TextStyle = {
  color: colors.palette.neutral900,
}

const $pickRole: TextStyle = {
  marginTop: spacing.md,
  color: colors.palette.neutral100,
}

const $selectionContainer: ViewStyle = {
  backgroundColor: "#2E2E30",
  borderWidth: 1,
  borderColor: "#393939",
  marginBottom: 10,
  borderRadius: 5,
  flexDirection: "row",
  alignItems: "center",
  height: 55,
  paddingLeft: 20,
}

const $selectionIcon: ImageStyle = {
  marginRight: 15,
}

const $selectionText: TextStyle = {
  color: colors.palette.neutral100,
}

const $balanceContainer: ViewStyle = {
  ...$selectionContainer,
  paddingLeft: 0,
  paddingRight: 0,
  flexDirection: "row",
}

const $balanceText: TextStyle = {
  color: colors.palette.neutral400,
  fontSize: 12,
  marginHorizontal: spacing.sm,
}

const $balanceIcon: ViewStyle = {
  marginLeft: 15,
}

const $primaryButton: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

const $secondaryButton: ViewStyle = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

const $loader: ViewStyle = {
  marginTop: 20,
}
