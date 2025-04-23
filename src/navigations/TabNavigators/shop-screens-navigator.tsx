import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
let Stack = createStackNavigator();
import ShopScreenHomePage from "../../screens/AuthorizedScreens/ShopScreens/shop-screen-home-page";
import ShopDetailScreen from "../../screens/AuthorizedScreens/ShopScreens/shop-detail-screen";
export default function QrScannerNavigator() {
  return (
    <Stack.Navigator
      initialRouteName={"ShopScreenHomePage"}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ShopScreenHomePage" component={ShopScreenHomePage} />
      <Stack.Screen name="ShopDetailScreen" component={ShopDetailScreen} />
    </Stack.Navigator>
  );
}
