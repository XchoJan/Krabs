import React, {useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Image, Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {globalStyles} from "../../../theme/globalStyles";
import AppWrapper from "../../../components/app-wrapper";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {setNewsItem} from "../../../store/actions/news_item";
import {FONTS} from "../../../theme/fonts";
import {getNewsList} from "../../../services/API/api-news";
import {
    longPressGestureHandlerProps
} from "react-native-gesture-handler/lib/typescript/handlers/LongPressGestureHandler";
import {getAllCategories, getAllDocuments, getShowRooms} from "../../../services/API/get-show-rooms";
import Onboarding from "../../../components/onboarding";

const NewsScreen = () => {
    const navigation: any = useNavigation()
    const dispatch = useDispatch()
    const tokenFromReducer = useSelector((store: any) => store.user_token.user_token)
    const [news, setNews] = useState([])
    const firstAuthFromReducer = useSelector((store: any) => store?.first_auth?.first_auth);
    const [loading, setLoading] = useState(true)

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            getNewsList(tokenFromReducer).then((r) => {
                setNews(r?.items)
            })
            setRefreshing(false);
        }, 2000);
    }, []);


    useEffect(() => {

        if (firstAuthFromReducer === true){
            setLoading(false)
            navigation.navigate('PersonalAreaNavigator')
        } else {
            setLoading(false)
        }
    }, [firstAuthFromReducer]);
    const handleDetailsScreen = (item: any) => {
        dispatch(setNewsItem(item))
        navigation.navigate('newsDetailScreen')
    }

    useEffect(() => {
        getNewsList(tokenFromReducer).then((r) => {
            setNews(r?.items)
        })
    }, []);

    const renderItem = ({item}: any) => {
        return (
            !item.isHide && <TouchableOpacity onPress={() => handleDetailsScreen(item)} activeOpacity={0.6}
                              style={[styles.itemContainer]}>
                {item?.mainPhoto ?
                    <Image source={{uri: item.mainPhoto}} style={styles.itemImage}/>
                    :
                    <Image source={require('../../../assets/images/noImage.png')} style={styles.itemImage}/>
                }
                <Text style={[globalStyles.MobH2, {marginTop: 18, marginBottom: 4}]}>{item.title.toUpperCase()}</Text>
                <Text style={[globalStyles.MobT3]}>{item.subtitle}</Text>
            </TouchableOpacity>
        );
    };
    return (
        <AppWrapper marginTop={24} alignCenter={false}>
            {loading ?
                <ActivityIndicator
                    size={'large'}
                    style={{alignSelf: 'center', justifyContent: 'center', flex: 1}}
                />
                :
                <View style={{flex: 1}}>

                    <Text style={[styles.title]}>
                        Новости
                    </Text>
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                        data={news}
                        //@ts-ignore
                        renderItem={renderItem}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            }
            <View style={{ marginBottom: Platform.OS === 'ios' ? 80 : 0}}/>
        </AppWrapper>
    );
};

export default NewsScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 22,
        color: "#222",
        lineHeight: 26,
        marginBottom: 38,
        marginTop: 44,
        fontFamily: FONTS.Manrope400
    },
    itemContainer: {
        width: "100%",
        height: 276,
        marginBottom: 32
    },
    itemImage: {
        width: "100%",
        height: 191,
        borderRadius: 8,
    },
    itemTitle: {},
    itemDescription: {},
});
