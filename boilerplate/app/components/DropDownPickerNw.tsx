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
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const DropDownPickerNw = observer(function DropDownPickerNw(props: DropDownPickerNwProps) {
  const { style, data, placeholder } = props
  const $styles = [$container, style]

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    setItems(data)
  },[])
  
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
        />
    </View>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}

