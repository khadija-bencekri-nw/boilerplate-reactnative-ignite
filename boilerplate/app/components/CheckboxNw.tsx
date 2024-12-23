import * as React from "react"
import { useState } from "react"

import { Text } from "app/components/Text"
import { colors, typography } from "app/theme"
import { observer } from "mobx-react-lite"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

// Styles
const $container: ViewStyle = {
  justifyContent: "center",
  width: 80,
  height: 40,
  borderRadius: 50,
}

const $checkedCircleStyle: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  alignSelf: "flex-end",
  width: 40,
  height: 40,
  borderRadius: 40,
}

const $circleStyle: ViewStyle = {
  backgroundColor: colors.palette.subbackgroundColor1,
  alignSelf: "flex-start",
  width: 40,
  height: 40,
  borderRadius: 40,
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 18,
  fontWeight: "bold",
  color: colors.palette.neutral600,
  marginTop: 5,
  alignSelf: "center",
}

const $checkedText: TextStyle = {
  color: colors.palette.nwColor,
  fontFamily: typography.primary.normal,
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 5,
  alignSelf: "center",
}

// Component : CheckBox NW
export interface CheckboxNwProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  disabled?: boolean
}
export interface CheckboxNwRef {
  getChecked: () => boolean
  set: (options: { _checked?: boolean }) => void
}

export const CheckboxNw = observer(
  React.forwardRef<CheckboxNwRef, CheckboxNwProps>(function CheckboxNw({ style, disabled }, ref) {
    const $styles = [$container, style]
    const [checked, setChecked] = useState(false)

    React.useImperativeHandle(ref, () => ({
      getChecked: () => {
        return checked
      },
      set: ({ _checked }) => {
        if (_checked !== undefined) setChecked(_checked)
      },
    }))

    return (
      <TouchableOpacity
        onPress={() => {
          setChecked(!checked)
        }}
        style={[
          $styles,
          { backgroundColor: checked ? colors.palette.nwColor : colors.palette.neutral700 },
        ]}
        disabled={disabled}
      >
        <View style={checked ? $checkedCircleStyle : $circleStyle}>
          <Text style={checked ? $checkedText : $text}>{checked ? "✓" : "x"}</Text>
        </View>
      </TouchableOpacity>
    )
  }),
)
