import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import DropDownPicker from "react-native-dropdown-picker"
import { colors } from "app/theme"

export interface DropDownPickerNwProps {
  /**
   * An optional style override useful for padding & margin.
   */
  data: Array<{name: string, id:string}>,
  placeholder: string,
  style?: StyleProp<ViewStyle>,
  open: boolean
  setOpen: () => void,
  zIndex: number,
  zIndexInverse: number,
  onItemSelect?: (item: { label: string; value: string }) => void;
}

export interface DropDownPickerNwRef {
  getValue?: () => {label: string, value: string}
}
/**
 * Describe your component here
 */
export const DropDownPickerNw = observer(
  React.forwardRef<DropDownPickerNwRef,DropDownPickerNwProps >((props: DropDownPickerNwProps, ref) => {
  const { style, data, placeholder, open, setOpen, zIndex, zIndexInverse } = props;
  const $styles = [$container, style]

  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState(Array<{label: string, value:string}>);

  function transformBrandsData(array: Array<{name: string, id:string}>) {
    return array.map(item => ({
        label: item.name,
        value: item.id
    }));
}

  React.useEffect(() => {
    const dropdownData = transformBrandsData(data)
    setItems(dropdownData)
  },[data])

  React.useImperativeHandle(ref, () => ({
    getValue: () => {
      const selectedItem = items.find(item => item.value === value);
      return selectedItem || null;
    },
  }));
  
  return (
    <View style={$styles}>
      <DropDownPicker
        //ref={ref}
        placeholder={placeholder}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholderStyle={{
          color: "white",
        }}
        labelStyle={{color: "white"}}
        style={{backgroundColor:'#232323',  borderWidth: 0, borderBottomWidth:1, borderColor: colors.palette.neutral600P}}
        listItemContainerStyle={{
          backgroundColor:'#2E2E2E',
          borderColor: "#fff",
          borderWidth:1,
          zIndex:1
        }}
        listItemLabelStyle={{
          color: "#fff"
        }}
        theme="DARK"
        zIndex={zIndex}
        zIndexInverse={zIndexInverse}
        />
    </View>
  )
    },
  ),
)

const $container: ViewStyle = {
  justifyContent: "center",
}

