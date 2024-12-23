import * as React from "react"

import { BaseButton } from "./BaseButton"

import { observer } from "mobx-react-lite"
import type { StyleProp, ViewStyle } from "react-native"
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
  const { text, onPress } = props

  return <StyledSecondaryButton onPress={onPress} text={text} primary={false} />
})
