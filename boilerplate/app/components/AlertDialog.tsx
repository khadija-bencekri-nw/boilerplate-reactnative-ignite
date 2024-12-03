import { colors, typography } from "app/theme"
import React, { useState, forwardRef, useImperativeHandle } from "react"
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from "react-native"

export interface AlertDialogProps {
  defaultTitle?: string
  defaultMessage?: string
  defaultRedirectLabel?: string
  defaultCloseLabel?: string
}

export interface AlertDialogRef {
  show: () => void
  hide: () => void
  set: (options: {
    title?: string
    message?: string
    redirectLabel?: string
    closeLabel?: string
    onRedirect?: () => void
    onClose?: () => void
  }) => void
}

export const AlertDialog = forwardRef<AlertDialogRef, AlertDialogProps>(
  ({ defaultTitle, defaultMessage, defaultRedirectLabel, defaultCloseLabel }, ref) => {
    const [visible, setVisible] = useState(false)
    const [title, setTitle] = useState(defaultTitle || "")
    const [message, setMessage] = useState(defaultMessage || "")
    const [redirectLabel, setRedirectLabel] = useState(defaultRedirectLabel || "OK")
    //const [closeLabel, setCloseLabel] = useState(defaultCloseLabel || "Cancel")
    const [onRedirect, setOnRedirect] = useState<() => void>(() => {})
    const [onClose, setOnClose] = useState<() => void>(() => {})

    // Expose methods to parent through ref
    useImperativeHandle(ref, () => ({
      show: () => setVisible(true),
      hide: () => setVisible(false),
      set: ({
        title,
        message,
        redirectLabel,
        closeLabel,
        onRedirect,
        onClose,
      }) => {
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
        onRequestClose={() => setVisible(false)}
      >
        <View style={$overlay}>
          <View style={$container}>
            <Text style={$title}>{title}</Text>
            <Text style={$message}>{message}</Text>
            {/* Actions */}
            <View style={$actionsContainer}>
              {/* {closeLabel && (
                <TouchableOpacity
                  style={$button}
                  onPress={() => {
                    onClose()
                    setVisible(false)
                  }}
                >
                  <Text style={$buttonText}>{closeLabel}</Text>
                </TouchableOpacity>
              )} */}
              {redirectLabel && (
                <TouchableOpacity
                  style={$button}
                  onPress={() => {
                    onRedirect()
                    setVisible(false)
                  }}
                >
                  <Text style={$buttonText}>{redirectLabel}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    )
  },
)

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
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
}

const $title: TextStyle = {
  alignSelf: 'center',
  fontFamily: typography.primary.bold,
  fontSize: 18,
  fontWeight: "bold",
  marginBottom: 20,
  color: colors.palette.primary500,
}

const $message: TextStyle = {
  fontSize: 14,
  textAlign: "center",
  color: "black"
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