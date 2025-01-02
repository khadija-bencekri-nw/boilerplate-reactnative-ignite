import React from "react"

import { BaseButton } from "./BaseButton"

import { observer } from "mobx-react-lite"

export interface SecondaryButtonProps {
  text: string
  onPress: () => void
  className?: string
  textClassName?: string
}

export const SecondaryButton = observer(function SecondaryButton({
  text,
  onPress,
  className,
  textClassName,
}: SecondaryButtonProps) {
  return (
    <BaseButton
      text={text}
      onPress={onPress}
      primary={false}
      className={className}
      textClassName={textClassName}
    />
  )
})
