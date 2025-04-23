import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Pressable, RefreshControl
} from "react-native";
import {globalStyles} from "../../../theme/globalStyles";
import BaskedIcon from "../../../assets/svg/BaskedIcon.svg";
import SubscribeIcon from "../../../assets/svg/SubscribeIcon.svg";
import {useDispatch, useSelector} from "react-redux";
import CustumBottomSheet from "../../../components/custum-bottom-sheet";
import {getBonusesHistory} from "../../../services/API/api-scanner";
import BalanceHistoryItem from "../../../components/balance-history-item";
import moment from "moment";
import {FONTS} from "../../../theme/fonts";
import ShopItem from "../../../components/shop-item";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {setShopItem} from "../../../store/actions/shop_item";
import {
    getMerch,
    getMerchCategory,
    getMerchCartItems,
    addMerchToCard,
    deleteMerchToCard, createOrder, getMyOrders
} from "../../../services/API/merch";
import CartItem from "../../../components/cart-item";
import AppButton from "../../../components/app-button";
import {getUserData} from "../../../services/API/get_user_data";
import {setUserData} from "../../../store/actions/user_data";
import {getNewsList} from "../../../services/API/api-news";
import AppMetrica from "@gennadysx/react-native-appmetrica";
import LabelInput from "../../../components/label-input";
import PickupPointsModal from "../../../components/pickup_points_modal";
import HistoryItems from "../../../components/history-item";

interface FilterData {
    id: string;
    name: string;
}

