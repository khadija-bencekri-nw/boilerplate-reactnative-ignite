/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useMemo, useRef, useState } from "react"

import type { TextFieldAccessoryProps } from "../components"
import { Button, Icon, Screen, Text, TextField } from "../components"
import { useStores } from "../models"
import type { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

import Images from "assets/images"
import { observer } from "mobx-react-lite"
import type { ComponentType, FC } from "react"
import type { ImageStyle, ScaledSize, TextInput, TextStyle, ViewStyle } from "react-native"
import { Dimensions, ImageBackground, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get("window")
const isTablet = width > 600

interface JoinScreenProps extends AppStackScreenProps<"Join"> {}

export const JoinScreen: FC<JoinScreenProps> = observer(function JoinScreen(_props) {
  const { signUpStore } = useStores()

  const authPasswordInput = useRef<TextInput>(null)

  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  // const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPortrait, setIsPortrait] = useState(false)

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({
    name: "",
    email: "",
    password: "",
  })

  const onChange = (window: ScaledSize) => {
    setIsPortrait(window.height >= window.width)
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      onChange(window)
    })
    return () => {
      subscription.remove()
      signUpStore.resetStore()
    }
  }, [])

  const validateName = () => {
    if (signUpStore.name === "") {
      setErrors((prevErrors) => ({ ...prevErrors, name: "Name is required." }))
      return false
    }
    setErrors((prevErrors) => ({ ...prevErrors, name: "" }))
    return true
  }

  const validateEmail = () => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/u
    if (signUpStore.email === "") {
      setErrors((prevErrors) => ({ ...prevErrors, email: "Email is required." }))
      return false
    }
    if (!emailPattern.test(signUpStore.email)) {
      setErrors((prevErrors) => ({ ...prevErrors, email: "Enter a valid email address." }))
      return false
    }
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }))
    return true
  }

  const validatePassword = () => {
    if (signUpStore.password === "") {
      setErrors((prevErrors) => ({ ...prevErrors, password: "Password is required." }))
      return false
    }
    if (signUpStore.password.length < 6) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 6 characters.",
      }))
      return false
    }
    setErrors((prevErrors) => ({ ...prevErrors, password: "" }))
    return true
  }

  const handleJoin = () => {
    // setIsSubmitted(true)

    // Validate all fields when the submit button is pressed
    const isNameValid = validateName()
    const isEmailValid = validateEmail()
    const isPasswordValid = validatePassword()

    if (isNameValid && isEmailValid && isPasswordValid) {
      _props.navigation.navigate("Join2")
    }
  }

  const PasswordRightAccessoryMemo: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral100}
            containerStyle={props.style as ViewStyle}
            size={20}
            onPress={() => {
              setIsAuthPasswordHidden(!isAuthPasswordHidden)
            }}
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
      {isTablet && (
        <ImageBackground source={Images.backgroundImage} style={$imageBackgroundStyle} />
      )}
      <View style={$contentContainer}>
        <View style={$mainContent}>
          <Text tx="signUpScreen.step1" preset="subheading" style={$enterDetails} />
          <Text
            testID="signUpScreen-headline"
            tx="signUpScreen.headline"
            preset="heading"
            style={$signIn}
          />

          <TextField
            value={signUpStore.name}
            onChangeText={(value) => {
              signUpStore.setName(value)
            }}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="username"
            autoCorrect={false}
            keyboardType="default"
            placeholderTx="signUpScreen.fullName"
            // onSubmitEditing={() => {}}
            helper={errors.name}
            status={errors.name.length > 0 ? "error" : undefined}
            onEndEditing={validateName}
          />

          <TextField
            value={signUpStore.email}
            onChangeText={(value) => {
              signUpStore.setEmail(value)
            }}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            placeholderTx="loginScreen.emailFieldPlaceholder"
            helper={errors.email}
            status={errors.email.length > 0 ? "error" : undefined}
            onEndEditing={validateEmail}
          />

          <TextField
            ref={authPasswordInput}
            value={signUpStore.password}
            onChangeText={(value) => {
              signUpStore.setPassword(value)
            }}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            secureTextEntry={isAuthPasswordHidden}
            placeholderTx="loginScreen.passwordFieldPlaceholder"
            onSubmitEditing={() => authPasswordInput.current?.focus()}
            RightAccessory={PasswordRightAccessoryMemo}
            helper={errors.password}
            status={errors.password.length > 0 ? "error" : undefined}
            onEndEditing={validatePassword}
          />

          <Button
            testID="login-button"
            tx="signUpScreen.next"
            style={$tapButton}
            preset="reversed"
            textStyle={{ color: colors.palette.neutral900 }}
            onPress={handleJoin}
          />
        </View>
        <CloseButton
          onPress={() => {
            _props.navigation.navigate("Welcome")
          }}
          isPortrait={isPortrait}
        />
      </View>
    </Screen>
  )
})

const CloseButton: FC<{ onPress: () => void; isPortrait: boolean }> = ({ onPress, isPortrait }) => (
  <View style={$sideButtonContainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon
        icon="close"
        style={$iconStyle}
        color={colors.palette.neutral100}
        size={isTablet && !isPortrait ? 35 : 20}
      />
      <Text tx="common.cancel" style={isPortrait ? $sideButtonTextPortrait : $sideButtonText} />
    </TouchableOpacity>
  </View>
)

const $screenContentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: colors.background,
}

const $contentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  paddingVertical: spacing.xxl,
  marginLeft: 20,
  justifyContent: "center",
}

const $imageBackgroundStyle: ViewStyle = {
  flex: 1,
}

const $mainContent: ViewStyle = {
  flex: 1,
  paddingLeft: 50,
  paddingTop: 80,
  paddingBottom: spacing.xxl,
}

const $signIn: TextStyle = {
  marginBottom: spacing.xxl,
  color: colors.palette.neutral100,
}

const $enterDetails: TextStyle = {
  color: colors.palette.neutral100,
  // marginBottom: spacing.sm,
}

const $textField: ViewStyle = {
  marginBottom: spacing.lg,
  // borderTopWidth:0,
  // backgroundColor: colors.background,
}

const $tapButton: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

const $sideButtonContainer: ViewStyle = {
  flex: 0.25,
  alignItems: "center",
  alignContent: "flex-end",
}

const $sideButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: isTablet ? 20 : 12,
}

const $sideButtonTextPortrait: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: isTablet ? 16 : 12,
}

const $iconStyle: ImageStyle = {
  alignSelf: "center",
}
