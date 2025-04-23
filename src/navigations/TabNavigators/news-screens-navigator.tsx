import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

let Stack = createStackNavigator();

import NewsScreen from "../../screens/AuthorizedScreens/NewsScreen/news-screen";
import newsDetailScreen from "../../screens/AuthorizedScreens/NewsScreen/news-detail-screen";
export default function NewsScreensNavigator({navigation}: any) {
  return (
    <Stack.Navigator
      initialRouteName={"NewsScreen"}
      screenOptions={{
        headerShown: false,
        animationEnabled: true
      }}
    >
        <Stack.Screen name="NewsScreen">
            {/*@ts-ignore*/}
            {(props) => <NewsScreen {...props} navigation={navigation} />}
        </Stack.Screen>
      <Stack.Screen name="newsDetailScreen" component={newsDetailScreen} />
    </Stack.Navigator>
  );
}
