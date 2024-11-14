import * as React from "react";
import { StyleProp, TextStyle, View, ViewStyle, Modal as RNModal , TouchableOpacity, Button } from "react-native";
import { observer } from "mobx-react-lite";
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the close button
import { colors, typography } from "app/theme";
import { Text } from "app/components/Text";
import { withFinalizedMod } from "expo/config-plugins";

export interface ModalProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>;
  visible: boolean; // Add visible prop to control modal visibility
  onClose: () => void; // Function to handle close action
  onRedirectToLogin: () => void; // Function to handle redirect to login
}

/**
 * Confirmation modal component
 */
export const Modal = observer(function Modal(props: ModalProps) {
  const { style, visible, onClose, onRedirectToLogin } = props;
  const $styles = [style];

  if (!visible) return null; // Don't render if the modal is not visible

  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={$modalOverlay}>
        <View style={$modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          <Text style={$modalText}>Congratulations!</Text>
          <Text style={$congratsMessage}>Now you can sign in using your email as username.</Text>
          <TouchableOpacity style={styles.customButton} onPress={onRedirectToLogin}>
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
});

const $modalOverlay: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker semi-transparent background
};

const $modalContainer: ViewStyle = {
  width: '80%', // Width of the modal card
  padding: 20,
  backgroundColor: "#1E1E1E", // Dark background for the card
  borderRadius: 15, // Rounded corners
  shadowColor: "#000", // Shadow for the card
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  alignItems: 'center',
  elevation: 5, // Elevation for Android
};

const $modalText: TextStyle = {
  fontSize: 20,
  marginBottom: 15,
  color: "#ffffff", // White text color for contrast
  textAlign: "center", // Center the text
};

const $congratsMessage: TextStyle = {
  fontSize: 16,
  marginBottom: 20,
  color: "#ffffff", // White text color for the message
  textAlign: "center", // Center the message
};

const styles = {
  closeButton: {
    alignSelf: 'flex-end', // Position the close button at the top right
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
    color: "#ffffff", // Text color for the button
    fontSize: 16, // Font size for button text
  },
};

export default Modal;
