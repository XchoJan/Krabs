import {StyleSheet, Dimensions} from "react-native";
import {FONTS} from "../theme/fonts";
export const SCREEN_HEIGHT = Dimensions.get("screen").height
export const SCREEN_WIDTH = Dimensions.get("screen").width
export const globalStyles = StyleSheet.create({
  MobT1:{
    fontSize: 20,
    color: '#222',
    lineHeight: 24,
    fontFamily: FONTS.Roboto400
  },
  MobT2:{
    fontSize: 18,
    color: '#222222',
    fontFamily: FONTS.Roboto600,
    lineHeight: 21,
  },

  MobT3:{
    fontSize: 16,
    color: '#AEAEAE',
    fontFamily: FONTS.Roboto600,
    lineHeight: 19
  },
  MobH1:{
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 36,
    fontFamily: FONTS.Manrope600,
  },
  MobH2:{
    fontFamily: FONTS.Manrope600,
    fontSize: 28,
    color: '#000',
    lineHeight: 33
  },
  MobH3:{
    fontFamily: FONTS.Manrope400,
    fontSize: 22,
    color: '#000',
    lineHeight: 33
  },

})
