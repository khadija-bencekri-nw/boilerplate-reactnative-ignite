import React, { useEffect, useState } from "react"

import { PrimaryButton, SecondaryButton } from "../components"
import { Text } from "../components/nativewindui/Text"
import type { AppStackScreenProps } from "../navigators"

import { load } from "app/utils/storage"
import Images from "assets/images"
import clsx from "clsx"
import { COLORS } from "lib/theme/colors"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { ScaledSize } from "react-native"
import { Dimensions, Image, ImageBackground, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get("window")
const isTablet = width > 600

interface WelcomeNativewindScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeNativewindScreen: FC<WelcomeNativewindScreenProps> = observer(
  function WelcomeNativewindScreen({ navigation }) {
    const [username, setUsername] = useState<string | null>(null)
    const [isPortrait, setIsPortrait] = useState(false)

    const onChange = (window: ScaledSize) => {
      setIsPortrait(window.height >= window.width)
    }

    useEffect(() => {
      const subscription = Dimensions.addEventListener("change", ({ window }) => {
        onChange(window)
      })
      return () => {
        subscription.remove()
      }
    }, [])

    const loadLoastConnectedUserEmail = async () => {
      try {
        const storedMail: { username: string } = (await load("LAST_CONNECTED_USER")) as {
          username: string
        }
        setUsername(storedMail.username)
      } catch (error) {
        console.log("Failed to load username", error)
      }
    }

    useEffect(() => {
      loadLoastConnectedUserEmail().catch((er) => {
        console.log("er", er)
      })
    }, [])

    function handleJoin() {
      navigation.navigate("Join")
    }

    function handleSignIn(usernameParam?: string) {
      if (usernameParam === undefined) {
        navigation.navigate("Login")
      } else {
        navigation.navigate("Login", { username: usernameParam })
      }
    }

    return (
      <ImageBackground source={Images.backgroundImage} className="flex-1">
        {username !== null && (
          <TouchableOpacity
            className="absolute top-6 right-6 flex-row items-center"
            onPress={() => {
              handleSignIn(username)
            }}
          >
            <Image
              source={Images.userFilled}
              className={clsx("mr-2", isTablet ? "w-6 h-6" : "w-4 h-4")}
            />
            <Text
              className={clsx("text-gray-500", isTablet ? "text-lg" : "text-xs")}
              tx="welcomeScreen.continueAs"
            />
            <Text className={clsx("text-white font-bold ", isTablet ? "text-lg" : "text-xs")}>
              {username}
            </Text>
          </TouchableOpacity>
        )}
        <View className="flex-1 justify-center items-center w-full">
          <View className="flex-[2] justify-center items-center">
            <Image
              source={Images.logo}
              className={clsx(
                "mb-4",
                isTablet ? `w-[${width * 0.1}] h-[${width * 0.1}]` : "w-20 h-20",
              )}
            />
            <Text
              testID="login-heading"
              tx="signUpScreen.firstHeadline"
              style={{ color: COLORS.light.grey4 }}
              className={clsx(
                "text-black font-bold text-center mb-2",
                isTablet ? "text-[55px]" : "text-2xl",
              )}
            />
            <Text
              testID="join-heading-1"
              tx="signUpScreen.secondHeadline"
              style={{ color: COLORS.light.grey4 }}
              className={clsx("font-bold text-center mb-2", isTablet ? "text-[55px]" : "text-2xl")}
            />
            <Text
              testID="join-heading-2"
              tx="signUpScreen.subtitle"
              style={{ color: COLORS.light.grey3 }}
              className={clsx("text-center mt-4", isTablet ? "text-xl" : "text-sm")}
            />
          </View>

          <View className="flex-1 flex-row justify-center items-flex-start w-full px-4 space-x-4">
            <PrimaryButton
              text={"signUpScreen.join"}
              onPress={handleJoin}
              className="w-40 h-14 mx-8 bg-black text-white shadow-md rounded-full border-l border-white"
              textClassName="text-lg"
            />
            <SecondaryButton
              text={"signUpScreen.signIn"}
              onPress={() => {
                handleSignIn()
              }}
              className="w-40 h-14 mx-8 bg-white text-black shadow-md border border-black rounded-full"
              textClassName="text-lg"
            />
          </View>
        </View>
      </ImageBackground>
    )
  },
)