const ShopScreenHomePage = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation<any>();
    const userDataFromReducer = useSelector((store: any) => store.user_data.user_data);
    const tokenFromReducer = useSelector((store: any) => store.user_token.user_token);

    const [sheetIndex, setSheetIndex] = useState(-1);
    const [merchHistorySheetIndex, setMerchHistorySheetIndex] = useState(-1);
    const [baskedSheetIndex, setBaskedSheetIndex] = useState(-1);
    const [deliveryIndex, setDeliveryIndex] = useState(-1)
    const [bonusHistory, setBonusHistory] = useState([]);

    const [filterItems, setFilterItems] = useState<FilterData[]>([]);
    const [selectedFilterItem, setSelectedFilterItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [merchCart, setMerchCart] = useState([])
    const [totalPrice, setTotalPrice] = useState('')

    const [selectedFilterItemFromResponse, setSelectedFilterItemFromResponse] = useState(undefined)

    const [refreshing, setRefreshing] = React.useState(false);

    const [name, setName] = useState('')

    const [phoneNumber, setPhoneNumber] = useState('')

    const [selectedPickup, setSelectedPickup] = useState<any>({})

    const [isVisiblePickup, setIsVisiblePickup] = useState<boolean>(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [priceError, setPriceError] = useState(false)
    let isFocused = useIsFocused()

    const handleSetSelectPickup = (item: any) => {
        setSelectedPickup(item)
        setIsVisiblePickup(false)
    }

    useEffect(() => {
        if (isFocused) {
            getMerchCartItems(tokenFromReducer).then(r => {
                setTotalPrice(r?.totalPrice)
            })
        }
    }, [isFocused]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getMerchCartItems(tokenFromReducer).then(r => {
                setTotalPrice(r?.totalPrice)
            })
            setRefreshing(false);
        }, 2000);
    }, []);


    useEffect(() => {
        getMerchCartItems(tokenFromReducer).then(r => {
            setTotalPrice(r?.totalPrice)
        })
    }, [merchCart]);

    useEffect(() => {
        let showedProducts: any = []
        getUserData(tokenFromReducer).then((r) => {
            dispatch(setUserData(r));
        });

        getMerch(tokenFromReducer, selectedFilterItem).then((r) => {
            r.items.map((item: any) => {
                if (!item.isHide) {
                    showedProducts.push(item)
                }
            })
            setProducts(showedProducts)
        });
        getMerchCategory(tokenFromReducer).then((r) => {
            const modifiedItems = [{id: 1, name: 'Все товары'}, ...r?.items];
            setFilterItems(modifiedItems);
        });
        getMerchCartItems(tokenFromReducer).then(r => {
            setMerchCart(r?.items)
        })
        setTimeout(() => {
            setLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        let showedProducts: any = []

        if (selectedFilterItem === 'Все товары') {
            setSelectedFilterItemFromResponse(undefined)
        } else {
            setSelectedFilterItemFromResponse(selectedFilterItem)
        }
        getMerch(tokenFromReducer, selectedFilterItemFromResponse).then((r) => {
            r.items.map((item: any) => {
                if (!item.isHide) {
                    showedProducts.push(item)
                }
            })
            setProducts(showedProducts)
        });
    }, [selectedFilterItem, selectedFilterItemFromResponse]);


    useEffect(() => {
        getBonusesHistory(tokenFromReducer).then((r) => {
            setBonusHistory(r?.items);
        });
    }, []);

    const updateParentBottomSheetIndex = () => {
        setSheetIndex(-1);
    };

    const updateParentBaskedBottomSheetIndex = () => {
        setBaskedSheetIndex(-1);
    };

    const updateParentMerchHistoryBottomSheetIndex = () => {
        setMerchHistorySheetIndex(-1);
    };

    const updateParentDeliveryBottomSheetIndex = () => {
        setDeliveryIndex(-1);
    };

    const renderHistoryItem = ({item}: any) => {
        return (
            <BalanceHistoryItem
                title={item?.productName}
                data={moment(item?.createdAt).format("DD.MM.YYYY")}
                balance={item?.bonus}
            />
        );
    };

    const renderItem = ({item}: any) => {
        return (
            <ShopItem onPress={() => {
                dispatch(setShopItem(item));
                navigation.navigate("ShopDetailScreen");
            }} key={item.id} item={item}/>
        );
    };

    useEffect(() => {
        // Отправка события при открытии шопа
        AppMetrica.reportEvent('Входы в магазин');
    }, []);


    const renderFilterItems = ({item}: any) => {
        const isSelected = selectedFilterItem === item.name;
        const itemStyle = isSelected ? styles.activeTabText : styles.tab;

        return (
            <TouchableOpacity
                onPress={() => {
                    setSelectedFilterItem((prevSelectedItem: any) => {
                        return item.name === 'Все товары' || prevSelectedItem !== item.name
                            ? item.name
                            : undefined;
                    });
                }}
                style={itemStyle}
            >
                <Text style={itemStyle}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };


    const renderBaskedItems = ({item}: any) => {

        return (
            <CartItem
                onPressPlus={() => {
                    addMerchToCard(tokenFromReducer, item.merchId, item.color, item.size).then((r) => {
                        console.log(r, 'ADD MERCH TO CARD R')
                        if (r) {
                            getMerchCartItems(tokenFromReducer).then(r => {
                                setMerchCart(r?.items)
                            })
                        }
                    })
                }}
                onPressMinus={() => {
                    deleteMerchToCard(tokenFromReducer, item.merchId, item.color, item.size, false).then((r) => {
                        if (r) {
                            getMerchCartItems(tokenFromReducer).then(r => {
                                setMerchCart(r?.items)
                            })
                        }
                    })

                }}
                onPressDelete={() => {
                    deleteMerchToCard(tokenFromReducer, item.merchId, item.color, item.size, true).then((r) => {
                        if (r) {
                            getMerchCartItems(tokenFromReducer).then(r => {
                                setMerchCart(r?.items)
                            })
                        }
                    })

                }}
                item={item}
            />
        )
    }

    let [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        merchCart?.forEach((item: any) => {
            setTotalItems(totalItems += item.quantity);
        });
    }, [merchCart]);

    const handleCreateOrder = async () => {
        if (selectedPickup?.location && phoneNumber && name) {

            const data = {
                to_location: selectedPickup.location,
                "recipient": {
                    "name": name,
                    "phones": [
                        {
                            "number": phoneNumber
                        }
                    ]
                }
            }
            // console.log('Отправляемые данные:', JSON.stringify(data, null, 2));
            createOrder(tokenFromReducer, data).then(r => {
                // console.log(r, 'create order response ')
                if (r.id) {
                    setSuccess(true)
                    setName('')
                    setPhoneNumber('')
                    getMerchCartItems(tokenFromReducer).then(r => {
                        setMerchCart(r?.items)
                    })

                    setTimeout(() => {
                        setSuccess(false)
                    }, 3000)
                }
            })
        } else {
            console.log(222222)
            setError(true)
            setTimeout(() => {
                setError(false)
            }, 2800)
        }
    }


    return (
        !loading ? <View style={styles.container}>
                <View style={[styles.wrapper]}>
                    <View>
                        <View style={styles.header}>
                            <Text style={globalStyles.MobH3}>
                                Магазин
                            </Text>
                            <View style={{position: 'relative'}}>

                                {!!merchCart?.length &&
                                    <View style={styles.count}>

                                        <Text style={styles.countText}>
                                            {merchCart?.reduce((total, item: any) => total + item.quantity, 0)}
                                        </Text>
                                    </View>

                                }
                                <TouchableOpacity onPress={() => {
                                    getMerchCartItems(tokenFromReducer).then(r => {
                                        setMerchCart(r?.items)
                                    })
                                    setBaskedSheetIndex(0);
                                }} style={styles.baskedBox}>
                                    <BaskedIcon/>
                                </TouchableOpacity>
                            </View>

                        </View>
                        <ScrollView refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                        }>
                            <View style={styles.padding16}>
                                <Pressable onPress={() => {
                                    setSheetIndex(0);
                                }} style={styles.balance_box}>
                                    <View style={{width: "100%"}}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                width: "100%",
                                                marginBottom: 8,
                                            }}>
                                            <Text style={globalStyles.MobT2}>
                                                Текущий баланс
                                            </Text>
                                            <View>
                                                <SubscribeIcon/>
                                            </View>
                                        </View>
                                        <Text style={[globalStyles.MobH1, {color: "#222222"}]}>
                                            {userDataFromReducer?.balance} B
                                        </Text>
                                    </View>
                                </Pressable>
                                <Pressable onPress={() => {
                                    setMerchHistorySheetIndex(0);
                                }} style={styles.merchHistory}>
                                    <Text style={globalStyles.MobT2}>История покупок мерча</Text>
                                    <View>
                                        <SubscribeIcon/>
                                    </View>
                                </Pressable>
                            </View>

                            <View style={styles.navbar}>
                                {filterItems?.length &&
                                    <FlatList
                                        data={filterItems}
                                        renderItem={renderFilterItems}
                                        horizontal={true}
                                        scrollEnabled={true}
                                        keyExtractor={item => item.id}
                                        showsHorizontalScrollIndicator={false}
                                        style={{paddingBottom: 2}}
                                    />}
                            </View>
                            <View style={styles.flatContainer}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    data={products}
                                    renderItem={renderItem}
                                    contentContainerStyle={styles.flatContentContainer}
                                    numColumns={2}
                                    scrollEnabled={false}
                                    keyExtractor={(item: any) => item.id}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </View>


                <CustumBottomSheet
                    onClose={updateParentBottomSheetIndex}
                    parentBottomSheetIndex={sheetIndex}
                    headerText={"ИСТОРИЯ НАЧИСЛЕНИЙ БАЛЛОВ"}
                >
                    <FlatList
                        contentContainerStyle={{marginTop: 54, flex: 1}}
                        data={bonusHistory}
                        renderItem={renderHistoryItem}
                        scrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                    />
                </CustumBottomSheet>
                <CustumBottomSheet
                    onClose={updateParentMerchHistoryBottomSheetIndex}
                    parentBottomSheetIndex={merchHistorySheetIndex}
                    headerText={"История покупок мерча"}
                >
                    {/*данные мерча*/}
                    {/*<FlatList*/}
                    {/*  contentContainerStyle={{ marginTop: 54, flex: 1 }}*/}
                    {/*  data={bonusHistory}*/}
                    {/*  renderItem={renderHistoryItem}*/}
                    {/*  scrollEnabled={true}*/}
                    {/*  showsVerticalScrollIndicator={true}*/}
                    {/*/>*/}
                    <HistoryItems refreshData={merchHistorySheetIndex === 0}/>
                </CustumBottomSheet>

                <CustumBottomSheet
                    onClose={updateParentBaskedBottomSheetIndex}
                    parentBottomSheetIndex={baskedSheetIndex}
                    headerText={"КОРЗИНА"}
                    balance={userDataFromReducer?.balance}
                >
                    {!merchCart?.length ?
                        <Text>Здесь пока пусто!</Text> :
                        <View style={{height: '100%'}}>
                            <View style={{height: '100%', marginTop: 32,}}>
                                <FlatList
                                    scrollEnabled={false}
                                    data={merchCart}
                                    renderItem={renderBaskedItems}
                                    ListFooterComponent={<View style={styles.bottomBaskedContent}>
                                        <Text style={[globalStyles.MobT3, {marginBottom: 8}]}>
                                            Итого
                                        </Text>
                                        <Text style={[globalStyles.MobH1, {color: '#000'}]}>
                                            {totalPrice} B
                                        </Text>
                                        {priceError &&
                                            <Text style={{color: 'red', fontSize: 18}}>
                                                Недостаточно баллов
                                            </Text>}

                                        <AppButton
                                            color={'#fff'}
                                            title={'К оформлению'} style={styles.button}
                                            onPress={() => {
                                                if (totalPrice > userDataFromReducer?.balance) {
                                                    setPriceError(true)
                                                    setTimeout(() => {
                                                        setPriceError(false)
                                                    }, 3000)
                                                } else {
                                                    setBaskedSheetIndex(-1)
                                                    setTimeout(() => {
                                                        setDeliveryIndex(0)
                                                    }, 500)
                                                }
                                            }}
                                        />
                                    </View>}
                                />

                            </View>
                        </View>
                    }

                </CustumBottomSheet>


                <CustumBottomSheet
                    onClose={updateParentDeliveryBottomSheetIndex}
                    parentBottomSheetIndex={deliveryIndex}
                    headerText={"Доставка"}
                >
                    <Text style={[styles.subtitle, {marginBottom: 14}]}>
                        Выберите из сохраненных данных
                    </Text>

                    <Pressable onPress={() => setIsVisiblePickup(true)} style={styles.pickup_point_btn}>
                        {selectedPickup &&
                            <View style={{marginBottom: 24}}>
                                <Text style={{fontSize: 17, color: '#000', fontFamily: FONTS.Manrope600}}>
                                    Способ получения
                                </Text>
                                <Text style={{color: '#AEAEAE'}}>
                                    {selectedPickup?.location?.address_full}
                                </Text>
                            </View>
                        }
                        <Text style={{fontSize: 17, color: '#000', fontFamily: FONTS.Manrope600}}>
                            {selectedPickup?.location ? "Изменить пункт выдачи" : 'Добавить пункт выдачи'}
                        </Text>
                    </Pressable>

                    <LabelInput
                        inline={{marginTop: -16}}
                        placeholder={'ФИО контактного лица'}
                        value={name}
                        onChangeText={setName}
                    />

                    <LabelInput
                        inline={{marginTop: -16}}
                        placeholder={'Номер телефона'}
                        value={phoneNumber}
                        onChangeText={(text: any) => {
                            const formattedText = '+7' + text.replace(/[^0-9]/g, '').replace(/^7/, '');
                            setPhoneNumber(formattedText);
                        }}
                    />

                    <AppButton
                        title={'Оплатить'}
                        color={'#fff'}
                        style={[styles.button, {marginBottom: 14}]}
                        onPress={handleCreateOrder}
                    />

                    {error && <Text style={{color: 'red', fontSize: 16}}>
                        Необходимо выбрать пункт выдачи и заполнить все поля
                    </Text>}

                    {success && <Text style={{color: 'green', fontSize: 16}}>
                        Заказ успешно оформлен!
                    </Text>}

                </CustumBottomSheet>

                <PickupPointsModal
                    isVisibleModal={isVisiblePickup}
                    onPressBack={() => setIsVisiblePickup(false)}
                    setSelectPickup={handleSetSelectPickup}
                />
            </View>
            :
            <ActivityIndicator size={"large"} style={{alignItems: "center", alignSelf: "center", flex: 1}}/>
    );
};

