import React, {useEffect, useState, useCallback,} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    Modal,
    TextInput,
    LogBox,
    RefreshControl,
    Image, Platform, Dimensions, Linking
} from "react-native";
import {globalStyles} from "../../../theme/globalStyles";

import {
    getAllCategories,
    getAllDocuments,
    getShowRooms,
    getShowRoomsByCategory
} from "../../../services/API/get-show-rooms";
import {useSelector} from "react-redux";
import DocumentItem from "./components/document-item";
import DillerItem from "./components/diller-item";
import {FONTS} from "../../../theme/fonts";
import {KeyboardAvoidingScrollView} from "react-native-keyboard-avoiding-scroll-view";
import ArrowRight from '../../../assets/svg/right_arrow_icon_224556.svg'
import AppMetrica from "@gennadysx/react-native-appmetrica";

const windowWidth = Dimensions.get('window').width
const windowHeight = Dimensions.get('window').height

const ShowRoomsScreen = () => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

    const tokenFromReducer = useSelector((store: any) => store.user_token.user_token);
    const [documents, setDocuments] = useState<any>([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')

    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleSearch, setIsVisibleSearch] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const [dillers, setDillers] = useState([])

    const [ceilings, setCeilings] = useState([]);
    const [drywalls, setDrywalls] = useState([]);
    const [lights, setLights] = useState([]);

    const [isVisible1, setIsVisible1] = useState(false)
    const [isVisible2, setIsVisible2] = useState(false)
    const [isVisible3, setIsVisible3] = useState(false)

    const [searchValue, setSearchValue] = useState('');
    const [filteredDillers, setFilteredDillers] = useState([]);

    const [refreshing, setRefreshing] = React.useState(false);

    const [filePath, setFilePath] = useState('')


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getAllDocuments(tokenFromReducer).then((r) => {
                setDocuments(r)
            })
            getAllCategories(tokenFromReducer).then((r) => {
                setCategories(r)
            })
            getShowRooms(tokenFromReducer).then((r) => {
                setDillers(r?.items)
                categorizeDillers(r?.items);
            })
            setRefreshing(false);
        }, 2000);
    }, []);


    const categorizeDillers = (dillers: any) => {
        const ceilingsArr: any = [];
        const drywallsArr: any = [];
        const lightsArr: any = [];

        dillers.forEach((dealer: any) => {
            switch (dealer.category) {
                case 'Натяжные потолки':
                    ceilingsArr.push(dealer);
                    break;
                case 'Гипсокартон':
                    drywallsArr.push(dealer);
                    break;
                case 'Свет':
                    lightsArr.push(dealer);
                    break;
                default:
                    break;
            }
        });

        const sortDealersByCity = (dealersArray) => dealersArray.sort((a, b) =>
            (a?.addresses[0]?.city ?? '').localeCompare(b?.addresses[0]?.city ?? '')
        );

        setCeilings(sortDealersByCity(ceilingsArr));
        setDrywalls(sortDealersByCity(drywallsArr));
        setLights(sortDealersByCity(lightsArr));
        //
        // setCeilings(ceilingsArr);
        // setDrywalls(drywallsArr);
        // setLights(lightsArr);
    };


    useEffect(() => {
        getAllDocuments(tokenFromReducer).then((r) => {
            setDocuments(r)
        })
        getAllCategories(tokenFromReducer).then((r) => {
            setCategories(r)
        })
    }, []);


    useEffect(() => {
        getShowRooms(tokenFromReducer).then((r) => {
            setDillers(r?.items)
            categorizeDillers(r?.items);
            // console.log(r.items,'asdasdasdasd');
        })
    }, []);

    const downloadFile = async (uri: string) => {
        // console.log(uri, 'uri')
        AppMetrica.reportEvent('Файлов скачено');
        await Linking.openURL(uri)//uri
        // console.log(uri, 'URI')
    }

    const renderItem = ({item}: any) => {
        return (
            <DocumentItem onPressItem={() => {
                downloadFile(item.document).then()
            }} item={item}/>
        )
    }

    const renderDillers = ({item}: any) => {
        return (
            <DillerItem item={item}/>
        )
    }

    function filterAddressesByCity(dillers: any, city: any) {
        const filteredDillers: any = [];
        dillers.forEach((diller: any) => {
            const filteredAddresses = diller.addresses.filter((address: any) =>
                address.city.toLowerCase().includes(city.toLowerCase())
            );
            if (filteredAddresses.length > 0) {
                filteredDillers.push({...diller, addresses: filteredAddresses});
            }
        });
        return filteredDillers;
    }

    const removeDuplicatesByTitle = (data: any[]) => {
        const seenTitles = new Set();
        return data.filter(item => {
            if (seenTitles.has(item.title)) {
                return false; // Уже добавлен, пропускаем
            }
            seenTitles.add(item.title);
            return true; // Добавляем уникальный элемент
        });
    };


    const handleInputChange = (text: any) => {
        AppMetrica.reportEvent('Искали диллеров');

        setSearchValue(text);
        if (text.length >= 3) {
            const filtered = filterAddressesByCity(dillers, text);
            const uniqueFiltered = removeDuplicatesByTitle(filtered); // Удаляем дубликаты
            console.log(uniqueFiltered);
            setFilteredDillers(uniqueFiltered);
        } else {
            setFilteredDillers([]);
        }
    };


    return (
        <View style={styles.container}>
            <KeyboardAvoidingScrollView showsVerticalScrollIndicator={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
            }>
                <Text style={globalStyles.MobH3}>База знаний</Text>
                <View style={{position: 'relative'}}>
                    <View style={styles.between}>
                        <Text style={[globalStyles.MobT3, styles.title]}>Каталоги</Text>

                        <View style={{top: 4}}>
                            <ArrowRight width={26} height={26}/>
                        </View>
                    </View>
                    <FlatList
                        data={documents['Каталоги']}
                        renderItem={renderItem}
                        horizontal={true}
                    />
                </View>

                <View style={{position: 'relative'}}>
                    <View style={styles.between}>
                        <Text style={[globalStyles.MobT3, styles.title]}>Прайс на продукцию</Text>

                        <View style={{top: 4}}>
                            <ArrowRight width={26} height={26}/>
                        </View>
                    </View>
                    <FlatList
                        data={documents['Прайс на продукцию']}
                        renderItem={renderItem}
                        horizontal={true}
                        showsHorizontalScrollIndicator={true}
                    />

                </View>

                <View style={{position: 'relative'}}>
                    <View style={styles.between}>
                        <Text style={[globalStyles.MobT3, styles.title]}>
                            Прайс на монтажные работы
                        </Text>
                        <View style={{top: 4}}>
                            <ArrowRight width={26} height={26}/>
                        </View>
                    </View>
                    <Text style={[globalStyles.MobT3, {color: '#000', marginTop: 4, fontFamily: FONTS.Manrope300}]}>Прайс-листы
                        с рекомендованными
                        розничными ценами на монтажные работы</Text>
                    <FlatList
                        data={documents['Прайс на монтажные работы']}
                        renderItem={renderItem}
                        horizontal={true}
                    />
                </View>

                <View style={{position: 'relative'}}>
                    <View style={styles.between}>
                        <Text style={[globalStyles.MobT3, styles.title]}>Технологические карты</Text>

                        <View style={{top: 4}}>
                            <ArrowRight width={26} height={26}/>
                        </View>
                    </View>
                    <FlatList
                        data={documents['Технологические карты']}
                        renderItem={renderItem}
                        horizontal={true}
                    />
                </View>

                <View>
                    <Text style={[globalStyles.MobT3, styles.title]}>Дилеры</Text>
                    <View style={{
                        width: '100%',
                        height: 42,
                        borderRadius: 24,
                        marginBottom: 24,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        paddingRight: 12

                    }}>
                        <TextInput
                            placeholderTextColor={'#B2AEAE'}
                            placeholder={'Быстрый поиск'}
                            style={{
                                width: '80%',
                                paddingHorizontal: 12,
                                fontSize: 16
                            }}
                            value={searchValue}
                            onChangeText={handleInputChange}
                        />
                        <Image style={{width: 24, height: 24,}}
                               source={require('../../../assets/images/InputFilter.png')}/>
                    </View>

                    {filteredDillers?.length > 0 &&
                        <FlatList
                            style={{marginBottom: 12}}
                            data={filteredDillers}
                            renderItem={renderDillers}
                            keyExtractor={(item: any) => item.id}
                        />}

                    {!!ceilings?.length &&
                        <TouchableOpacity onPress={() => {
                            setIsVisible1(!isVisible1)
                        }} style={styles.selectBox}>
                            <Text style={styles.selectTitle}>Натяжные потолки</Text>
                        </TouchableOpacity>}

                    {isVisible1 &&
                        <FlatList
                            style={{marginBottom: 12}}
                            data={ceilings}
                            renderItem={renderDillers}
                            keyExtractor={(item: any) => item.id}
                        />}

                    {!!drywalls?.length &&
                        <TouchableOpacity onPress={() => {
                            setIsVisible2(!isVisible2)
                        }} style={styles.selectBox}>
                            <Text style={styles.selectTitle}>Гипсокартон</Text>
                        </TouchableOpacity>}

                    {isVisible2 &&
                        <FlatList
                            style={{marginBottom: 12}}
                            data={drywalls}
                            renderItem={renderDillers}
                            keyExtractor={(item: any) => item.id}
                        />}

                    {!!lights?.length &&
                        <TouchableOpacity onPress={() => {
                            setIsVisible3(!isVisible3)
                        }} style={styles.selectBox}>
                            <Text style={styles.selectTitle}>Свет</Text>
                        </TouchableOpacity>}

                    {isVisible3 &&
                        <FlatList
                            style={{marginBottom: 12}}
                            data={lights}
                            renderItem={renderDillers}
                            keyExtractor={(item: any) => item.id}
                        />}
                </View>
                <Modal visible={isVisible}>
                    <View style={styles.modalBox}>
                        <TouchableOpacity onPress={() => {
                            setIsVisible(false)
                            setSelectedCategory('')
                            setDillers([])
                        }} style={styles.selectBox}>
                            <Text style={styles.selectTitle}>{selectedCategory}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginHorizontal: 16}}>
                        <FlatList
                            data={dillers}
                            renderItem={renderDillers}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </Modal>

            </KeyboardAvoidingScrollView>
            {showSuccess &&
                <View style={styles.popUp}>
                    <Text style={{width: '100%', textAlign: 'center', fontSize: 16, color: '#000'}}>
                        Файл сохранен в {filePath}
                    </Text>
                </View>
            }

        </View>


    );
};

export default ShowRoomsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 16,
        paddingTop: 44,
        position: 'relative',
    },
    title: {
        color: '#000',
        marginTop: 24,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 14
    },
    selectBox: {
        backgroundColor: '#D9D9D9',
        width: '100%',
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginBottom: 16
    },
    selectTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '400'
    },
    modalBox: {
        paddingHorizontal: 16,
        paddingTop: 24
    },
    popUp: {
        marginHorizontal: 32,
        position: 'absolute',
        top: '80%',
        zIndex: 999999,
        backgroundColor: '#b7b4b4',
        width: '90%',
        left: 0,
        alignSelf: 'center',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8
    },
    pdf: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    between:{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}
});


