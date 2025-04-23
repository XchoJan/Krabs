import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ImageBackground,
    TouchableOpacity,
    Pressable,
    ScrollView,
    Platform, Linking,
} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {globalStyles} from "../../../theme/globalStyles";
import {FONTS} from "../../../theme/fonts";
import BackArrow from "../../../assets/svg/BackArrowSvg.svg";
import {useNavigation} from "@react-navigation/native";
import {setActiveImage} from "../../../store/actions/acitve_image";
//@ts-ignore
import {SliderBox} from "react-native-image-slider-box";



const NewsDetailScreen = () => {
    const newsItem = useSelector((store: any) => store.news_item.news_item);
    const dispatch = useDispatch();
    const [images, setImages] = useState([]);
    const [originalImages, setOriginalImages] = useState<any>([]);
    const [activeImageState, setActiveImageState] = useState<any>(false);
    const navigation = useNavigation();
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        if (newsItem?.photo?.length > 0) {
            setImages(newsItem?.photo);
            setOriginalImages([...newsItem?.photo]);
        }
    }, [newsItem]);

    const rearrangeImages = (index: any) => {
        const rearrangedImages = [
            ...images.slice(index),
            ...images.slice(0, index),
        ];
        setImages(rearrangedImages);
    };

    const resetImages = () => {
        dispatch(setActiveImage(false));
        setActiveImageState(false);
        setImages(originalImages);
    };

    const handleLinkPress = (url: string) => {
        Linking.openURL(url);
    };


    const renderTextWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        const parts = text.split(urlRegex);

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleLinkPress(part)}
                    >
                        <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 16 }}>
                            {part}
                        </Text>
                    </TouchableOpacity>
                );
            } else {
                return (
                    <Text key={index}>
                        {part}
                    </Text>
                );
            }
        });
    };


    const downloadFile = async (uri:string)=>{
      await Linking.openURL(uri)
    }


    const getFileNameWithoutNumbers = (url: string): string => {
        const fileNameWithExtension = getFileName(url);
        return fileNameWithExtension.replace(/\d+-/g, '');
    }

    const getFileName = (url: string): string => {
        const parts = url.split('/');
        return parts[parts.length - 1];
    }

    return (
        <View style={styles.container}>
            <View style={styles.backgroundImageContainer}>
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        backgroundColor: "#000",
                        zIndex: 1,
                        opacity: 0.4,
                    }}
                />
                {newsItem?.mainPhoto ? (
                    <ImageBackground
                        style={styles.backgroundImage}
                        source={{uri: newsItem?.mainPhoto}}
                    />
                ) : (
                    <ImageBackground
                        style={styles.backgroundImage}
                        source={require("../../../assets/images/noImage.png")}
                    />
                )}
                <Text style={styles.title}>{newsItem?.title.toUpperCase()}</Text>
                <Text style={styles.description}>{newsItem?.subtitle}</Text>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={{marginLeft: 16, top: -15, zIndex: 2}}
                >
                    <BackArrow/>
                </Pressable>
            </View>

            <View style={styles.bottomContainer}>
                <ScrollView style={{marginBottom: 80}}>
                    <Text style={[globalStyles.MobT3, {color: "#000"}]}>
                        {renderTextWithLinks(newsItem.text)}
                    </Text>
                    <View style={{marginBottom: 14}}/>
                    {newsItem?.files?.length && newsItem?.files?.map((item: string, index: number)=>(
                        <TouchableOpacity onPress={()=>{downloadFile(item)}}>
                            <Text style={{fontSize: 16, color: '#1d3fc4'}}>{getFileNameWithoutNumbers(item)}</Text>
                        </TouchableOpacity>
                    ))

                    }
                    <View style={{height: 156, width: "100%", marginTop: 24}}>
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {images.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={{marginRight: 16}}
                                    onPress={() => {
                                        rearrangeImages(images.indexOf(item));
                                        setActiveImageState(item);
                                        dispatch(setActiveImage(true));
                                    }}
                                >
                                    <Image style={styles.image} source={{uri: item}}/>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>
            </View>
            {activeImageState && (
                <View style={styles.activeImageContainer}>
                    <Pressable
                        onPress={resetImages}
                        style={{width: "100%", height: "20%", zIndex: 99999}}
                    />
                    <View style={{height: "60%", width: "100%", alignItems: 'center'}}>
                        <SliderBox
                            images={images}
                            sliderBoxHeight={"100%"}
                            dotStyle={{width: 0, height: 0}}
                            ImageComponentStyle={{width: '93%', borderRadius: 16}}
                        />
                    </View>
                    <Pressable
                        onPress={resetImages}
                        style={{width: "100%", height: "20%", zIndex: 99999}}
                    />
                </View>
            )}
            {showSuccess &&
            <View style={styles.popUp}>
                <Text style={{width: '100%', textAlign: 'center', fontSize: 16, color: '#000'}}>
                    Файл сохранен в загрузки
                </Text>
            </View>
                }

        </View>
    );
};

export default NewsDetailScreen;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        backgroundColor: "#fff",
    },
    backgroundImageContainer: {
        width: "100%",
        height: Platform.OS === "android" ? "78%" : "74%",
        position: "relative",
    },
    backgroundImage: {
        width: "100%",
        height: 420,
        position: "absolute",
        left: 0,
        top: 0,
    },
    title: {
        fontSize: 28,
        color: "#F6F6F8",
        top: "30%",
        marginLeft: 16,
        fontFamily: FONTS.Manrope600,
        lineHeight: 33,
        zIndex: 2,
    },
    description: {
        fontSize: 20,
        color: "#F6F6F8",
        top: "31%",
        marginLeft: 16,
        lineHeight: 24,
        zIndex: 2,
        fontFamily: FONTS.Roboto400,
    },
    bottomContainer: {
        width: "100%",
        height: 400,
        backgroundColor: "#fff",
        top: Platform.OS === 'android' ? -190 : -220,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 33,
        zIndex: 3,
    },
    image: {
        width: 175,
        height: 155,
        borderRadius: 8,
    },
    activeImageContainer: {
        position: "absolute",
        backgroundColor: "#000000",
        width: "100%",
        height: "100%",
        opacity: 0.9,
        zIndex: 5,
        paddingHorizontal: 16,
    },
    activeImage: {
        width: "100%",
        height: 326,
        position: "absolute",
        borderRadius: 8,
        zIndex: 1,
    },
    popUp:{
        marginHorizontal: 16,
        position: 'absolute',
        height: 42,
        top: '90%',
        zIndex: 999999,
        backgroundColor: 'grey',
        width: '90%',
        left: 0,
        alignSelf: 'center',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
