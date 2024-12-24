/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import React from "react"

import Config from "../config"
import { useStores } from "../models"

import type { MainTabParamList } from "./MainTabNavigator"
import { MainTabNavigator } from "./MainTabNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer"
import type {
  DrawerDescriptorMap,
  DrawerNavigationHelpers,
} from "@react-navigation/drawer/lib/typescript/src/types"
import type {
  DrawerNavigationState,
  NavigatorScreenParams,
  ParamListBase,
} from "@react-navigation/native"
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import type { NativeStackScreenProps } from "@react-navigation/native-stack"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import CustomHeader from "app/components/CustomHeader"
import type { Purchase } from "app/models/Purchase"
import * as Screens from "app/screens"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { TextStyle, ViewStyle } from "react-native"
import { SafeAreaView, useColorScheme } from "react-native"

/* 
STYLES
*/

const $root: ViewStyle = {
  flex: 1,
}

const $labelStyle: TextStyle = {
  color: "white",
}

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Login?: { username?: string }
  Join: undefined
  JoinSecond: undefined
  Dashboard: undefined
  Profile: undefined
  Coworkers: undefined
  Product: { item: Purchase }
  AddProduct: undefined
  Main: NavigatorScreenParams<MainTabParamList>
  Help: undefined
}

type DrawerItemListProps = {
  state: DrawerNavigationState<ParamListBase>
  navigation: DrawerNavigationHelpers
  descriptors: DrawerDescriptorMap
  onLogout?: () => void
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const { exitRoutes } = Config

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()
const Drawer = createDrawerNavigator()

const CustomDrawerContent = (props: DrawerItemListProps) => {
  const handleLogout = () => {
    if (props.onLogout !== undefined) props.onLogout()
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem labelStyle={$labelStyle} label="Log out" onPress={handleLogout} />
    </DrawerContentScrollView>
  )
}

const DrawerNavigator = observer(function DrawerNavigator() {
  const {
    authenticationStore: { logout, user },
  } = useStores()

  return (
    <SafeAreaView style={$root}>
      <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: colors.background,
          },
          drawerLabelStyle: {
            color: "white",
          },
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} onLogout={logout} />}
      >
        <Drawer.Screen
          name="MainTabNavigator"
          component={MainTabNavigator}
          options={{
            header: ({ navigation }) => (
              <CustomHeader
                onDrawerToggle={() => {
                  navigation.toggleDrawer()
                }}
                navigation={navigation}
                source={"dashboard"}
                user={user}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Help"
          component={Screens.HelpScreen}
          options={{
            header: ({ navigation }) => (
              <CustomHeader
                onDrawerToggle={() => {
                  navigation.toggleDrawer()
                }}
                navigation={navigation}
                source={"help"}
                user={user}
              />
            ),
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  )
})

const AppStack = observer(function AppStack() {
  const {
    authenticationStore: { isAuthenticated, user },
  } = useStores()

  return (
    <Stack.Navigator
      screenOptions={{ navigationBarColor: colors.background }}
      initialRouteName={isAuthenticated ? "Main" : "Welcome"}
    >
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={DrawerNavigator} options={{ headerShown: false }} />
          <Stack.Screen
            name="Product"
            component={Screens.ProductScreen}
            options={{
              header: ({ navigation }) => (
                <CustomHeader navigation={navigation} source={"Product"} user={user} />
              ),
            }}
          />
          <Stack.Screen
            name="AddProduct"
            component={Screens.AddProductScreen}
            options={{
              header: ({ navigation }) => (
                <CustomHeader navigation={navigation} source="addProduct" user={user} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={Screens.WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Join"
            component={Screens.JoinScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="JoinSecond"
            component={Screens.JoinSecondScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Screens.LoginScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  )
})

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
