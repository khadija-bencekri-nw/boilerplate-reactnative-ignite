import * as React from "react"

import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"
import { View } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"

// STYLE
const $container: ViewStyle = {
  justifyContent: "center",
}

const $placeHolderStyle: TextStyle = {
  color: colors.palette.neutral100,
}

const $disabledPlaceHolderStyle: TextStyle = {
  color: colors.palette.neutral500,
}

const $labelStyle: TextStyle = { color: colors.palette.neutral100 }

const $disabledLabelStyle: TextStyle = { color: colors.palette.neutral500 }

const $style: ViewStyle = {
  backgroundColor: colors.palette.subbackgroundColor,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderColor: colors.palette.neutral500,
}
const $listItemContainerStyle: ViewStyle = {
  backgroundColor: colors.palette.neutral750,
  borderColor: colors.palette.neutral100,
  borderWidth: 1,
  zIndex: 1,
}
const $listItemLabelStyle: TextStyle = {
  color: colors.palette.neutral100,
}

// COMPONENT

export interface DropDownPickerNwProps {
  /**
   * An optional style override useful for padding & margin.
   */
  data: Array<{ name: string; id: string }>
  placeholder: string
  style?: StyleProp<ViewStyle>
  open: boolean
  setOpen: () => void
  zIndex: number
  zIndexInverse: number
  onItemSelect?: (item: { label: string; value: string }) => void
  disabled?: boolean
}

export interface DropDownPickerNwRef {
  getValue?: () => { label: string; value: string } | null
  setUserValue?: (param: string) => void
}

export const DropDownPickerNw = observer(
  React.forwardRef<DropDownPickerNwRef, DropDownPickerNwProps>(function DropDownPickerN(
    props: DropDownPickerNwProps,
    ref,
  ) {
    const { style, data, placeholder, open, setOpen, zIndex, zIndexInverse, disabled } = props
    const $styles = [$container, style]

    const [items, setItems] = React.useState<Array<{ label: string; value: string }>>([])
    const [value, setValue] = React.useState<string>("")

    function transformBrandsData(array: Array<{ name: string; id: string }>) {
      return array.map((item) => ({
        label: item.name,
        value: item.id,
      }))
    }

    React.useEffect(() => {
      const dropdownData = transformBrandsData(data)
      setItems(dropdownData)
    }, [data])

    function findSelectedItem() {
      return items.find((item) => item.value === value)
    }

    React.useImperativeHandle(ref, () => ({
      getValue: () => findSelectedItem() ?? null,
      setUserValue: (userValue: string) => {
        setValue(userValue)
      },
    }))

    return (
      <View style={$styles}>
        <DropDownPicker
          placeholder={placeholder}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholderStyle={disabled === true ? $disabledPlaceHolderStyle : $placeHolderStyle}
          labelStyle={disabled === true ? $disabledLabelStyle : $labelStyle}
          style={$style}
          listItemContainerStyle={$listItemContainerStyle}
          listItemLabelStyle={$listItemLabelStyle}
          theme="DARK"
          zIndex={zIndex}
          zIndexInverse={zIndexInverse}
          disabled={disabled}
        />
      </View>
    )
  }),
)
