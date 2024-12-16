import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { ImageBackground, View, TextInput, TextStyle, ViewStyle, TouchableOpacity, Image, ImageStyle, Dimensions } from "react-native"
import { AlertDialog, AlertDialogRef, Button, Icon, Loader, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { api } from "app/services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { saveString } from "app/utils/secureStorage"
import GoogleSignIn from "app/components/GoogleSignIn"
import { TxKeyPath } from "app/i18n"

const { width } = Dimensions.get("window")
const isTablet = width > 600
const backgroundImage = require("../../assets/images/backgroundLogin.png")
const logo = require("../../assets/images/logo.png")

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const [isPortrait, setIsPortrait] = useState(false);
  const [loading, setLoading] = useState(false);

  const onChange = ({ window: { width, height  } }) => {
    setIsPortrait(height >= width);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription?.remove();
  }, []);

  const authPasswordInput = useRef<TextInput>(null)

  const [errorMessage, setErrorMessage] = useState("");
  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [userInfo, setUserInfo] = useState<typeof UserInfo>(null)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const buttonRef = useRef(null);
  const alertRef = useRef<AlertDialogRef>(null)

  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError, logout },
  } = useStores()

  useEffect(() => {
    //setAuthPassword("password")
    //setAuthEmail("khadija.bencekri@theodo.com")
    return () => {
      //setAuthPassword("password")
      //setAuthEmail("khadija.bencekri@theodo.com")
    }
  }, [])

  useEffect(() => {
    userInfo?.idToken && login();
  }, [userInfo])

  const handleSignInSuccess = (user: object) => {
    //setAuthEmail(user?.user.email)
    setUserInfo(user);
  };

  const storeConnectedUser = async (user: {name: string, username: {value: string}}) => {
    try {
      const user_ = { name: user.name, username: user.username.value };
      await AsyncStorage.removeItem("LAST_CONNECTED_USER");
      await AsyncStorage.setItem("LAST_CONNECTED_USER", JSON.stringify(user_));
      console.log("success");
    } catch (err) {
      console.error("Error saving user:", err);
    }
  }

  const showDialog = (title: TxKeyPath, message: TxKeyPath, redirectLabel?: TxKeyPath, onRedirect?: Function) => {
    alertRef?.current?.set({
      title,
      message,
      closeLabel: "common.close",
    })
    alertRef.current?.show()
  }

  const validateMail = (mail: string, domain: string = "theodo.com") => {
    const regex = new RegExp(`^[^\\s@]+@${domain}$`);
    return !regex.test(mail);
  }

  const error = isSubmitted ? validationError : ""

  async function login() {
    setAttemptsCount(attemptsCount + 1);
    setLoading(true);
  
    const body: { idToken?: string; email?: string; password?: string } = {};
  
    try {
      if (userInfo?.idToken) {
        if (validateMail(userInfo.user.email)) {
          setLoading(false);
          showDialog("loginScreen.errors.mailError", "loginScreen.errors.mailErrorDesc");
          setUserInfo("");
          return;
        }
        body.idToken = userInfo.idToken;
      } else {
        setIsSubmitted(true);
        if (validationError) {
          return;
        }
        body.email = authEmail;
        body.password = authPassword;
      }
  
      const result = await api.login(body);
      handleLoginResult(result);
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("common.errorUnexpected");
    } finally {
      setLoading(false);
    }
  }
  
  function handleLoginResult(result: { kind: string; authToken: string , user: object}) {
    if (result.kind === "ok") {
      setAuthToken(result.authToken);
      setAuthEmail("");
      setAuthPassword("");
      saveString("token", result.authToken)
        .then(() => _props.navigation.navigate("Main", { logout }))
        .catch(() => console.error("Failed to save token"));
    } else {
      setErrorMessage(getErrorMessage(result.kind));
    }
  }
  
  function getErrorMessage(kind: string) {
    switch (kind) {
      case "not-found":
      case "unauthorized":
        return "loginScreen.errors.authError";
      default:
        return "commons.errorUnexpected";
    }
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
      {isTablet && (
        <ImageBackground  source={backgroundImage} style={{flex:1}}/>
      )}
      <View style={[$contentContainer]}>
        <BackButton onPress={() => _props.navigation.goBack()} />
        <View style={$mainContent}>
          <View style={$textContainer}>
            <Image source={logo} style={$logo} />
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
              status={error ? "error" : undefined}
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
              RightAccessory={PasswordRightAccessory}
            />

            {errorMessage ? (
              <Text style={{ color: colors.error, marginBottom: spacing.md }}>
                {errorMessage}
              </Text>
            ) : null}

            <Button
              testID="login-button"
              tx="loginScreen.signIn"
              style={$tapButton}
              preset="reversed"
              textStyle={{color: '#000000'}}
              onPress={login}
            />
            <GoogleSignIn
              ref={buttonRef} 
              testID="login-button-google"
              tx="loginScreen.google"
              style={$secondaryButton}
              preset="reversed"
              textStyle={{color: '#ffff'}}
              onPress={login}
              LeftAccessory={() => <Icon style={$buttonIcon} icon="google" />}
              onSignInSuccess={handleSignInSuccess}
            />
            <Button
              testID="login-button-apple"
              tx="loginScreen.apple"
              style={$secondaryButton}
              preset="reversed"
              textStyle={{color: '#ffff'}}
              onPress={login}
              disabled={loading}
              LeftAccessory={(props) => <Icon style={$buttonIcon} icon="apple" />}
            />
            <TouchableOpacity onPress={() => {_props.navigation.navigate("Join");}} style={{alignItems: 'center', marginTop: 20}}>
              <Text tx="loginScreen.joinSentence" style={[$sideButtonText]} />
            </TouchableOpacity>
          </View>
      </View>
      <Loader loading={loading} />
      <AlertDialog  ref={alertRef}/>
      
    </Screen>
  )
})

const BackButton: FC<{ onPress: () => void }> = ({ onPress }) => (
  <View style={$sideButtonContainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon icon="back" color={colors.palette.neutral100} size={25} />
      <Text text="back" style={$sideButtonText} />
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
  paddingTop: spacing.md,
  justifyContent: 'center',
  marginTop: 10,
  paddingBottom: spacing.xxxl,
}

const $mainContent: ViewStyle = {
  flex: 1,
  marginBottom: spacing.xxl,
  marginRight: isTablet? 100 : 50,
  marginTop: 10,
}

const $sideButtonContainer: ViewStyle = {
  flex: 0.2,
  alignItems: "center",
}

const $sideButtonText: TextStyle = {
  color: colors.palette.neutral100,
}


const $signIn: TextStyle = {
  marginBottom: spacing.sm,
}

const $enterDetails: TextStyle = {
  marginBottom: spacing.lg,
}

const $hint: TextStyle = {
  color: colors.tint,
  marginBottom: spacing.md,
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
  paddingTop: spacing.xxxl
}

const $logo: ImageStyle = {
  width: isTablet ? width * 0.05 : 80,
  height: isTablet ? width * 0.05 : 80,
  //marginBottom: spacing.xs,
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
  paddingRight: 30
}