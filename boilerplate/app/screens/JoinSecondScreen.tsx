/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from "react"

import type { IconTypes } from "../components"
import { Button, Icon, Modal, Screen, Text } from "../components"
import { useStores } from "../models"
import type { AppStackScreenProps } from "../navigators"
import { colors } from "../theme"

import {
  $actionIconStyle,
  $backgroundImage,
  $balanceContainer,
  $balanceIcon,
  $balanceIconContainer,
  $balanceInput,
  $balanceText,
  $balanceTextContainer,
  $darkText,
  $enterDetails,
  $errorText,
  $loader,
  $pickRole,
  $primaryButton,
  $roleSelector,
  $selectedRole,
  $selectionContainer,
  $selectionIcon,
  $selectionText,
  $sideButtonTextPortrait,
} from "./JoinSecondScreen.style"
import {
  $contentContainer,
  $mainContent,
  $screenContentContainer,
  $secondaryButton,
  $sideButtonContainer,
  $sideButtonText,
} from "./LoginScreen.style"

import DateTimePicker from "@react-native-community/datetimepicker"
import type { TxKeyPath } from "app/i18n"
import { api } from "app/services/api"
import Images from "assets/images"
import { observer } from "mobx-react-lite"
import type { FC } from "react"
import type { ImageStyle, ScaledSize } from "react-native"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

const { width } = Dimensions.get("window")
const isTablet = width > 600

interface JoinSecondScreenProps extends AppStackScreenProps<"JoinSecond"> {}

export const JoinSecondScreen: FC<JoinSecondScreenProps> = observer(function JoinScreen2(_props) {
  const { signUpStore } = useStores()

  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [showPicker, setShowPicker] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isPortrait, setIsPortrait] = useState(false)
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)

  const onChange = (window: ScaledSize) => {
    setIsPortrait(window.height >= window.width)
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      onChange(window)
    })
    return () => {
      subscription.remove()
      signUpStore.resetStore()
    }
  }, [])

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role === selectedRole ? null : role)
    signUpStore.setRole(role)
  }

  const onDateChange = (event: any, selectedDate_: Date | undefined) => {
    setShowPicker(false)
    if (selectedDate_ !== undefined) {
      setSelectedDate(selectedDate_)
      signUpStore.setJoiningDate(selectedDate_)
    }
  }

  const showDatePicker = () => {
    setShowPicker(true)
  }

  const handleJoin = async () => {
    setValidationError(null)

    if (selectedRole === null) {
      setValidationError("Please select a role.")
      return
    }
    if (selectedDate === undefined) {
      setValidationError("Please pick a date.")
      return
    }

    setLoading(true)

    const signUpData = {
      name: signUpStore.name,
      email: signUpStore.email,
      password: signUpStore.password,
      position: signUpStore.role,
      employmentDate: signUpStore.joiningDate,
      amount: signUpStore.amount,
      joiningDate: signUpStore.joiningDate,
    }

    const result = await api.signUp(signUpData)

    setLoading(false)

    if (result.kind === "ok") {
      signUpStore.resetStore()
      _props.navigation.popToTop()
      _props.navigation.navigate("Login")
    } else {
      let message = ""
      if (result.kind === "user-already-exists") {
        message =
          "Un compte avec cet e-mail existe déjà. Veuillez vous connecter ou utiliser un autre e-mail."
      }
      Alert.alert("Sign-Up Failed", message)
    }
  }

  const handleRedirectToLogin = () => {
    _props.navigation.navigate("Login")
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      {isTablet && <ImageBackground source={Images.backgroundImage} style={$backgroundImage} />}
      <View style={$contentContainer}>
        <BackButton
          onPress={() => {
            _props.navigation.goBack()
          }}
          isPortrait={isPortrait}
        />

        <View style={$mainContent}>
          {validationError !== null && <Text style={$errorText}>{validationError} </Text>}

          <Text tx="signUpScreen.step2" preset="subheading" style={$enterDetails} />
          <Text
            testID="signUpScreen-headline"
            tx="signUpScreen.headline2"
            preset="heading"
            style={$pickRole}
          />

          <RoleSelection
            title="signUpScreen.pickRole"
            icon="code"
            label="signUpScreen.developer"
            isSelected={selectedRole === "developer"}
            onSelect={() => {
              handleRoleSelect("developer")
            }}
          />
          <RoleSelection
            title="signUpScreen.pickRole"
            icon="tl"
            label="signUpScreen.techLead"
            isSelected={selectedRole === "tl"}
            onSelect={() => {
              handleRoleSelect("tl")
            }}
          />

          <Text tx="signUpScreen.chooseDate" style={$pickRole} />

          <TouchableOpacity onPress={showDatePicker}>
            <DatePicker label="signUpScreen.startdate" selectedDate={selectedDate} />
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              value={selectedDate ?? new Date()}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
          <View style={$balanceContainer}>
            <View style={$balanceTextContainer}>
              <Text tx="signUpScreen.balance" style={$balanceText} />
            </View>
            <View style={$balanceInput}>
              <Icon
                icon="info"
                size={15}
                color={colors.palette.neutral100}
                containerStyle={$balanceIconContainer}
                style={$balanceIcon}
              />
              <TextInput
                placeholder="0,00"
                placeholderTextColor={colors.palette.neutral100}
                keyboardType="numeric"
                style={$balanceText}
                onChangeText={(value) => {
                  signUpStore.setAmount(value)
                }}
              />
            </View>
          </View>

          <Button
            testID="sign-up-button"
            tx="signUpScreen.create"
            style={$primaryButton}
            preset="reversed"
            textStyle={$darkText}
            onPress={handleJoin}
          />
          <Button
            testID="back-button"
            tx="signUpScreen.back"
            style={$secondaryButton}
            preset="reversed"
            onPress={() => {
              _props.navigation.goBack()
            }}
            LeftAccessory={(props) => <Icon style={props.style as ImageStyle} icon="arrowleft" />}
          />
          {loading && (
            <ActivityIndicator size="large" color={colors.palette.primary500} style={$loader} />
          )}
          <Modal
            visible={modalVisible}
            onClose={() => {
              setModalVisible(false)
            }}
            onRedirectToLogin={handleRedirectToLogin}
          />
        </View>
        <CloseButton
          onPress={() => {
            _props.navigation.navigate("Welcome")
          }}
          isPortrait={isPortrait}
        />
      </View>
    </Screen>
  )
})


