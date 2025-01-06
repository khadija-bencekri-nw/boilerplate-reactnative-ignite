/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-lines */
import React, { useEffect, useMemo, useRef, useState } from "react"

import type { AlertDialogRef, TextFieldAccessoryProps } from "../components"
import { AlertDialog, Icon, Loader, Screen, SecondaryButton, TextField } from "../components"
import { Text } from "../components/nativewindui"
import { useStores } from "../models"
import type { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"

import GoogleSignIn from "app/components/GoogleSignIn"
import type { TxKeyPath } from "app/i18n"
import { api } from "app/services/api"
import type { GeneralApiProblem } from "app/services/api/apiProblem"
import { saveString } from "app/utils/secureStorage"
import Images from "assets/images"
import { observer } from "mobx-react-lite"
import type { ComponentType, FC } from "react"
import type { ImageStyle, TextInput, TextStyle, ViewStyle } from "react-native"
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

export const LoginNativeWindScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
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

  useEffect(() => {
    const username = _props.route.params?.username
    if (username !== undefined) {
      setAuthEmail(username)
    }
  }, [])

  useEffect(() => {
    const handleLogin = () => {
      if (userInfo?.idToken !== undefined && userInfo.idToken !== null) {
        login().catch((er) => {
          console.log(er)
        })
      }
    }

    handleLogin()
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

          <SecondaryButton
            testID="login-button"
            text="loginScreen.signIn"
            className="w-11/12 h-14 mx-8 m-1 bg-white text-black shadow-md border border-black rounded-full"
            textClassName="text-lg"
            onPress={login}
          />
          <GoogleSignIn
            ref={buttonRef}
            testID="login-button-google"
            tx="loginScreen.google"
            className="bg-[#232324] w-11/12 h-14 mx-8 m-1 shadow-md border border-white rounded-full"
            textClassName="text-lg text-white"
            onPress={login}
            LeftAccessory={() => <Icon style={$buttonIcon} icon="google" />}
            onSignInSuccess={handleSignInSuccess}
          />
          <SecondaryButton
            testID="login-button-apple"
            text="loginScreen.apple"
            className="bg-[#232324] w-11/12 h-14 mx-8 m-1 shadow-md border border-white rounded-full"
            textClassName="text-lg text-white"
            onPress={login}
            // disabled={loading}
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

const $screenContentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  backgroundColor: colors.background,
}

const $backgroundImg: ViewStyle = {
  flex: 1,
}

const $contentContainer: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  paddingTop: spacing.md,
  justifyContent: "center",
  marginTop: 10,
  paddingBottom: spacing.xxxl,
}

const $mainContent: ViewStyle = {
  flex: 1,
  marginBottom: spacing.xxl,
  marginRight: isTablet ? 100 : 50,
  marginTop: 10,
}

const $sideButtonContainer: ViewStyle = {
  flex: 0.2,
  alignItems: "center",
}

const $sideButtonText: TextStyle = {
  color: colors.palette.neutral100,
}

const $textField: ViewStyle = {
  marginBottom: spacing.xxl,
}

const $tapButton: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

const $textContainer: ViewStyle = {
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: spacing.xl,
  paddingTop: spacing.xxxl,
}

const $logo: ImageStyle = {
  width: isTablet ? width * 0.05 : 80,
  height: isTablet ? width * 0.05 : 80,
  // marginBottom: spacing.xs,
}

const $headline: TextStyle = {
  fontSize: isTablet ? 35 : 24,
  fontWeight: "bold",
  textAlign: "center",
  color: colors.palette.neutral100,
  marginBottom: spacing.sm,
  paddingTop: spacing.sm,
}

const $secondaryButton: ViewStyle = {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderColor: colors.palette.neutral100,
  borderRadius: 50,
  marginTop: spacing.xs,
}

const $buttonIcon: ImageStyle = {
  width: 12,
  height: 12,
  paddingRight: 30,
}

const $joinButtonStyle: ViewStyle = { alignItems: "center", marginTop: 20 }
