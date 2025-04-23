import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

let Stack = createStackNavigator();

import WelcomeScreen from "../../screens/UnauthorizedScreens/WelcomeScreen/welcome-screen";
import EnterPinScreen from "../../screens/UnauthorizedScreens/EnterPinScreen/enter-pin-screen";
import { NavigationContainer } from "@react-navigation/native";

export default function UnauthorizedNavigation() {
  return (
    <Stack.Navigator
      initialRouteName={"AddNumberScreen"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AddNumberScreen" component={WelcomeScreen} />
      <Stack.Screen name="EnterPinScreen" component={EnterPinScreen} />
    </Stack.Navigator>
  );
}
