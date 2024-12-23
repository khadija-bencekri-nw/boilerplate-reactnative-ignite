import * as React from "react"

import Icons from "assets/icons"
import type { ComponentType } from "react"
import type {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  TouchableOpacityProps,
  ViewProps,
  ViewStyle,
} from "react-native"
import { Image, TouchableOpacity, View } from "react-native"

export const iconRegistry: Record<string, ImageSourcePropType> = {
  add: Icons.add,
  apple: Icons.apple,
  arrowDown: Icons.arrowDown,
  arrowLeft: Icons.arrowLeft,
  back: Icons.back,
  bell: Icons.bell,
  calendar: Icons.calendar,
  caretLeft: Icons.caretLeft,
  caretRight: Icons.caretRight,
  check: Icons.check,
  clap: Icons.clap,
  close: Icons.close,
  code: Icons.code,
  community: Icons.community,
  components: Icons.components,
  coworker: Icons.coworker,
  dashboard: Icons.dashboard,
  debug: Icons.debug,
  github: Icons.github,
  google: Icons.google,
  grid: Icons.grid,
  heart: Icons.heart,
  hidden: Icons.hidden,
  info: Icons.info,
  inspo: Icons.inspo,
  ladybug: Icons.ladybug,
  list: Icons.list,
  lock: Icons.lock,
  menu: Icons.menu,
  more: Icons.more,
  nw: Icons.nw,
  nwDark: Icons.nwDark,
  pin: Icons.pin,
  podcast: Icons.podcast,
  settings: Icons.settings,
  slack: Icons.slack,
  tl: Icons.tl,
  user: Icons.user,
  userFilled: Icons.userFilled,
  view: Icons.view,
  closeX: Icons.x,
}

const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}

export type IconTypes = keyof typeof iconRegistry

interface IconProps extends TouchableOpacityProps {
  /**
   * The name of the icon
   */
  icon: IconTypes

  /**
   * An optional tint color for the icon
   */
  color?: string

  /**
   * An optional size for the icon. If not provided, the icon will be sized to the icon's resolution.
   */
  size?: number

  /**
   * Style overrides for the icon image
   */
  style?: StyleProp<ImageStyle>

  /**
   * Style overrides for the icon container
   */
  containerStyle?: StyleProp<ViewStyle>

  /**
   * An optional function to be called when the icon is pressed
   */
  onPress?: TouchableOpacityProps["onPress"]
}

const isView = (event: TouchableOpacityProps["onPress"]) => {
  if (event !== undefined) {
    return TouchableOpacity
  }
  return View
}
/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Icon/}
 * @param {IconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function Icon(props: IconProps) {
  const {
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = Boolean(WrapperProps.onPress)
  const Wrapper = isView(WrapperProps.onPress) as ComponentType<TouchableOpacityProps | ViewProps>

  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    color !== undefined && { tintColor: color },
    size !== undefined && { width: size, height: size },
    $imageStyleOverride,
  ]

  return (
    <Wrapper
      accessibilityRole={isPressable ? "imagebutton" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      <Image style={$imageStyle} source={iconRegistry[icon]} />
    </Wrapper>
  )
}
