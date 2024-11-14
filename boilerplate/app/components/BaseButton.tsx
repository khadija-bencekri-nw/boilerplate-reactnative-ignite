import * as React from "react";
import { SafeAreaView, Pressable, Text,  TextStyle, View, ViewStyle } from 'react-native';
import { observer } from "mobx-react-lite";
import { translate, TxKeyPath } from '../i18n'; 
import { colors, typography } from "app/theme";

export interface BaseButtonProps {
  text: TxKeyPath | string;
  onPress: () => void;
  style?: object;  
  textStyle?: object;
  primary: boolean;
}

/**
 * Describe your component here
 */
export const BaseButton = observer(function BaseButton(props: BaseButtonProps) {
  const { style, text, onPress, primary } = props
  const $styles = [$container, style]

  const i18nText = text && translate(text as TxKeyPath);
  const content = i18nText || text;

  const backgroundColor = primary ? (pressed: boolean) => (pressed ? '#232324' : 'transparent') : (pressed: boolean) => (pressed ? '#EB514E' : '#FFFFFF');
  const borderColor = primary ? (pressed: boolean) => (pressed ? '#232324' : '#FFFFFF') : (pressed: boolean) => (pressed ? '#EB514E' : '#FFFFFF');
  const textColor = primary ? 'white' : 'black';


  return (
    <SafeAreaView style={$container}>
      <Pressable
        style={({ pressed }) => [
          $button,
          style,
          { 
            backgroundColor: backgroundColor(pressed),
            borderColor: borderColor(pressed)
          },
        ]}
        onPress={onPress}
      >
        <Text style={[{color: textColor } , $text]}>{content}</Text>
      </Pressable>
    </SafeAreaView>
  )
})

const $container: ViewStyle = {
  flex:1,
  justifyContent: 'center',
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 16,
  //color: colors.palette.primary500,
}

const $button: ViewStyle = {
  width: 148,
  height: 56,
  alignItems: 'center',
  justifyContent: 'center',
}
