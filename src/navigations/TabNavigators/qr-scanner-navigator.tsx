import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
let Stack = createStackNavigator();
import QrScannerScreen from "../../screens/AuthorizedScreens/ScannerScreen/qr-scanner-screen";
export default function QrScannerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={"QrScannerScreen"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="QrScannerScreen" component={QrScannerScreen} />
    </Stack.Navigator>
  );
}
