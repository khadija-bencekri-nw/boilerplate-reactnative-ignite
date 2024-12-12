import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { useState } from "react"
import { TouchableOpacity } from "react-native-gesture-handler"

export interface CheckboxNwProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export interface CheckboxNwRef {
  getChecked?: () => {}
  set: (options: {
    checked?: boolean
  }) => void
}

/**
 * Describe your component here
 */
export const CheckboxNw = observer(React.forwardRef<CheckboxNwRef,CheckboxNwProps> (({style}, ref) => {
  //export const CheckboxNw = observer(React.forwardRef(function CheckboxNw(props: CheckboxNwProps, ref: React.RefObject<CheckboxNwProps>) {
  const $styles = [$container, style]
  const [checked, setChecked] = useState(false);

  React.useImperativeHandle(ref, () => ({
    getChecked: () => {  return checked },
    set: ({
      checked,
    }) => {
      if (checked !== undefined) setChecked(checked)
    }
  }))

  return (
    <TouchableOpacity ref={ref} onPress={() => setChecked(!checked)} style={[$styles, { backgroundColor: checked? '#EB514E' : '#3E3E3E'}]}>
      <View style={[$circleStyle, {backgroundColor: checked? 'white': '#212121', alignSelf: checked? 'flex-end' : 'flex-start' }]}>
        <Text style={[$text, {color: checked? '#EB514E' : 'grey'}]} >{checked ? '✓' : 'x' }</Text>
      </View>
    </TouchableOpacity>
  )
}))

const $container: ViewStyle = {
  justifyContent: "center",
  width: 80,
  height: 40,
  borderRadius: 50
}

const $circleStyle: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 40,
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 18,
  fontWeight: 'bold',
  color: colors.palette.primary500,
  marginTop: 5,
  alignSelf: 'center'
}
