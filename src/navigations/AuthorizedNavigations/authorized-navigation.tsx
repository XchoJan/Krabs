import React, { useEffect } from "react";

let Tab = createBottomTabNavigator();
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import NewsScreensNavigator from "../TabNavigators/news-screens-navigator";
import PersonalAreaNavigator from "../TabNavigators/personal-area-navigator";
import ShowRoomsNavigator from "../TabNavigators/show-rooms-navigator";
import QrScannerNavigator from "../TabNavigators/qr-scanner-navigator";
import ShopScreenNavigator from "../TabNavigators/shop-screens-navigator";

import ActiveHumanIcon from "../../assets/svg/ActiveHuman.svg";
import HumanIcon from "../../assets/svg/HumanIcon.svg";
import ActiveNewsIcon from "../../assets/svg/ActiveNewsIcon.svg";
import NewsIcon1 from "../../assets/svg/NewsIcon1.svg";
import QrScannerIcon from "../../assets/svg/QrScannerIcon.svg";
import QrScannerActiveIcon from "../../assets/svg/QrScannerActiveIcon.svg";
import ShopIcon from "../../assets/svg/ShopIcon.svg";
import ShopActiveIcon from "../../assets/svg/ShopActiveIcon.svg";
import ActiveShowRoomsIcon from "../../assets/svg/ActiveShowRoomsIcon.svg";
import NewShowRoomsIcon from '../../assets/svg/NewShowRoomsIcon.svg'
import ActiveNewShowRoomsIcon from '../../assets/svg/NewShowRoomsActiveIcon.svg'

import { useSelector } from "react-redux";
import {Platform} from "react-native";

import AppMetrica from '@gennadysx/react-native-appmetrica';


AppMetrica.activate({
    apiKey: '00de5d32-4e53-42c6-9506-2be308e9bdd7',
    sessionTimeout: 120,
    firstActivationAsUpdate: false,
});



AppMetrica.reportEvent('Запуск приложении');

export default function AuthorizedNavigation() {
  const showTabBar = useSelector((store: any) => store.show_tab_bar.show_tab_bar);
  const activeImage = useSelector((store: any) => store.active_image.active_image)
  const firstAuth = useSelector((store: any) => store?.first_auth?.first_auth);

    return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#222222",
          alignItems: "center",
          justifyContent: "center",
          height: Platform.OS ===  'ios' ? 84 : 64,
          borderTopLeftRadius: activeImage ? 0 : 8,
          borderTopRightRadius: activeImage ? 0 : 8,
          paddingTop: Platform.OS === 'ios' ? 27 : 18,
          display: !showTabBar ? 'none' : "flex"
        },
      }}
      initialRouteName={firstAuth ? "PersonalAreaNavigator" : "News"}
    >
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            focused ? <ActiveNewShowRoomsIcon/> : <NewShowRoomsIcon/>
          ),
        }}
        name="ShowRoomsNavigator" component={ShowRoomsNavigator}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            focused ? <ActiveNewsIcon /> : <NewsIcon1 />
          ),
        }}
        name="News" component={NewsScreensNavigator}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({focused}) => (
            focused ? <QrScannerActiveIcon/> : <QrScannerIcon />
          ),
        }}
        name="QrScannerNavigator" component={QrScannerNavigator}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            focused ? <ShopActiveIcon /> : <ShopIcon />
          ),
        }}
        name="ShopScreenNavigator" component={ShopScreenNavigator}
      />
      <Tab.Screen
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ focused }) => (
            focused ? <ActiveHumanIcon /> : <HumanIcon />
          ),
        }}
        name="PersonalAreaNavigator" component={PersonalAreaNavigator}
      />
    </Tab.Navigator>
  );
}
