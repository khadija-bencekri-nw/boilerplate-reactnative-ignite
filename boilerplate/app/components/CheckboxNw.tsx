import * as React from "react"
import { useState } from "react"

import { Text } from "app/components/Text"
import { colors, typography } from "app/theme"
import { observer } from "mobx-react-lite"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"
import { View } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"

export interface CheckboxNwProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

export interface CheckboxNwRef {
  getChecked?: () => {}
  set: (options: { checked?: boolean }) => void
}

/**
 * Describe your component here
 */
export const CheckboxNw = observer(
  React.forwardRef<CheckboxNwRef, CheckboxNwProps>(({ style }, ref) => {
    // export const CheckboxNw = observer(React.forwardRef(function CheckboxNw(props: CheckboxNwProps, ref: React.RefObject<CheckboxNwProps>) {
    const $styles = [$container, style]
    const [checked, setChecked] = useState(false)

    React.useImperativeHandle(ref, () => ({
      getChecked: () => {
        return checked
      },
      set: ({ checked }) => {
        if (checked !== undefined) setChecked(checked)
      },
    }))

    return (
      <TouchableOpacity
        ref={ref}
        onPress={() => {
          setChecked(!checked)
        }}
        style={[$styles, { backgroundColor: checked ? colors.palette.nwColor : colors.palette.neutral700 }]}
      >
        <View
          style={[
            $circleStyle,
            {
              backgroundColor: checked
                ? colors.palette.neutral100
                : colors.palette.subbackgroundColor1,
              alignSelf: checked ? "flex-end" : "flex-start",
            },
          ]}
        >
          <Text style={[$text, { color: checked ? colors.palette.nwColor : colors.palette.neutral600  }]}>
            {checked ? "✓" : "x"}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }),
)

const $container: ViewStyle = {
  justifyContent: "center",
  width: 80,
  height: 40,
  borderRadius: 50,
}

const $circleStyle: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 40,
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 18,
  fontWeight: "bold",
  color: colors.palette.primary500,
  marginTop: 5,
  alignSelf: "center",
}
