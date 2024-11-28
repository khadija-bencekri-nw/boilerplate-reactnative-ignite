import { observer } from "mobx-react-lite"
import React, { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { ImageBackground, View, TextInput, TextStyle, ViewStyle, TouchableOpacity, Image, ImageStyle, Dimensions } from "react-native"
import { Button, Icon, Loader, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { api } from "app/services/api"
import AsyncStorage from "@react-native-async-storage/async-storage"

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
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores()

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    //setAuthEmail("john.wick@nimbleways.com")
    //setAuthPassword("nimbleways")

    // Return a "cleanup" function that React will run when the component unmounts
    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [])

  const storeConnecteduser = async (user: object) => {
    const user_ = {name: user.name, username: user.username.value};
    AsyncStorage.removeItem("LAST_CONNECTED_USER");
    AsyncStorage.setItem("LAST_CONNECTED_USER", JSON.stringify(user_), (err)=> {
      if(err){
          console.log("an error");
          throw err;
      }
      console.log("success");
      }).catch((err)=> {
          console.log("error is: " + err);
      });
  }

  const error = isSubmitted ? validationError : ""

  async function login() {
    setIsSubmitted(true);
    setAttemptsCount(attemptsCount + 1);
  
    if (validationError) return;
    setLoading(true);
    const result = await api.login(authEmail, authPassword);
  
    if (result.kind === "ok") {
      setAuthToken(result.authToken);
      setAuthEmail("");
      setAuthPassword("");
      //storeConnecteduser(result?.user);
      _props.navigation.navigate("Main", { screen: "MainTabNavigator"})

    } else {
      if (result.kind === "not-found") {
        setErrorMessage("No user is signed up with this email. Please sign up.");
      } else if (result.kind === "unauthorized") {
        setErrorMessage("Email or password is incorrect.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
    setLoading(false);
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
              //labelTx="loginScreen.emailFieldLabel"
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
              //labelTx="loginScreen.passwordFieldLabel"
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
            <Button
              testID="login-button-google"
              tx="loginScreen.google"
              style={$secondaryButton}
              preset="reversed"
              textStyle={{color: '#ffff'}}
              onPress={login}
              LeftAccessory={(props) => <Icon style={$buttonIcon} icon="google" />}
            />
            <Button
              testID="login-button-apple"
              tx="loginScreen.apple"
              style={$secondaryButton}
              preset="reversed"
              textStyle={{color: '#ffff'}}
              onPress={login}
              LeftAccessory={(props) => <Icon style={$buttonIcon} icon="apple" />}
            />
            <TouchableOpacity onPress={() => {_props.navigation.navigate("Join");}} style={{alignItems: 'center', marginTop: 20}}>
              <Text tx="loginScreen.joinSentence" style={[$sideButtonText]} />
            </TouchableOpacity>
          </View>
      </View>
      {loading && (
        <Loader loading={loading} />
      )}
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