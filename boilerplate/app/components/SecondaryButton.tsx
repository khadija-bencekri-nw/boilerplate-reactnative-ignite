import * as React from "react"

import { BaseButton } from "./BaseButton"

import { colors, typography } from "app/theme"
import { observer } from "mobx-react-lite"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"
import styled from "styled-components/native"

export interface SecondaryButtonProps {
  text: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

const StyledSecondaryButton = styled(BaseButton)`
  width: 148px;
  height: 56px;
  border-radius: 50px;
  border-width: 1px;
  border-color: #ffffff;
`

export const SecondaryButton = observer(function SecondaryButton(props: SecondaryButtonProps) {
  const { style, text, onPress } = props
  const $styles = [$container, style]

  return <StyledSecondaryButton onPress={onPress} text={text} primary={false} />
})

const $container: ViewStyle = {
  justifyContent: "center",
}
