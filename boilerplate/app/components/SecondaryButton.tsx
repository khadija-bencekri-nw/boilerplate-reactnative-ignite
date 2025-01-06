import React from "react"

import { BaseButton } from "./BaseButton"
import type { ButtonAccessoryProps } from "./Button"

import { observer } from "mobx-react-lite"
import type { StyleProp, ViewStyle } from "react-native"

export interface SecondaryButtonProps {
  text: string
  onPress: () => void
  className?: string
  textClassName?: string
  testID?: string
  RightAccessory?: React.ComponentType<ButtonAccessoryProps>
  LeftAccessory?: React.ComponentType<ButtonAccessoryProps>
  children?: React.ReactNode
  disabled?: boolean
  disabledStyle?: StyleProp<ViewStyle>
}

export const SecondaryButton = observer(function SecondaryButton({
  text,
  onPress,
  className,
  textClassName,
  testID,
  LeftAccessory,
  RightAccessory,
  disabled,
}: SecondaryButtonProps) {
  return (
    <BaseButton
      text={text}
      onPress={onPress}
      primary={false}
      className={className}
      textClassName={textClassName}
      testID={testID}
      LeftAccessory={LeftAccessory}
      RightAccessory={RightAccessory}
      disabled={disabled}
    />
  )
})
