import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";
const CELL_COUNT = 4;

const PinCodeInputs = ({value, setValue}: any) => {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  return (
    <CodeField
      ref={ref}
      {...props}
      value={value}
      onChangeText={setValue}
      cellCount={CELL_COUNT}
      rootStyle={styles.codeFieldRoot}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={[styles.cell, isFocused && styles.focusCell]}
          onLayout={getCellOnLayoutHandler(index)}>
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
};

export default PinCodeInputs;


const styles = StyleSheet.create({
  codeFieldRoot: {
    marginTop: 20,
  },
  cell: {
    width: '22%',
    height: 55,
    lineHeight: 38,
    fontSize: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#969697",
    textAlign: "center",
    color: "#fff",
  },
  focusCell: {
    borderColor: "green",
  },

});
