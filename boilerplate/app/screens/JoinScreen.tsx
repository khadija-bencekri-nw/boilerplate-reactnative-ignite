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
  const [attemptsCount, setAttemptsCount] = useState(0)
  const [isPortrait, setIsPortrait] = useState(true);

    const onChange = ({ window: { width, height  } }) => {
      setIsPortrait(height >= width);
    };

    useEffect(() => {
      const subscription = Dimensions.addEventListener('change', onChange);
      return () => subscription?.remove();
    }, []);

  useEffect(() => {
   
  }, [])

  const error = isSubmitted ? validationError : ""

  const  handleJoin = () => {
    
    _props.navigation.navigate("Join2")
  }

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
            //labelTx="loginScreen.emailFieldLabel"
            placeholder="signUpScreen.fullName"
            onSubmitEditing={() => authPasswordInput.current?.focus()}
          />

          <TextField
            value={signUpStore.email}
            onChangeText={signUpStore.setEmail}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            //labelTx="loginScreen.emailFieldLabel"
            placeholder="loginScreen.emailFieldPlaceholder"
            helper={error}
            status={error ? "error" : undefined}
            onSubmitEditing={() => authPasswordInput.current?.focus()}
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
            //labelTx="loginScreen.passwordFieldLabel"
            placeholderTx="loginScreen.passwordFieldPlaceholder"
            onSubmitEditing={handleJoin}
            RightAccessory={PasswordRightAccessory}
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