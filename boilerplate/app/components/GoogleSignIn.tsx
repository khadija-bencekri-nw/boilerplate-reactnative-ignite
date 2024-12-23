import React, { forwardRef } from "react"

import type { ButtonAccessoryProps } from "./Button"
import { Button } from "./Button"

import { GoogleSignin } from "@react-native-google-signin/google-signin"
import type { TxKeyPath } from "app/i18n"
import type { ComponentType } from "react"

type GoogleSignInProps = {
  testID?: string
  tx: TxKeyPath
  style?: object
  preset?: "default" | "filled" | "reversed" | undefined
  textStyle?: object
  onPress?: () => void
  LeftAccessory?: ComponentType<ButtonAccessoryProps>
  onSignInSuccess: (userInfo: any) => void
}

const defaultProps: Partial<GoogleSignInProps> = {
  testID: "google-sign-in",
  tx: "loginScreen.google",
  style: {},
  preset: "default",
  textStyle: {},
  onPress: () => {
    console.log("GoogleSignIn button pressed")
  },
  LeftAccessory: () => null,
}
const GoogleSignIn = forwardRef<any, GoogleSignInProps>(function GoogleSignIn(props, ref) {
  const { testID, tx, style, preset, textStyle, LeftAccessory, onSignInSuccess } = {
    ...defaultProps,
    ...props,
  }

  const signIn = async () => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
      webClientId: "777558541856-ghcru6v9c4gi4mh5i6aj7jlk95vjb9ds.apps.googleusercontent.com",
      offlineAccess: true,
    })
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      onSignInSuccess(userInfo)
    } catch (error) {
      console.log("error : ", error)
    }
  }

  return (
    <Button
      testID={testID}
      tx={tx}
      style={style}
      preset={preset}
      textStyle={textStyle}
      onPress={async () => signIn()}
      LeftAccessory={LeftAccessory}
    />
  )
})

export default GoogleSignIn
