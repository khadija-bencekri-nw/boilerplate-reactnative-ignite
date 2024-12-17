import * as React from "react"

import { BaseButton } from "./BaseButton"

import { observer } from "mobx-react-lite"
import type { StyleProp, ViewStyle } from "react-native"
import styled from "styled-components/native"

export interface PrimaryButtonProps {
  text: string
  onPress: () => void
  style?: StyleProp<ViewStyle>
}

const StyledPrimaryButton = styled(BaseButton)`
  width: 148px;
  height: 56px;
  border-radius: 50px;
  border-width: 1px;
  border-color: #ffffff;
`

export const PrimaryButton = observer(function PrimaryButton(props: PrimaryButtonProps) {
  const { text, onPress } = props

  return <StyledPrimaryButton onPress={onPress} text={text} primary={true} />
})
