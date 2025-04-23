import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { Dimensions, Image } from "react-native";


const ImageSlider = ({images, disable, resizeMode, height}: any) => {
  const windowWidth = Dimensions.get('window').width;
  return (
   <SliderBox
     // disableOnPress={true}
      sliderBoxHeight={height ? height : 360}
      images={images}
      dotColor="#fff"
      dotStyle={{
        width: windowWidth / images?.length + 16,
        height: 2,
        borderRadius: 5,
        marginHorizontal: -16,
        backgroundColor: "rgba(128, 128, 128, 0.92)",
        marginBottom: 24
      }}
      resizeMode={resizeMode ? resizeMode : 'cover'}
      ImageComponentStyle={{width: '100%'}}

    />
  );
};

export default ImageSlider;
