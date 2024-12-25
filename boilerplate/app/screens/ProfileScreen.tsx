import React, { useEffect, useMemo, useRef, useState } from "react"

import {
  $actionButtonContainer,
  $activeTextStyle,
  $button,
  $cancelTextStyle,
  $checkBoxSubTitle,
  $checkBoxTitle,
  $checkTextContainer,
  $checkViewContainer,
  $container,
  $disabledTextStyle,
  $disabledWrapperStyle,
  $infoContainer,
  $labelTextPropsStyle,
  $largeButtonStyle,
  $picketStyle,
  $root,
  $separator,
  $textField,
  $title,
} from "./ProfileScreen.style"

import type {
  AlertDialogRef,
  CheckboxNwRef,
  DropDownPickerNwRef,
  TextFieldAccessoryProps,
} from "app/components"
import {
  AlertDialog,
  Button,
  CheckboxNw,
  DropDownPickerNw,
  Icon,
  Loader,
  Text,
  TextField,
} from "app/components"
import type { TxKeyPath } from "app/i18n"
import { useStores } from "app/models"
import type { AppStackScreenProps } from "app/navigators"
import { api } from "app/services/api"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { ComponentType, FC } from "react"
import type { TextInput } from "react-native"
import { View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

interface ProfileScreenProps extends AppStackScreenProps<"Profile"> {}

export const ProfileScreen: FC<ProfileScreenProps> = observer(function ProfileScreen() {
  const {
    authenticationStore: { user, setUser, logout },
  } = useStores()

  const authPasswordInput = useRef<TextInput>(null)

  const [isEditMode, setIsEditMode] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [authPassword, setAuthPassword] = useState("")
  // const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false)
  const alertRef = useRef<AlertDialogRef>(null)
  const dropdownRef = useRef<DropDownPickerNwRef>(null)
  const mailNotifRef = useRef<CheckboxNwRef>(null)
  const approvalNotifRef = useRef<CheckboxNwRef>(null)

  useEffect(() => {
    mailNotifRef.current?.set({ _checked: user.shouldReceiveMailNotifications })
    approvalNotifRef.current?.set({ _checked: user.shouldReceiveApprovalNotifications })
  }, [])

  const showDialog = (
    title: TxKeyPath,
    message: TxKeyPath,
    redirectLabel: TxKeyPath,
    onRedirect: (...args: unknown[]) => unknown,
  ) => {
    alertRef.current?.set({
      title,
      message,
      redirectLabel,
      onRedirect,
    })
    alertRef.current?.show()
  }

  const updateUser = async () => {
    setLoading(true)

    const request: Partial<{
      password: string
      position: string
      shouldReceiveMailNotifications: boolean
      shouldReceiveApprovalNotifications: boolean
    }> = {}

    if (authPassword.trim() !== "") {
      request.password = authPassword
    }

    request.shouldReceiveMailNotifications = mailNotifRef.current?.getChecked()
    request.shouldReceiveApprovalNotifications = approvalNotifRef.current?.getChecked()

    const response = await api.updateUser(user.id, request)
    if (response.kind === "ok") {
      setLoading(false)
      setUser(response.user)
      setIsEditMode(false)
    } else {
      setLoading(false)
      if (response.kind === "forbidden" || response.kind === "unauthorized") {
        const title = "common.sessionExpired"
        const message = "common.sessionExpiredMsg"
        const redirectLabel = "common.loginAgain"
        const onRedirect = () => {
          logout()
        }
        showDialog(title, message, redirectLabel, onRedirect)
      } else {
        const title = "common.errorUnexpectedTitle"
        const message = "common.errorUnexpected"
        const redirectLabel = "common.tryAgain"
        const onRedirect = async () => updateUser()
        showDialog(title, message, redirectLabel, onRedirect)
      }
    }
  }

  const handleDropdownOpen = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const PasswordRightAccessoryMemo: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory() {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={isEditMode ? colors.palette.neutral100 : colors.palette.neutral400}
            // containerStyle={props.style}
            size={20}
            onPress={
              isEditMode
                ? () => {
                    setIsAuthPasswordHidden(!isAuthPasswordHidden)
                  }
                : undefined
            }
          />
        )
      },
    [isAuthPasswordHidden],
  )

  const renderCheckView = (text: TxKeyPath, id: string, ref: React.RefObject<any>) => {
    return (
      <View style={$checkViewContainer}>
        <View style={$checkTextContainer}>
          <Text style={$checkBoxTitle} tx={text} />
          <Text style={$checkBoxSubTitle} tx={"profileScreen.notification.actionCheck"} />
        </View>
        <View style={$checkTextContainer}>
          <CheckboxNw ref={ref} disabled={!isEditMode} />
        </View>
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={$root}>
      <View style={$container}>
        <Text style={$title} tx={"profileScreen.userInfo.title"} />
        <View style={$separator} />
        <View style={$infoContainer}>
          <TextField
            value={user.email}
            containerStyle={$textField}
            style={$disabledTextStyle}
            labelTx="loginScreen.emailFieldLabel"
            editable={false}
            LabelTextProps={{ style: [$labelTextPropsStyle, $disabledTextStyle] }}
            inputWrapperStyle={$disabledWrapperStyle}
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
            labelTx="loginScreen.passwordFieldLabel"
            placeholderTx="loginScreen.passwordFieldPlaceholder"
            onSubmitEditing={() => {
              console.log("khadija")
            }}
            LabelTextProps={{ style: [$labelTextPropsStyle, $activeTextStyle] }}
            RightAccessory={PasswordRightAccessoryMemo}
            editable={isEditMode}
            inputWrapperStyle={isEditMode ? null : $disabledWrapperStyle}
          />
        </View>
        <DropDownPickerNw
          ref={dropdownRef}
          data={[
            { name: "developer", id: "developer" },
            { name: "techlead", id: "techlead" },
          ]}
          placeholder={user.position}
          style={$picketStyle}
          open={dropdownOpen}
          setOpen={handleDropdownOpen}
          zIndex={0}
          zIndexInverse={0}
          disabled={true}
        />
      </View>
      <View style={$container}>
        <Text style={$title} tx={"profileScreen.notification.title"} />
        <View style={$separator} />
        {renderCheckView("profileScreen.notification.mail", "mail", mailNotifRef)}
        {renderCheckView("profileScreen.notification.approval", "approval", approvalNotifRef)}
      </View>
      <View style={$actionButtonContainer}>
        {isEditMode ? (
          <>
            <Button
              style={[$button, { backgroundColor: colors.background }]}
              textStyle={$cancelTextStyle}
              tx="common.cancel"
              onPress={() => {
                setIsEditMode(false)
              }}
            />
            <Button style={[$button, $largeButtonStyle]} tx="common.confirm" onPress={updateUser} />
          </>
        ) : (
          <Button
            style={[$button, $largeButtonStyle]}
            tx="profileScreen.editInfo"
            onPress={() => {
              setIsEditMode(true)
            }}
          />
        )}
      </View>
      <AlertDialog ref={alertRef} />
      <Loader loading={loading} />
    </ScrollView>
  )
})
