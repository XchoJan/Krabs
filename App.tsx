import React from "react";
import {
  StyleSheet, View, Platform, StatusBar,
} from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/store";
import RootNavigations from "./src/navigations";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";


const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        {Platform.OS === "android" ? <View style={{ flex: 1, paddingTop: 0 }}>
            <StatusBar backgroundColor="transparent" translucent={true} barStyle={"dark-content"} />
            <RootNavigations />
          </View>
          :
          <SafeAreaView style={{ flex: 1, paddingTop: 0 }}>
            <RootNavigations />
          </SafeAreaView>
        }
      </Provider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;

