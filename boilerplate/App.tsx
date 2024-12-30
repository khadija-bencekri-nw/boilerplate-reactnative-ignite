import "@expo/metro-runtime"

import React from "react"

// import App from "./app/app"
import RootLayout from "app/_layout"
import * as SplashScreen from "expo-splash-screen"

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <RootLayout hideSplashScreen={SplashScreen.hideAsync} />
  // return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default IgniteApp
