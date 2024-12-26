import React, { useEffect, useMemo, useRef, useState } from "react"

import type { AlertDialogRef, TextFieldAccessoryProps } from "../components"
import { AlertDialog, Button, Icon, Loader, Screen, Text, TextField } from "../components"
import { useStores } from "../models"
import type { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

import {
  $backgroundImg,
  $buttonIcon,
  $contentContainer,
  $headline,
  $joinButtonStyle,
  $logo,
  $mainContent,
  $screenContentContainer,
  $secondaryButton,
  $sideButtonContainer,
  $sideButtonText,
  $tapButton,
  $textContainer,
} from "./LoginScreen.style"
import { $textField } from "./ProfileScreen.style"

import GoogleSignIn from "app/components/GoogleSignIn"
import type { TxKeyPath } from "app/i18n"
import { api } from "app/services/api"
import type { GeneralApiProblem } from "app/services/api/apiProblem"
import { saveString } from "app/utils/secureStorage"
import Images from "assets/images"
import { observer } from "mobx-react-lite"
import type { ComponentType, FC } from "react"
import type { TextInput, ViewStyle } from "react-native"
import { Dimensions, Image, ImageBackground, TouchableOpacity, View } from "react-native"

const { width } = Dimensions.get("window")
const isTablet = width > 600

const BackButton: FC<{ onPress: () => void }> = ({ onPress }) => (
  <View style={$sideButtonContainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon icon="back" color={colors.palette.neutral100} size={25} />
      <Text text="back" style={$sideButtonText} />
    </TouchableOpacity>
  </View>
)

interface GoogleUser {
  user: {
    id: string
    name: string | null
    email: string
    photo: string | null
    familyName: string | null
    givenName: string | null
  }
  scopes?: string[]
  idToken: string | null
  /**
   * Not null only if a valid webClientId and offlineAccess: true was
   * specified in configure().
   */
  serverAuthCode: string | null
}

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  // const [isPortrait, setIsPortrait] = useState(false)
  const [loading, setLoading] = useState(false)

  const authPasswordInput = useRef<TextInput>(null)

  const [errorMessage, setErrorMessage] = useState<TxKeyPath>()
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userInfo, setUserInfo] = useState<GoogleUser>()
  const [attemptsCount, setAttemptsCount] = useState(0)
  const buttonRef = useRef(null)
  const alertRef = useRef<AlertDialogRef>(null)

  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores()

  // const onChange = (window: ScaledSize) => {
  // setIsPortrait(window.height >= window.width)
  // }

  useEffect(() => {
    const username = _props.route.params?.username
    if (username !== undefined) {
      setAuthEmail(username)
    }
    /* const subscription = Dimensions.addEventListener("change", ({ window }) => {
      onChange(window)
    }) */
    return () => {
      // subscription.remove()
    }
  }, [])

  useEffect(() => {
    if (userInfo?.idToken !== undefined && userInfo.idToken !== null) {
      login().catch((er) => {
        console.log("er", er)
      })
    }
  }, [userInfo])

  const handleSignInSuccess = (user: GoogleUser) => {
    // setAuthEmail(user?.user.email)
    setUserInfo(user)
  }

  const showDialog = (title: TxKeyPath, message: TxKeyPath) => {
    alertRef.current?.set({
      title,
      message,
      closeLabel: "common.close",
    })
    alertRef.current?.show()
  }

  const validateMail = (mail: string, domain: string = "theodo.com") => {
    const regex = new RegExp(`^[^\\s@]+@${domain}$`, "u")
    return !regex.test(mail)
  }

  const error = isSubmitted ? validationError : undefined

  function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0
  }

  async function login() {
    setAttemptsCount(attemptsCount + 1)
    setLoading(true)

    const body: { idToken?: string; email?: string; password?: string } = {}

    try {
      if (isNonEmptyString(userInfo?.idToken)) {
        if (validateMail(userInfo.user.email)) {
          setLoading(false)
          showDialog("loginScreen.errors.mailError", "loginScreen.errors.mailErrorDesc")
          setUserInfo(undefined)
          return
        }
        body.idToken = userInfo.idToken
      } else {
        setIsSubmitted(true)
        if (validationError.length > 0) {
          setLoading(false)
          return
        }
        body.email = authEmail
        body.password = authPassword
      }

      const result = await api.login(body)
      await handleLoginResult(result)
    } catch (er) {
      setErrorMessage("common.errorUnexpected")
    } finally {
      setLoading(false)
    }
  }

  const goToMain = () => {
    _props.navigation.navigate("Main")
  }

  async function handleLoginResult(
    result:
      | GeneralApiProblem
      | {
          kind: string
          authToken: string
          // user: { name: string; username: { value: string } }
        },
  ) {
    if (result.kind === "ok") {
      setAuthToken(result.authToken)
      setAuthEmail("")
      setAuthPassword("")
      await saveString("token", result.authToken)
        .then(() => {
          goToMain()
        })
        .catch(() => {
          console.error("Failed to save token")
        })
    } else {
      setErrorMessage(getErrorMessage(result.kind))
    }
  }

  function getErrorMessage(kind: string) {
    switch (kind) {
      case "not-found":
      case "unauthorized":
        return "loginScreen.errors.authError"
      default:
        return "common.errorUnexpected"
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
      {isTablet && <ImageBackground source={Images.backgroundImage} style={$backgroundImg} />}
      <View style={$contentContainer}>
        <BackButton
          onPress={() => {
            _props.navigation.goBack()
          }}
        />
        <View style={$mainContent}>
          <View style={$textContainer}>
            <Image source={Images.logo} style={$logo} />
            <Text testID="login-heading" text="Welcome Back" preset="heading" style={$headline} />
          </View>
          <TextField
            value={authEmail}
            onChangeText={setAuthEmail}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            keyboardType="email-address"
            placeholderTx="loginScreen.emailFieldPlaceholder"
            helper={error}
            status={error === undefined ? undefined : "error"}
            onSubmitEditing={() => authPasswordInput.current?.focus()}
          />

          <TextField
            ref={authPasswordInput}
            value={authPassword}
            onChangeText={setAuthPassword}
            containerStyle={$textField}
            autoCapitalize="none"
            autoComplete="password"
            autoCorrect={false}
            secureTextEntry={isAuthPasswordHidden}
            placeholderTx="loginScreen.passwordFieldPlaceholder"
            onSubmitEditing={login}
            RightAccessory={PasswordRightAccessoryMemo}
          />

          {isNonEmptyString(errorMessage) ? (
            <Text style={{ color: colors.error, marginBottom: spacing.md }} tx={errorMessage} />
          ) : null}

          <Button
            testID="login-button"
            tx="loginScreen.signIn"
            style={$tapButton}
            preset="reversed"
            textStyle={{ color: colors.palette.neutral900 }}
            onPress={login}
          />
          <GoogleSignIn
            ref={buttonRef}
            testID="login-button-google"
            tx="loginScreen.google"
            style={$secondaryButton}
            preset="reversed"
            textStyle={{ color: colors.palette.neutral100 }}
            onPress={login}
            LeftAccessory={() => <Icon style={$buttonIcon} icon="google" />}
            onSignInSuccess={handleSignInSuccess}
          />
          <Button
            testID="login-button-apple"
            tx="loginScreen.apple"
            style={$secondaryButton}
            preset="reversed"
            textStyle={{ color: colors.palette.neutral100 }}
            onPress={login}
            disabled={loading}
            LeftAccessory={() => <Icon style={$buttonIcon} icon="apple" />}
          />
          <TouchableOpacity
            onPress={() => {
              _props.navigation.navigate("Join")
            }}
            style={$joinButtonStyle}
          >
            <Text tx="loginScreen.joinSentence" style={$sideButtonText} />
          </TouchableOpacity>
        </View>
      </View>
      <Loader loading={loading} />
      <AlertDialog ref={alertRef} />
    </Screen>
  )
})
