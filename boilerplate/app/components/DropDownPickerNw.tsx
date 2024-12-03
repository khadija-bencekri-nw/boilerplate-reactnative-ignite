import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import DropDownPicker from "react-native-dropdown-picker"

export interface DropDownPickerNwProps {
  /**
   * An optional style override useful for padding & margin.
   */
  data: Array<{}>,
  placeholder: string,
  style?: StyleProp<ViewStyle>,
  open: boolean
  setOpen: () => void,
  zIndex: number,
  zIndexInverse: number,
  onItemSelect?: (item: { label: string; value: string }) => void;
}

/**
 * Describe your component here
 */
export const DropDownPickerNw = observer(
  React.forwardRef((props: DropDownPickerNwProps, ref) => {
  const { style, data, placeholder, open, setOpen, zIndex, zIndexInverse } = props;
  const $styles = [$container, style]

  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([]);

  function transformBrandsData(array: Array<object>) {
    return array.map(item => ({
        label: item.name,
        value: item.id
    }));
}

  React.useEffect(() => {
    const dropdownData = transformBrandsData(data)
    console.log('dropdownData', dropdownData, ' data', data)
    setItems(dropdownData)
  },[data])

  React.useImperativeHandle(ref, () => ({
    getValue: () => {
      const selectedItem = items.find((item) => item.value === value);
      return selectedItem || null;
    },
  }));
  
  return (
    <View style={$styles}>
      <DropDownPicker
        ref={ref}
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
        style={{backgroundColor:'#232323',  borderWidth: 0, borderBottomWidth:1, borderColor: "#404040"}}
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
}))

const $container: ViewStyle = {
  justifyContent: "center",
}

