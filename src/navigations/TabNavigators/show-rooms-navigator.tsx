import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
let Stack = createStackNavigator();
import ShowRoomsScreen from "../../screens/AuthorizedScreens/ShowRoomsScreen/show-rooms-screen";
export default function ShowRoomsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={"PersonalArea"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ShowRoomsScreen" component={ShowRoomsScreen} />
    </Stack.Navigator>
  );
}
