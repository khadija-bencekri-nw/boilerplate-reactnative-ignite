/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react"

import { Ionicons } from "@expo/vector-icons" // Import Ionicons for the close button
import { Text } from "app/components/Text"
import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"
import { Modal as RNModal, TouchableOpacity, View } from "react-native"

export interface ModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  visible: boolean // Add visible prop to control modal visibility
  onClose: () => void // Function to handle close action
  onRedirectToLogin: () => void // Function to handle redirect to login
}

export const Modal = observer(function Modal(props: ModalProps) {
  const { style, visible, onClose, onRedirectToLogin } = props
  const $styles = [style]

  if (!visible) return null // Don't render if the modal is not visible

  return (
    <RNModal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={[$modalOverlay, $styles]}>
        <View style={$modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton as ViewStyle}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={$modalText}>Congratulations!</Text>
          <Text style={$congratsMessage}>Now you can sign in using your email as username.</Text>
          <TouchableOpacity style={styles.customButton as ViewStyle} onPress={onRedirectToLogin}>
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  )
})

const $modalOverlay: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)",
}

const $modalContainer: ViewStyle = {
  width: "80%",
  padding: 20,
  backgroundColor: "#1E1E1E",
  borderRadius: 15,
  shadowColor: colors.palette.neutral900,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  alignItems: "center",
  elevation: 5,
}

const $modalText: TextStyle = {
  fontSize: 20,
  marginBottom: 15,
  color: colors.palette.neutral100,
  textAlign: "center",
}

const $congratsMessage: TextStyle = {
  fontSize: 16,
  marginBottom: 20,
  color: colors.palette.neutral100,
  textAlign: "center",
}

const styles = {
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  customButton: {
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: 200,
  },
  buttonText: {
    color: colors.palette.neutral100,
    fontSize: 16,
  },
}

export default Modal
