import * as React from "react"

import type { TxKeyPath } from "../i18n"
import { translate } from "../i18n"

import clsx from "clsx"
import { observer } from "mobx-react-lite"
import { Pressable, Text } from "react-native"

export interface BaseButtonProps {
  text: TxKeyPath | string
  onPress: () => void
  primary: boolean
  className?: string // Add NativeWind className prop
  textClassName?: string // Add className for the text
}

export const BaseButton = observer(function BaseButton(props: BaseButtonProps) {
  const { text, onPress, primary, className, textClassName } = props

  const i18nText = text && translate(text as TxKeyPath)
  const content = i18nText || text

  return (
    <Pressable
      className={clsx(
        "w-[148px] h-[56px] flex items-center justify-center rounded-full border",
        primary ? "bg-blue-500 border-transparent" : "bg-white border-gray-300",
        className,
      )}
      onPress={onPress}
    >
      <Text
        className={clsx(
          primary ? "text-white font-bold" : "text-gray-900 font-bold",
          textClassName,
        )}
      >
        {content}
      </Text>
    </Pressable>
  )
})
