import React, {useEffect, useState} from "react";
import UnauthorizedNavigation from "./UnauthorizedNavigations/unauthorized-navigation";
import {useDispatch, useSelector} from "react-redux";
import {NavigationContainer} from "@react-navigation/native";
import AuthorizedNavigation from "./AuthorizedNavigations/authorized-navigation";
import {StatusBar, StyleSheet, View} from "react-native";
import {getAuth} from "../services/AsyncStorageServices";
import {setUserToken} from "../store/actions/user_token";
import {getUserData} from "../services/API/get_user_data";
import {setUserData} from "../store/actions/user_data";
import {ActivityIndicator} from "react-native";
import { RefreshToken } from "../services/API/refresh_token";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RootNavigations = () => {
    const dispatch = useDispatch();
    const tokenFromReducer = useSelector((store: any) => store.user_token.user_token);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        (async () => {
            getAuth().then((r) => dispatch(setUserToken(r.token)));
            console.log('ON GET');
        })();
    }, []);

    useEffect(() => {
        if (tokenFromReducer) {
            getUserData(tokenFromReducer).then((r) => {
                if (r.statusCode === 401){
                    RefreshToken(tokenFromReducer).then((r)=>{
                        dispatch(setUserToken(r.accessToken));
                        AsyncStorage.setItem('access', r.accessToken).then();
                    })
                }else {
                    dispatch(setUserData(r.data));
                }
            });
        }
    }, [tokenFromReducer]);

    useEffect(() => {
        setTimeout(()=>{
            setIsLoading(false)
        },2000)
    }, []);

    // useEffect(() => {
    //     dispatch(setUserToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhNGEzMzk5LTU0YzgtNDAzMy1iZDFjLTBkZTc5NmUxM2Q1OSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzAwODUyODY5LCJleHAiOjE3MDA5MzkyNjl9.FNEsrgKlihdWQy8ibneMlBVW_qwmNmLsDpXtkXbl5CQ'))
    //     AsyncStorage.setItem('access', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNhNGEzMzk5LTU0YzgtNDAzMy1iZDFjLTBkZTc5NmUxM2Q1OSIsInJvbGUiOiJVc2VyIiwiaWF0IjoxNzAwODUyODY5LCJleHAiOjE3MDA5MzkyNjl9.FNEsrgKlihdWQy8ibneMlBVW_qwmNmLsDpXtkXbl5CQ')
    // }, []);

    return (
        <NavigationContainer>

            <StatusBar barStyle={'dark-content'} backgroundColor={"#000"} networkActivityIndicatorVisible={true}/>
            {isLoading ?
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size={'large'}/>
                </View>
                : tokenFromReducer
                ? <AuthorizedNavigation/> : <UnauthorizedNavigation/>}
            {/*<UnauthorizedNavigation />*/}
        </NavigationContainer>

    )
}

export default RootNavigations
const styles = StyleSheet.create({
    loadingContainer:{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
})





