import React from "react";
import { StyleSheet, View } from "react-native";

const AppWrapper = ({children,
                      withPadding = true,
                      alignCenter = true,
                      justifyCenter = true,
    marginTop
}: any) => {
  return (
    <View style={[styles.container, withPadding && {paddingHorizontal: 16}, alignCenter && {alignItems: 'center'}, justifyCenter && {justifyContent: 'center'}, {marginTop: marginTop ? marginTop : 0}]}>
      {children}
    </View>
  );
};

export default AppWrapper;

const styles = StyleSheet.create({
  container:{
    flex: 1,
    width: '100%',
  }
})
