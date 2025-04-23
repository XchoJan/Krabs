import React, { useState } from "react";
import { StyleSheet, Text, Platform, TextInput, View } from "react-native";
import { FONTS } from "../theme/fonts";

const LabelInput = ({ title, large, props, placeholder, multiline, value, onChangeText, error, largeError, inputStyle, inline }: any) => {
  return (
    !large ?
      <View style={[styles.container]}>
        <Text style={[styles.title, error && {color: 'red'}]}>{title}</Text>
        <View style={[styles.inputBox, inline, error && styles.errorInputBox]}>
          <TextInput
            placeholder={placeholder}
            style={[styles.input, inputStyle]}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={'grey'}
          />
        </View>
      </View>
      :
      <View style={styles.container}>
        <Text style={[styles.title, largeError && {color: 'red'}]}>{title}</Text>
        <View style={[styles.largeInputBox, largeError && styles.largeErrorInputBox]}>
          <TextInput
            placeholder={placeholder}
            style={[styles.input]}
            multiline={multiline}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor={'grey'}
          />
        </View>
      </View>
  );
};

export default LabelInput;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 28,
  },
  title: {
    fontFamily: FONTS.Manrope500,
    fontSize: 16,
    lineHeight: 16,
    color: "#BEBEBE",
    
  },
  inputBox: {
    width: "100%",
    height: 56,
    borderWidth: 1,
    borderColor: "#AEAEAE",
    borderRadius: 8,
    marginTop: 12,
  },
  input: {
    width: "100%",
    fontSize: 18,
    fontFamily: FONTS.Manrope500,
    lineHeight: 24,
    paddingHorizontal: 16,
    color: '#000',
    alignItems: 'center',
    top: Platform.OS === 'ios' ? 14 : 0
  },
  largeInputBox: {
    width: "100%",
    maxHeight: 157,
    borderWidth: 1,
    borderColor: "#AEAEAE",
    borderRadius: 8,
    marginTop: 12,
    height: 56
  },
  largeErrorInputBox: {
    width: "100%",
    maxHeight: 157,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    marginTop: 12,
  },
  largeInput: {
    width: "100%",
  },
    errorInputBox: {
      width: "100%",
      height: 56,
      borderWidth: 1,
      borderColor: "red",
      borderRadius: 8,
      marginTop: 12,
    },
});
