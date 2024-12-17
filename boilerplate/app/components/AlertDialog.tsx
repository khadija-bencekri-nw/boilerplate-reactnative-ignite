import React, { forwardRef, useImperativeHandle, useState } from "react"

import { Text } from "./Text"

import type { TxKeyPath } from "app/i18n"
import { colors, typography } from "app/theme"
import type { TextStyle, ViewStyle } from "react-native"
import { Modal, TouchableOpacity, View } from "react-native"

export interface AlertDialogProps {
  defaultTitle?: TxKeyPath
  defaultMessage?: TxKeyPath
  defaultRedirectLabel?: TxKeyPath
  defaultCloseLabel?: TxKeyPath
}

export interface AlertDialogRef {
  show: () => void
  hide: () => void
  set: (options: {
    title?: TxKeyPath
    message?: TxKeyPath
    redirectLabel?: TxKeyPath
    closeLabel?: TxKeyPath
    onRedirect?: () => void
    onClose?: () => void
  }) => void
}

export const AlertDialog = forwardRef<AlertDialogRef, AlertDialogProps>(function AlertDialog(
  { defaultTitle, defaultMessage, defaultRedirectLabel, defaultCloseLabel },
  ref,
) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState(defaultTitle)
  const [message, setMessage] = useState(defaultMessage)
  const [redirectLabel, setRedirectLabel] = useState(defaultRedirectLabel)
  const [closeLabel, setCloseLabel] = useState(defaultCloseLabel)
  const [onRedirect, setOnRedirect] = useState<() => void>(() => {})
  const [onClose, setOnClose] = useState<() => void>(() => {})

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true)
    },
    hide: () => {
      setVisible(false)
    },
    set: ({ title, message, redirectLabel, closeLabel, onRedirect, onClose }) => {
      if (title !== undefined) setTitle(title)
      if (message !== undefined) setMessage(message)
      if (redirectLabel !== undefined) setRedirectLabel(redirectLabel)
      if (closeLabel !== undefined) setCloseLabel(closeLabel)
      if (onRedirect !== undefined) setOnRedirect(() => onRedirect)
      if (onClose !== undefined) setOnClose(() => onClose)
    },
  }))

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setVisible(false)
      }}
    >
      <View style={$overlay}>
        <View style={$container}>
          <Text style={$title} tx={title} />
          <Text style={$message} tx={message} />
          {/* Actions */}
          <View style={$actionsContainer}>
            {closeLabel && (
              <TouchableOpacity
                style={$button}
                onPress={() => {
                  onClose && onClose()
                  setVisible(false)
                }}
              >
                <Text style={$buttonText} tx={closeLabel} />
              </TouchableOpacity>
            )}
            {redirectLabel && (
              <TouchableOpacity
                style={$button}
                onPress={() => {
                  onRedirect()
                  setVisible(false)
                }}
              >
                <Text style={$buttonText} tx={redirectLabel} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  )
})

const $overlay: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
}

const $container: ViewStyle = {
  padding: 20,
  backgroundColor: colors.palette.neutral100,
  borderRadius: 10,
  shadowColor: colors.palette.neutral900,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
}

const $title: TextStyle = {
  alignSelf: "center",
  fontFamily: typography.primary.bold,
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 20,
  color: colors.palette.primary500,
}

const $message: TextStyle = {
  fontSize: 14,
  textAlign: "center",
  color: "black",
}

const $actionsContainer: ViewStyle = {
  marginTop: 20,
  flexDirection: "row",
  justifyContent: "center",
}

const $button: ViewStyle = {
  padding: 10,
  backgroundColor: colors.palette.primary500,
  borderRadius: 5,
  alignItems: "center",
}

const $buttonText: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.neutral100,
}
