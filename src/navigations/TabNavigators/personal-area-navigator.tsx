import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
let Stack = createStackNavigator();
import PersonalAreaScreen from "../../screens/AuthorizedScreens/PersonalAreaScreen/personal-area-screen";
export default function PersonalAreaNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={"PersonalArea"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="PersonalAreaScreen" component={PersonalAreaScreen} />
    </Stack.Navigator>
  );
}
