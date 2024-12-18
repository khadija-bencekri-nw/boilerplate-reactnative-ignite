import React, { useEffect, useState } from "react"

import { PrimaryButton, SecondaryButton, Text } from "../components"
import type { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { ImageStyle, TextStyle, ViewStyle } from "react-native"
import { Dimensions, Image, ImageBackground, View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { load } from "app/utils/storage"

const { width } = Dimensions.get("window")
const isTablet = width > 600
const backgroundImage = require("../../assets/images/backgroundImage.png")
const logo = require("../../assets/images/logo.png")
const userFilled = require("../../assets/icons/userFilled.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen({
  navigation,
}) {
  const [username, setUsername] = useState<string | null>(null)
  const [isPortrait, setIsPortrait] = useState(false)

  const onChange = ({ window: { width, height } }) => {
    setIsPortrait(height >= width)
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", onChange)
    return () => {
      subscription.remove()
    }
  }, [])

  const loadLoastConnectedUserEmail = async () => {
    try {
      const storedMail = await load("LAST_CONNECTED_USER")
      setUsername(storedMail.username)
    } catch (error) {
      console.error("Failed to load username", error)
    }
  }

  useEffect(() => {
    loadLoastConnectedUserEmail()
  }, [])

  function handleJoin() {
    navigation.navigate("Join")
  }

  function handleSignIn(usernameParam?: string) {
    usernameParam ? navigation.navigate("Login", {usernameParam}) : navigation.navigate("Login")
  }

  return (
    <ImageBackground source={backgroundImage} style={$background}>
      {username && (
        <TouchableOpacity
          style={$loggedInContainer}
          onPress={() => {
            handleSignIn(username)
          }}
        >
          <Image source={userFilled} style={$iconStyle} />
          <Text style={$loggedInText} tx="welcomeScreen.continueAs" />
          <Text style={$userNameText}>{username}</Text>
        </TouchableOpacity>
      )}
      <View style={$container}>
        <View style={$textContainer}>
          <Image source={logo} style={$logo} />
          <Text
            testID="login-heading"
            tx="signUpScreen.firstHeadline"
            preset="heading"
            style={$headline}
          />
          <Text
            testID="join-heading-1"
            tx="signUpScreen.secondHeadline"
            preset="heading"
            style={$headline}
          />
          <Text
            testID="join-heading-2"
            tx="signUpScreen.subtitle"
            preset="subheading"
            style={$subtitle}
          />
        </View>
        <View style={isPortrait ? $buttonContainerPortrait : $buttonContainerLandscape}>
          <PrimaryButton text={"signUpScreen.join"} onPress={handleJoin} />
          <SecondaryButton text={"signUpScreen.signIn"} onPress={() => handleSignIn()} />
        </View>
      </View>
    </ImageBackground>
  )
})

const $background: ImageStyle = {
  flex: 1,
  resizeMode: "stretch",
}

const $loggedInContainer: ViewStyle = {
  position: "absolute",
  top: spacing.lg,
  right: spacing.lg,
  flexDirection: "row",
  alignItems: "center",
}

const $iconStyle: ImageStyle = {
  width: isTablet ? 24 : 16,
  height: isTablet ? 24 : 16,
  marginRight: spacing.sm,
}

const $loggedInText: TextStyle = {
  fontSize: isTablet ? 18 : 12,
  color: colors.palette.neutral500,
}

const $userNameText: TextStyle = {
  fontSize: isTablet ? 18 : 12,
  fontWeight: "bold",
  color: colors.palette.neutral100,
}

const $container: ViewStyle = {
  flex: 1,
  justifyContent: "space-between",
  padding: isTablet ? 30 : 16,
  backgroundColor: colors.transparent,
}

const $textContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
}

const $logo: ImageStyle = {
  width: isTablet ? width * 0.1 : 80,
  height: isTablet ? width * 0.1 : 80,
  marginBottom: spacing.md,
}

const $headline: TextStyle = {
  fontSize: isTablet ? 55 : 24,
  fontWeight: "bold",
  textAlign: "center",
  color: colors.palette.neutral100,
  marginBottom: spacing.sm,
  paddingTop: spacing.sm,
}

const $subtitle: TextStyle = {
  fontSize: isTablet ? 20 : 12,
  textAlign: "center",
  marginTop: spacing.md,
  color: colors.palette.neutral100,
}

const $buttonContainerLandscape: ViewStyle = {
  flex: 0.5,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "flex-start",
  paddingBottom: spacing.xl,
  paddingHorizontal: isTablet ? 420 : "auto",
}

const $buttonContainerPortrait: ViewStyle = {
  flex: 0.5,
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "flex-start",
  paddingBottom: spacing.xl,
  paddingHorizontal: isTablet ? 150 : "auto",
}
