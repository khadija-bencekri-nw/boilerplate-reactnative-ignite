import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { View, TextInput, TextStyle, ViewStyle, ImageBackground, TouchableOpacity, Dimensions } from "react-native"
import { Button, Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

const { width } = Dimensions.get("window")
const isTablet = width > 600
const backgroundImage = require("../../assets/images/signup-background-img.jpeg")

interface JoinScreenProps extends AppStackScreenProps<"Join"> {}

export const JoinScreen: FC<JoinScreenProps> = observer(function JoinScreen(_props) {
  const {signUpStore} = useStores()

  const authPasswordInput = useRef<TextInput>(null)

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPortrait, setIsPortrait] = useState(true)
  
  // Error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({
    name: "",
    email: "",
    password: "",
  });

  const onChange = ({ window: { width, height } }) => {
    setIsPortrait(height >= width);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const validateName = () => {
    if (!signUpStore.name.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, name: "Name is required." }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
    return true;
  };

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!signUpStore.email.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "Email is required." }));
      return false;
    } else if (!emailPattern.test(signUpStore.email)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "Enter a valid email address." }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    return true;
  };

  const validatePassword = () => {
    if (!signUpStore.password.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "Password is required." }));
      return false;
    } else if (signUpStore.password.length < 6) {
      setErrors((prevErrors) => ({ ...prevErrors, password: "Password must be at least 6 characters." }));
      return false;
    }
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    return true;
  };

  const handleJoin = () => {
    setIsSubmitted(true);

    // Validate all fields when the submit button is pressed
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();

    if (isNameValid && isEmailValid && isPasswordValid) {
      _props.navigation.navigate("Join2");
    }
  };

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral100}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden],
  )

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      {isTablet && (<ImageBackground  source={backgroundImage} style={{flex:1}}/>)}
      <View style={[$contentContainer]}>
        <View style={$mainContent}>
          <Text tx="signUpScreen.step1" preset="subheading" style={$enterDetails} />
          <Text testID="signUpScreen-headline" tx="signUpScreen.headline" preset="heading" style={$signIn} />

          <TextField
            value={signUpStore.name}
            onChangeText={signUpStore.setName}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect={false}
            keyboardType="default"
            placeholderTx="signUpScreen.fullName"
            onSubmitEditing={() => {}}
            helper={errors.name}
            status={errors.name ? "error" : undefined}
            onEndEditing={validateName}
          />

          <TextField
            value={signUpStore.email}
            onChangeText={signUpStore.setEmail}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            placeholderTx="loginScreen.emailFieldPlaceholder"
            helper={errors.email}
            status={errors.email ? "error" : undefined}
            onSubmitEditing={() => {}}
            onEndEditing={validateEmail}
          />

          <TextField
            ref={authPasswordInput}
            value={signUpStore.password}
            onChangeText={signUpStore.setPassword}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            secureTextEntry={isAuthPasswordHidden}
            placeholderTx="loginScreen.passwordFieldPlaceholder"
            onSubmitEditing={() => authPasswordInput.current?.focus()}
            RightAccessory={PasswordRightAccessory}
            helper={errors.password}
            status={errors.password ? "error" : undefined}
            onEndEditing={validatePassword}
          />

          <Button
            testID="login-button"
            tx="signUpScreen.next"
            style={$tapButton}
            preset="reversed"
            textStyle={{color: '#000000'}}
            onPress={handleJoin}
          />
        </View>
        <CloseButton onPress={() => _props.navigation.navigate("Welcome")} isPortrait={isPortrait} />
      </View>
    </Screen>
  )
})

const CloseButton: FC<{ onPress: () => void , isPortrait: boolean}> = ({ onPress, isPortrait }) => (
  <View style={$sideButtonContainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon icon="close" style={{alignSelf: 'center'}} color={colors.palette.neutral100} size={(isTablet && !isPortrait)? 35 : 20} />
      <Text tx="common.cancel" style={isPortrait ? $sideButtonTextPortrait : $sideButtonText} />
    </TouchableOpacity>
  </View>
)

const $screenContentContainer: ViewStyle = {
  flex:1,
  flexDirection: 'row',
  backgroundColor: '#232324',
}

const $contentContainer: ViewStyle = {
  flex:1,
  flexDirection: 'row',
  paddingVertical: spacing.xxl,
  marginLeft : 20,
  justifyContent: 'center',

}

const $mainContent: ViewStyle = {
  flex: 1,
  paddingLeft: 50,
  paddingTop: 80,
  paddingBottom: spacing.xxl,
}

const $signIn: TextStyle = {
  marginBottom: spacing.xxl,
  color: colors.palette.neutral100
}

const $enterDetails: TextStyle = {
  color: colors.palette.neutral100
  //marginBottom: spacing.sm,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
  //borderTopWidth:0,
  //backgroundColor: '#232324',
}

const $tapButton: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

const $sideButtonContainer: ViewStyle = {
  flex: 0.25,
  alignItems: "center",
  alignContent: "flex-end"
}

const $sideButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: isTablet ? 20 : 12
}
const $sideButtonTextPortrait: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: isTablet ? 16 : 12
}