export default ShopScreenHomePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        backgroundColor: "#fff",
    },
    wrapper: {
        flex: 1,
        width: "100%",
    },
    header: {
        marginTop: 64,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 16
    },
    padding16: {
        paddingHorizontal: 16,
    },
    baskedBox: {
        width: 38,
        height: 38,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
    },
    balance_box: {
        width: "100%",
        backgroundColor: "#F6F6F8",
        height: 114,
        marginTop: 26,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        alignItems: "center",
        marginBottom: 24,

    },
    userDataBox: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    navbar: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#AEAEAE",
        width: "100%",
        paddingHorizontal: 16,
    },
    tab: {
        height: 23,
        alignItems: "center",
        marginRight: 23,
        color: '#AEAEAE'

    },
    tabText: {
        fontFamily: FONTS.Roboto400,
        fontSize: 16,
        color: "red",

    },
    activeTabText: {
        fontFamily: FONTS.Roboto400,
        color: "black",
        fontWeight: "bold",
        // borderBottomWidth: 1,
        // borderBottomColor: "black",
        zIndex: 1,
        fontSize: 16,
        marginRight: 23,
    },
    flatContainer: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 16,
        marginTop: 26,
    },
    flatContentContainer: {
        flexDirection: "column",
        width: "100%",
        justifyContent: "space-between",
        marginBottom: 104
    },
    merchHistory: {
        width: "100%",
        height: 64,
        backgroundColor: "#F6F6F8",
        borderRadius: 9,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        alignItems: "center",
        marginBottom: 26,
    },
    bottomBaskedContent: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 24
    },
    button: {
        width: '100%',
        height: 64,
        backgroundColor: '#000',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 12
    },
    count: {
        backgroundColor: 'red',
        width: 19,
        height: 19,
        borderRadius: 24,
        color: '#fff',
        position: 'absolute',
        right: -4,
        top: -6,
        zIndex: 999,
        textAlign: 'center',
        paddingTop: 3,
        fontSize: 10
    },
    countText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 10
    },
    subtitle: {
        color: '#AEAEAE',
        fontSize: 16,
        fontFamily: FONTS.Manrope500,
        marginTop: 14
    },
    pickup_point_btn: {
        width: '100%',
        backgroundColor: '#F6F6F8',
        borderRadius: 12,
        justifyContent: 'center',
        marginVertical: 24,
        paddingLeft: 16,
        paddingVertical: 24
    },

});
