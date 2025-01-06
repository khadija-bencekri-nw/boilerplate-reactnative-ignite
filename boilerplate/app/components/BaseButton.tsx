/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from "react"

import type { TxKeyPath } from "../i18n"
import { translate } from "../i18n"

import type { ButtonAccessoryProps } from "./Button"

import { spacing } from "app/theme"
import clsx from "clsx"
import { cn } from "lib/cn"
import { observer } from "mobx-react-lite"
import type { StyleProp, ViewStyle } from "react-native"
import { Pressable, Text } from "react-native"

export interface BaseButtonProps {
  text: TxKeyPath | string
  onPress: () => void
  primary: boolean
  className?: string
  textClassName?: string
  testID?: string
  RightAccessory?: React.ComponentType<ButtonAccessoryProps>
  LeftAccessory?: React.ComponentType<ButtonAccessoryProps>
  children?: React.ReactNode
  disabled?: boolean
  disabledStyle?: StyleProp<ViewStyle>
}

export const BaseButton = observer(function BaseButton(props: BaseButtonProps) {
  const {
    text,
    onPress,
    primary,
    className,
    textClassName,
    testID,
    LeftAccessory,
    RightAccessory,
    disabled,
  } = props

  const i18nText = text && translate(text as TxKeyPath)
  const content = i18nText || text

  return (
    <Pressable
      className={cn(
        "w-[148px] h-[56px] flex-row items-center justify-center rounded-full border",
        primary ? "bg-black border-transparent" : "bg-white border-gray-300",
        className,
      )}
      onPress={onPress}
      testID={testID}
    >
      {(state) => (
        <>
          {Boolean(LeftAccessory) && (
            <LeftAccessory style={$leftAccessoryStyle} pressableState={state} disabled={disabled} />
          )}
          <Text
            className={clsx(
              primary ? "text-white font-bold" : "text-gray-900 font-bold",
              textClassName,
            )}
          >
            {content}
          </Text>
          {Boolean(RightAccessory) && (
            <RightAccessory
              style={$rightAccessoryStyle}
              pressableState={state}
              disabled={disabled}
            />
          )}
        </>
      )}
    </Pressable>
  )
})

const $rightAccessoryStyle: ViewStyle = { marginStart: spacing.xs, zIndex: 1 }
const $leftAccessoryStyle: ViewStyle = { marginEnd: spacing.xs, zIndex: 1 }
