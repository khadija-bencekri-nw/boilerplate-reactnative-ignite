import * as React from "react"

import { colors } from "app/theme"
import { observer } from "mobx-react-lite"
import type { StyleProp, TextStyle, ViewStyle } from "react-native"
import { View } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"

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
}

export interface DropDownPickerNwRef {
  getValue?: () => { label: string; value: string }
}

export const DropDownPickerNw = observer(
  React.forwardRef<DropDownPickerNwRef, DropDownPickerNwProps>(function DropDownPickerN(
    props: DropDownPickerNwProps,
    ref,
  ) {
    const { style, data, placeholder, open, setOpen, zIndex, zIndexInverse } = props
    const $styles = [$container, style]

    const [value, setValue] = React.useState(null)
    const [items, setItems] = React.useState(Array<{ label: string; value: string }>)

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

    React.useImperativeHandle(ref, () => ({
      getValue: () => {
        const selectedItem = items.find((item) => item.value === value)
        return selectedItem
      },
    }))

    return (
      <View style={$styles}>
        <DropDownPicker
          // ref={ref}
          placeholder={placeholder}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholderStyle={$placeHolderStyle}
          labelStyle={$labelStyle}
          style={$style}
          listItemContainerStyle={$listItemContainerStyle}
          listItemLabelStyle={$listItemLabelStyle}
          theme="DARK"
          zIndex={zIndex}
          zIndexInverse={zIndexInverse}
        />
      </View>
    )
  }),
)

const $container: ViewStyle = {
  justifyContent: "center",
}

const $placeHolderStyle: TextStyle = {
  color: "white",
}

const $labelStyle: TextStyle = { color: "white" }

const $style: ViewStyle = {
  backgroundColor: colors.palette.subbackgroundColor,
  borderWidth: 0,
  borderBottomWidth: 1,
  borderColor: colors.palette.neutral600P,
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
