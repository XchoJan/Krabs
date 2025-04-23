import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import {FONTS} from "../theme/fonts";

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  color?: string;
  inline?: any
}

const AppButton: React.FC<AppButtonProps> = ({inline,  title, color, ...props }) => {
  return (
      <TouchableOpacity style={[styles.container, inline]} {...props}>
        <Text style={[styles.title, {color: color ? color : '#222'}]}>{title}</Text>
      </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 71,
    backgroundColor: "#E9E9E9",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8
  },
  title:{
    fontSize: 20,
    color: '#222',
    lineHeight: 24,
    fontFamily: FONTS.Manrope600,

  }
});
