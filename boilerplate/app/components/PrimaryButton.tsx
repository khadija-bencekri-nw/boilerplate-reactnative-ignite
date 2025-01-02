import React from "react"

import { BaseButton } from "./BaseButton"

import { observer } from "mobx-react-lite"

export interface PrimaryButtonProps {
  text: string
  onPress: () => void
  className?: string
  textClassName?: string
}

export const PrimaryButton = observer(function PrimaryButton({
  text,
  onPress,
  className,
  textClassName,
}: PrimaryButtonProps) {
  return (
    <BaseButton
      text={text}
      onPress={onPress}
      primary={true}
      className={className}
      textClassName={textClassName}
    />
  )
})
