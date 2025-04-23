import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import { globalStyles, SCREEN_WIDTH } from "../theme/globalStyles";

const ShopItem = ({ item, onPress }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.sliderBox}>
        {
          // item?.photo ?
          //   <SliderBox
          //       imageLoadingColor={"aqua"}
          //       images={item?.photo}
          //       activeOpacity={1}
          //       dotColor="#fff"
          //       dotStyle={{
          //         width: 38,
          //         height: 2,
          //         borderRadius: 5,
          //         backgroundColor: "rgba(128, 128, 128, 0.92)",
          //       }}
          //       parentWidth={SCREEN_WIDTH / 2 - 28}
          //       ImageComponentStyle={{
          //         width: "100%",
          //       }}
          //       resizeMode={"contain"}
          //       onCurrentImagePressed={onPress}
          //   /> :
            item?.mainPhoto ?
                <Pressable style={{ width: "100%", height: 130, top: 22 }} onPress={onPress}>
                  <Image style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                         source={{uri: item.mainPhoto}} />
                </Pressable>
                :
                <Pressable style={{ width: "100%", height: 130, top: 22}} onPress={onPress}>
                  <Image style={{ width: "100%", height: '100%', resizeMode: "contain" }}
                         source={require("../assets/images/noImage.png")} />
                </Pressable>
        }

      </View>
      <View>
        <Text style={[globalStyles.MobT3, { marginBottom: 4 }]}>
          {item.name}
        </Text>
        <Text style={globalStyles.MobT1}>
          {item.price} B
        </Text>
      </View>
    </View>
  );
};

export default ShopItem;

const styles = StyleSheet.create({
  container: {
    flex: 1, // Уберите ширину и marginBottom
    marginRight: 16,
    maxWidth: "50%",
    marginBottom: 16,

  },
  sliderBox: {
    height: 156,
    width: "100%",
    marginBottom: 4,
  },
});
