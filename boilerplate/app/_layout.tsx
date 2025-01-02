import "../global.css"

import "expo-dev-client"

import React from "react"

import { NAV_THEME } from "../lib/theme"
import { useColorScheme, useInitialAndroidBarSync } from "../lib/useColorScheme"

import * as storage from "./utils/storage"
import { NAVIGATION_PERSISTENCE_KEY } from "./app"
import { useInitialRootStore } from "./models"
import { AppNavigator, useNavigationPersistence } from "./navigators"
import { customFontsToLoad } from "./theme"

import { ThemeProvider as NavThemeProvider } from "@react-navigation/native"
import { useFonts } from "expo-font"
import * as Linking from "expo-linking"
import { StatusBar } from "expo-status-bar"
import { initialWindowMetrics, SafeAreaProvider } from "react-native-safe-area-context"

interface AppProps {
  hideSplashScreen: () => Promise<boolean>
}

export default function RootLayout(props: AppProps) {
  const { hideSplashScreen } = props

  useInitialAndroidBarSync()
  const { colorScheme, isDarkColorScheme } = useColorScheme()

  const prefix = Linking.createURL("/")
  const config = {
    screens: {
      Login: {
        path: "",
      },
      Welcome: "welcome",
      Demo: {
        screens: {
          DemoShowroom: {
            path: "showroom/:queryIndex?/:itemIndex?",
          },
          DemoDebug: "debug",
          DemoPodcastList: "podcast",
          DemoCommunity: "community",
        },
      },
    },
  }

  const [areFontsLoaded] = useFonts(customFontsToLoad)

  const { rehydrated } = useInitialRootStore(() => {
    // This runs after the root store has been initialized and rehydrated.

    // If your initialization scripts run very fast, it's good to show the splash screen for just a bit longer to prevent flicker.
    // Slightly delaying splash screen hiding for better UX; can be customized or removed as needed,
    // Note: (vanilla Android) The splash-screen will not appear if you launch your app via the terminal or Android Studio. Kill the app and launch it normally by tapping on the launcher icon. https://stackoverflow.com/a/69831106
    // Note: (vanilla iOS) You might notice the splash-screen logo change size. This happens in debug/development mode. Try building the app for release.
    setTimeout(hideSplashScreen, 500)
  })

  const {
    initialNavigationState,
    onNavigationStateChange,
    isRestored: isNavigationStateRestored,
  } = useNavigationPersistence(storage, NAVIGATION_PERSISTENCE_KEY)

  if (!rehydrated || !isNavigationStateRestored || !areFontsLoaded) return null

  const linking = {
    prefixes: [prefix],
    config,
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <NavThemeProvider value={NAV_THEME[colorScheme]}>
        <AppNavigator
          linking={linking}
          initialState={initialNavigationState}
          onStateChange={onNavigationStateChange}
        />
      </NavThemeProvider>
    </SafeAreaProvider>
  )
}
