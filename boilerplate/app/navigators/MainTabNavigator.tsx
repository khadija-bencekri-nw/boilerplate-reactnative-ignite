import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import React from "react";
import { TextStyle, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "../components";
import { translate } from "../i18n"; // Ensure translation is correctly imported
import { DashboardScreen, CoworkersScreen, ProfileScreen } from "../screens"; // Import your actual screens
import { colors, spacing, typography } from "../theme";
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator";

export type MainTabParamList = {
  Dashboard: undefined
  Coworkers: undefined
  GetInspired: undefined
  Profile: undefined
  logout: () => void
  user?: object
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>;

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * This is the main navigator for the app with a bottom tab bar.
 * Each tab corresponds to a main section of the app.
 *
 * More info: https://reactnavigation.org/docs/bottom-tab-navigator/
 * @returns {JSX.Element} The rendered `MainTabNavigator`.
 */
export function MainTabNavigator() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [$tabBar, { height: bottom + 70 }],
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.palette.neutral100,
        tabBarLabelStyle: $tabBarLabel,
        tabBarItemStyle: $tabBarItem,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: translate("mainTabNavigator.dashboardTab"), // Adjust translation keys as needed
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="dashboard"
              color={focused ? colors.tint : colors.palette.neutral100}
              size={20}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Coworkers"
        component={CoworkersScreen}
        options={{
          tabBarLabel: translate("mainTabNavigator.coworkersTab"),
          tabBarIcon: ({ focused }) => (
            <Icon
              icon="coworker"
              color={focused ? colors.tint : colors.palette.neutral100}
              size={20}
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name="GetInspired"
        component={GetInspiredScreen}
        options={{
          tabBarAccessibilityLabel: translate("mainTabNavigator.getInspiredTab"),
          tabBarLabel: translate("mainTabNavigator.getInspiredTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="inspiration" color={focused ? colors.tint : undefined} size={30} />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: translate("mainTabNavigator.profileTab"),
          tabBarIcon: ({ focused }) => (
            <Icon icon="user" color={focused ? colors.tint : colors.palette.neutral100} size={20} />
          ),
        }}
      />
    </Tab.Navigator>
  )
}

const $tabBar: ViewStyle = {
  backgroundColor: colors.tabColor,
  borderTopColor: colors.transparent,
}

const $tabBarItem: ViewStyle = {
  paddingTop: spacing.md,
}

const $tabBarLabel: TextStyle = {
  fontSize: 12,
  fontFamily: typography.primary.medium,
  lineHeight: 16,
}
