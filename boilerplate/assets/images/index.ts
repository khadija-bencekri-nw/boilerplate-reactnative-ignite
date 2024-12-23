import airpodsImg from "./airpods.png"
import backgroundImageImg from "./backgroundImage.png"
import backgroundLoginImg from "./backgroundLogin.png"
import logoImg from "./logo.png"
import signBackgroundImageImg from "./signup-background-img.jpeg"
import userFilledImg from "../icons/userFilled.png"
import type { ImageSourcePropType } from "react-native"

const airpods = airpodsImg as unknown as ImageSourcePropType
const backgroundImage = backgroundImageImg as unknown as ImageSourcePropType
const backgroundLogin = backgroundLoginImg as unknown as ImageSourcePropType
const logo = logoImg as unknown as ImageSourcePropType
const signBackgroundImage = signBackgroundImageImg as unknown as ImageSourcePropType
const userFilled = userFilledImg as unknown as ImageSourcePropType

const Images = {
  airpods,
  backgroundImage,
  backgroundLogin,
  logo,
  signBackgroundImage,
  userFilled,
}

export default Images
