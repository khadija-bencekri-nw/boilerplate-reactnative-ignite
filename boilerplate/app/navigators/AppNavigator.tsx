/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  NavigatorScreenParams,
  useNavigation,
} from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { observer } from "mobx-react-lite"
import React from "react"
import { SafeAreaView, useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { useStores } from "../models" // @demo remove-current-line
import { MainTabNavigator, MainTabParamList } from "./MainTabNavigator"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import CustomHeader from "app/components/CustomHeader";
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
  Login?: undefined
  Join: undefined
  Join2: undefined
  Dashboard: undefined
  Profile: undefined
  Coworkers: undefined
  Product: undefined
  AddProduct: undefined
  Main: NavigatorScreenParams<MainTabParamList>
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()
const Drawer = createDrawerNavigator();

const AppStack = observer(function AppStack() {
  // @demo remove-block-start
  const {
    authenticationStore: { isAuthenticated },
  } = useStores()

  // @demo remove-block-end
  return (
    <Stack.Navigator
      screenOptions={{ navigationBarColor: colors.background }}
      initialRouteName={isAuthenticated ? "Main" : "Welcome"} // @demo remove-current-line
    >
      {/* @demo remove-block-start */}
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={DrawerNavigator} options={{headerShown: false}} />
          <Stack.Screen name="Product" component={Screens.ProductScreen} 
            options={{header: ({ navigation }) => <CustomHeader navigation={navigation} source={"Product"} />}}/>
          <Stack.Screen name="AddProduct" component={Screens.AddProductScreen} options={{header: ({ navigation }) => 
            <CustomHeader navigation={navigation} source="addProduct" />}}/>
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Join" component={Screens.JoinScreen} options={{headerShown: false}}/>
          <Stack.Screen name="Join2" component={Screens.JoinScreen2} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={Screens.LoginScreen} options={{headerShown: false}}/>
        </>
      )}
    </Stack.Navigator>
  )
})

const DrawerNavigator = ({ route, navigation }) => {
  const logout = route?.params?.logout;
  console.log('route', route)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Drawer.Navigator 
        screenOptions={{ 
          drawerStyle: {
              backgroundColor: '#232324',
            },
          drawerLabelStyle: {
            color: 'white',
          },
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} onLogout={logout} />}
        >
        <Drawer.Screen name="MainTabNavigator" component={MainTabNavigator} options={{header: ({ navigation }) => 
          <CustomHeader onDrawerToggle={() => navigation.toggleDrawer()} navigation={navigation} source={"dashboard"} />}}/>
        <Drawer.Screen name="Help" component={Screens.HelpScreen} options={{header: ({ navigation }) => 
          <CustomHeader onDrawerToggle={() => navigation.toggleDrawer()} navigation={navigation}  source={"help"}/>}}/>
      </Drawer.Navigator>
    </SafeAreaView>
  )
};

const CustomDrawerContent = ({onLogout, ...props}) => {

  const handleLogout = () => {
    onLogout()
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        labelStyle={{color: "white"}}
        label="Log out"
        onPress={handleLogout}
      />
    </DrawerContentScrollView>
  );
}

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
