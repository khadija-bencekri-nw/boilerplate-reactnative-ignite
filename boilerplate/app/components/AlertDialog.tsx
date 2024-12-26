import React, { forwardRef, useImperativeHandle, useState } from "react"

import {
  $actionsContainer,
  $button,
  $buttonText,
  $container,
  $message,
  $overlay,
  $title,
} from "./AlertDialog.style"
import { Text } from "./Text"

import type { TxKeyPath } from "app/i18n"
import { Modal, TouchableOpacity, View } from "react-native"

export interface AlertDialogProps {
  // defaultTitle?: TxKeyPath
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
    onRedirect?: (() => Promise<void>) | (() => void)
    onClose?: () => void
    messageOptions?: I18n.TranslateOptions
  }) => void
}

export const AlertDialog = forwardRef<AlertDialogRef, AlertDialogProps>(function AlertDialog(
  { defaultMessage, defaultRedirectLabel, defaultCloseLabel },
  ref,
) {
  const [visible, setVisible] = useState(false)
  const [title_, setTitle_] = useState<TxKeyPath>()
  const [message_, setMessage_] = useState(defaultMessage)
  const [messageOptions_, setMessageOptions_] = useState<I18n.TranslateOptions>({})
  const [redirectLabel_, setRedirectLabel_] = useState(defaultRedirectLabel)
  const [closeLabel_, setCloseLabel_] = useState(defaultCloseLabel)
  const [onRedirect_, setOnRedirect_] = useState<() => void>()
  const [onClose_, setOnClose_] = useState<() => void>()

  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true)
    },
    hide: () => {
      setVisible(false)
    },
    set: ({ title, message, messageOptions, redirectLabel, closeLabel, onRedirect, onClose }) => {
      if (title !== undefined) setTitle_(title)
      if (message !== undefined) setMessage_(message)
      if (messageOptions !== undefined) setMessageOptions_(messageOptions)
      if (redirectLabel !== undefined) setRedirectLabel_(redirectLabel)
      if (closeLabel !== undefined) setCloseLabel_(closeLabel)
      if (onRedirect !== undefined) setOnRedirect_(() => onRedirect)
      if (onClose !== undefined) setOnClose_(() => onClose)
    },
  }))

  const renderTitle = (param: TxKeyPath | undefined) => {
    if (param !== undefined) {
      return <Text style={$title} tx={param} />
    }
    return null
  }

  const dialogAction = (type: string) => {
    if (type === "close" && onClose_ !== undefined) {
      onClose_()
    } else if (type === "redirect" && onRedirect_ !== undefined) {
      onRedirect_()
    }
    setVisible(false)
  }

  const renderLabel = (type: string, param: TxKeyPath | undefined) => {
    if (param !== undefined) {
      return (
        <TouchableOpacity
          style={$button}
          onPress={() => {
            type === "close" ? dialogAction("close") : dialogAction(type)
          }}
        >
          <Text style={$buttonText} tx={param} />
        </TouchableOpacity>
      )
    }
    return null
  }

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
          {renderTitle(title_)}
          <Text style={$message} tx={message_} txOptions={messageOptions_} />
          {/* Actions */}
          <View style={$actionsContainer}>
            {renderLabel("close", closeLabel_)}
            {renderLabel("redirect", redirectLabel_)}
          </View>
        </View>
      </View>
    </Modal>
  )
})