const BackButton: FC<{ onPress: () => void; isPortrait: boolean }> = ({ onPress, isPortrait }) => (
  <View style={$sideButtonContainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon
        icon="back"
        style={$actionIconStyle}
        color={colors.palette.neutral100}
        size={isTablet && !isPortrait ? 35 : 20}
      />
      <Text text="back" style={isPortrait ? $sideButtonTextPortrait : $sideButtonText} />
    </TouchableOpacity>
  </View>
)

const CloseButton: FC<{ onPress: () => void; isPortrait: boolean }> = ({ onPress, isPortrait }) => (
  <View style={$sideButtonContainer}>
    <TouchableOpacity onPress={onPress}>
      <Icon
        icon="close"
        style={$actionIconStyle}
        color={colors.palette.neutral100}
        size={isTablet && !isPortrait ? 35 : 20}
      />
      <Text tx="common.cancel" style={isPortrait ? $sideButtonTextPortrait : $sideButtonText} />
    </TouchableOpacity>
  </View>
)

const RoleSelection: FC<{
  title: string
  icon: IconTypes
  label: TxKeyPath
  isSelected: boolean
  onSelect: () => void
}> = ({ icon, label, isSelected, onSelect }) => (
  <TouchableOpacity
    onPress={onSelect}
    style={[$selectionContainer, isSelected && { borderColor: colors.palette.neutral100 }]}
  >
    <View style={$roleSelector}>
      <Icon icon={icon} size={35} style={$selectionIcon} />
      <Text tx={label} style={$selectionText} />
    </View>
    <View style={$selectedRole}>
      {isSelected && (
        <Icon icon="check" size={25} style={{ tintColor: colors.palette.neutral100 }} />
      )}
    </View>
  </TouchableOpacity>
)

const DatePicker: FC<{ label: TxKeyPath; selectedDate?: Date }> = ({ label, selectedDate }) => (
  <View style={$selectionContainer}>
    <Icon icon="calendar" size={20} style={$selectionIcon} />
    {selectedDate === undefined ? (
      <Text tx={label} style={$selectionText} />
    ) : (
      <Text style={$selectionText} text={selectedDate.toLocaleDateString()} />
    )}
  </View>
)