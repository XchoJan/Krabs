import React, {useEffect, useState} from "react";
import {FlatList, Image, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ImageSlider from "../../../components/image-slider";
import {useDispatch, useSelector} from "react-redux";
import {globalStyles} from "../../../theme/globalStyles";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {setShopItem} from "../../../store/actions/shop_item";
import AppButton from "../../../components/app-button";
import {addMerchToCard, getMerchColors} from "../../../services/API/merch";
import BackArrow from '../../../assets/svg/BackArrowSvg.svg'
import GreyBackArrow from '../../../assets/svg/GreyBackArrowSvg.svg'

const ShopDetailScreen = () => {
    const shopItem = useSelector((store: any) => store?.shop_item.shop_item);
    const tokenFromReducer = useSelector((store: any) => store?.user_token.user_token)
    const navigation = useNavigation()
    const [colors, setColors] = useState([])
    const [selectedSize, setSelectedSize] = useState<any>({})
    const [currentColor, setCurrentColor] = useState<string>('')
    const [files, setFiles] = useState<any>([])
    const [showError, setShowError] = useState(false)
    const [showSize, setShowSize] = useState(true)

    const [defaultImages, setDefaultImages] = useState([])

    console.log(shopItem.sizeAndColors[0].colors[0].color, 'SHOP ITEM')


    useEffect(() => {
        const images = [];

        if (shopItem.mainPhoto) {
            images.push(shopItem.mainPhoto);
        }

        if (Array.isArray(shopItem.photo)) {
            shopItem.photo.forEach(photo => {
                if (photo) {
                    images.push(photo);
                }
            });
        }

        setDefaultImages(images);
    }, [shopItem]);

    const handleAddMerchToCard = () => {
        if (!currentColor && shopItem.sizeAndColors.length && shopItem.sizeAndColors[0].colors[0].color !== 'один цвет') {
            setShowError(true)
            setTimeout(() => {
                setShowError(false)
            }, 2500)
            return
        }

        addMerchToCard(tokenFromReducer, shopItem.id, currentColor ? currentColor : 'один цвет', selectedSize.size).then(r => console.log(r, "ADDED"))
        navigation.goBack()
    }

    useEffect(() => {
        getMerchColors(tokenFromReducer).then((r) => {
            setColors(r)
        })
    }, []);

    useEffect(() => {
        setSelectedSize(shopItem?.sizeAndColors[0])
    }, [shopItem]);

    const renderSizes = ({item}: any) => {
        return (
            item.size !== 'один размер' ? <TouchableOpacity
                    onPress={() => {
                        setSelectedSize(item)
                    }}
                    style={[styles.sizeItem,
                        item?.size === selectedSize.size && {borderColor: '#000', backgroundColor: '#F6F6F8'}]}>
                    <Text style={{color: '#000'}}>
                        {item?.size}
                    </Text>
                </TouchableOpacity>
                :
                null
        );
    };

    useEffect(() => {
        if (shopItem?.sizeAndColors[0]?.size === 'один размер') {
            setShowSize(false)
        } else {
            setShowSize(true)
        }
    }, []);


    const renderImages = () => {
        if (files.length > 0) {
            return (
                <ImageSlider resizeMode={'contain'} images={files}/>
            )
        } else if (files.length === 0) {
            return (
                <ImageSlider resizeMode={'contain'} images={defaultImages}/>
            )
        } else {
            return (
                <Image source={require('../../../assets/images/noImage.png')}
                       style={{width: '100%', height: '100%'}}/>
            )
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.sliderBox}>
                <Pressable onPress={() => navigation.goBack()}
                           style={{position: 'absolute', top: 36, left: 16, zIndex: 1}}>
                    <GreyBackArrow/>
                </Pressable>
                {renderImages()}
            </View>
            <View style={styles.descriptionBox}>
                <View style={{flex: 1}}>
                    <ScrollView style={{paddingHorizontal: 16}}>

                        {shopItem?.sizeAndColors[0]?.colors[0]?.color !== 'один цвет' && <View>
                            <Text style={styles.title}>
                                Цвет
                            </Text>
                            <View style={{width: '100%', flexDirection: 'row'}}>
                                {selectedSize?.colors?.map((item: any) => {
                                    const colorObject: any = colors.find((color: any) => color.name === item.color);

                                    return (
                                        <TouchableOpacity
                                            key={item.color}
                                            onPress={() => {
                                                setCurrentColor(item.color)
                                                setFiles(item?.files)
                                            }}
                                            style={[
                                                styles.colorItem,
                                                {backgroundColor: colorObject?.code},
                                                item.color === currentColor && {borderColor: '#000', borderWidth: 1}
                                            ]}/>
                                    )
                                })}
                            </View>
                        </View>}

                        {showError &&
                            <Text style={{color: 'red', fontSize: 14, marginTop: 8}}>
                                Выберите цвет
                            </Text>}

                        {showSize ?
                            <Text style={styles.title}>
                                Размер
                            </Text> : null}

                        <View style={{width: '100%'}}>
                            <FlatList
                                data={shopItem.sizeAndColors}
                                renderItem={renderSizes}
                                keyExtractor={(item) => item.size}
                                horizontal={true}
                            />
                        </View>

                        {!!selectedSize && selectedSize.colors && selectedSize.colors[0]?.amount
                            ? (
                                <Text style={styles.title}>
                                    В наличии: {selectedSize.colors[0].amount} шт.
                                </Text>
                            )
                            : null
                        }

                        <Text style={[globalStyles.MobH2, {marginTop: 32}]}>{shopItem.price} B</Text>
                        <Text style={[globalStyles.MobT1, {color: '#757575', marginTop: 8}]}>
                            {shopItem.description}
                        </Text>
                    </ScrollView>
                </View>
                <View style={{marginBottom: Platform.OS === 'android' ? 0 : 10, paddingHorizontal: 16}}>
                    <AppButton
                        title={'B кoрзину'}
                        style={styles.button} color={"#fff"}
                        onPress={handleAddMerchToCard}
                    />
                </View>
            </View>
        </View>
    );
};

export default ShopDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 46 : 0
    },
    sliderBox: {
        height: 360,
    },
    descriptionBox: {
        flex: 1,
        top: -24,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        backgroundColor: '#fff'
    },
    line: {
        width: 79,
        height: 5,
        borderRadius: 16,
        backgroundColor: '#757575',
        alignSelf: 'center',
        marginTop: 12
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        height: 64,
        borderRadius: 12
    },
    sizeItem: {
        borderWidth: 1,
        borderRadius: 6,
        borderColor: 'grey',
        marginRight: 12,
        height: 24,
        width: 31,
        alignItems: 'center',
        justifyContent: 'center'
    },
    colorItem: {
        width: 35,
        height: 35,
        borderRadius: 100,
        marginRight: 8,
        borderColor: '#D9D9D9',
        borderWidth: 1
    },
    title: {marginTop: 24, fontSize: 16, color: '#757575', marginBottom: 12}
});
