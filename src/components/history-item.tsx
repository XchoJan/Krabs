import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, View, Text, ScrollView, FlatList, Modal, Image} from "react-native";
import HistoryItemIcon from '../assets/svg/HistoryItemIcon.svg'
import {getMyOrders, getSingleOrderFullData, getSingleOrderInfo} from "../services/API/merch";
import {useSelector} from "react-redux";
import moment from "moment";
import CloseIcon from '../assets/svg/close.svg'

import ArrowTop from '../assets/svg/chevron_top.svg'
import ArrowDown from '../assets/svg/chevron_down.svg'

const HistoryItems = ({refreshData}:any) => {
    const tokenFromReducer = useSelector((store: any) => store.user_token.user_token);
    const [history, setHistory] = useState([])
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>({})
    const [selectedItem, setSelectedItem] = useState<any>({})
    const [isVisibleStatus, setIsVisibleStatus] = useState(false)
    const [fullData, setFullData] = useState<any>([])

    const [ready, setReady] = useState(false)

    const onPressStatus = () => {
        setIsVisibleStatus(!isVisibleStatus)
    }

    const handleGetMyOrders = async () => {
        getMyOrders(tokenFromReducer).then(r => setHistory(r?.items))

    }

    useEffect(() => {
        handleGetMyOrders().then()
    }, []);

    useEffect(() => {
        handleGetMyOrders().then()
    }, [refreshData]);


    const renderItem = ({item}: any) => {
        return (
            <Pressable onPress={() => onPressItem(item)} style={styles.itemWrapper}>
                <View style={styles.item}>
                    <HistoryItemIcon/>
                    <View style={{marginLeft: 14}}>
                        <Text style={styles.time}>
                            {moment(item?.createdAt).format('YYYY-MM-DD HH:mm')}
                        </Text>
                        <Text style={{color: '#AEAEAE'}}>
                            № {item?.number}
                        </Text>
                    </View>
                </View>
                <View>
                    <Text style={styles.balance}>- {item.totalPrice} B</Text>
                </View>
            </Pressable>
        )
    }

    const onPressItem = async (item: any) => {
        setIsVisible(true);
        setSelectedItem(item)
        getSingleOrderInfo(tokenFromReducer, item.cdekUuid).then(r => {
            setSelectedOrder(r)
            console.log(r, 'RESPONSE')
        })
        getSingleOrderFullData(tokenFromReducer, item.id).then(r => setFullData(r))
    }

    useEffect(() => {
        selectedOrder?.entity?.statuses.map((el: any)=> {
            if (el.code === 'READY_FOR_APPOINTMENT'){
                setReady(true)
            }else {
                setReady(false)
            }
        })
    }, [selectedOrder]);

    return (
        <View style={styles.container}>
            {!history ?
                <View>
                    <Text>Здесь пока пусто</Text>
                </View>
                :
                <FlatList
                    data={history}
                    renderItem={renderItem}
                />
            }

            <Modal visible={isVisible}>
                <View style={styles.modal}>
                    <Pressable onPress={() => {
                        setIsVisible(false)
                        setSelectedOrder({})
                        setSelectedItem({})
                        setFullData([])
                    }} style={styles.close}>
                        <CloseIcon/>
                    </Pressable>

                    <View>
                        <Text style={styles.selectedItemTime}>
                            {moment(selectedItem?.createdAt).format('YYYY-MM-DD HH:mm')}
                        </Text>

                        <View style={styles.selectedItemBox}>
                            <View style={styles.selectedItemAddressBox}>
                                <Text style={styles.selectedItemNumber}>№ {selectedItem?.number}</Text>
                                <Text style={{color: '#AEAEAE', fontSize: 16, fontWeight: '500'}}>
                                    {selectedOrder?.entity?.to_location?.city}
                                </Text>
                            </View>

                            <Text style={[styles.balance, {fontSize: 30}]}>
                                {selectedItem.totalPrice} B
                            </Text>

                            <View style={styles.status}>
                                <Text style={{color: !ready ? '#DAA555' : 'green'}}>
                                    {ready ? 'Готов к выдаче' : "В пути"}
                                </Text>
                            </View>

                            {!isVisibleStatus && <Pressable onPress={onPressStatus} style={{flexDirection: 'row', marginTop: 12, alignItems: 'center'}}>
                                <ArrowDown/>
                                <Text style={[styles.balance, {fontSize: 16}]}>
                                    Детали доставки
                                </Text>
                            </Pressable>
                            }

                            <View style={{marginTop: 12}}>
                                {isVisibleStatus && selectedOrder?.entity?.statuses.map((el: any, index: any)=> (
                                    <View key={index}>
                                        <Text style={styles.t3}>
                                            {el?.name}
                                        </Text>
                                        <Text style={styles.t3Grey}>
                                            {moment(el?.date_time).format('YYYY:MM:DD HH:mm')}
                                        </Text>
                                    </View>
                                ))}
                            </View>


                            {isVisibleStatus && <Pressable onPress={onPressStatus} style={{flexDirection: 'row', marginTop: 12, alignItems: 'center'}}>
                                <ArrowTop/>
                                <Text style={[styles.balance, {fontSize: 16}]}>
                                    Свернуть
                                </Text>
                            </Pressable>
                            }
                        </View>


                        <View style={{marginTop: 32}}>
                            {fullData?.orders?.items.map((el:any, index:any)=> (
                                <View style={styles.itemBox} key={index}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Image style={styles.itemImage} source={{uri: el?.mainPhoto}}/>
                                        <View>
                                            <Text style={[styles.t3, {maxWidth: '80%'}]}>
                                                {el.name}
                                            </Text>
                                            <Text style={[styles.t3, {color: 'grey'}]}>
                                                {el.quantity} штук
                                            </Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.t3, {color: 'grey', right: 40}]}>
                                        {el.totalItemPrice} B
                                    </Text>
                                </View>
                            ))}
                        </View>

                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default HistoryItems;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    time: {
        color: '#222222',
        fontSize: 16,
        fontWeight: '500'
    },
    number: {
        color: '#AEAEAE',
        fontSize: 14,
        fontWeight: '500'
    },
    balance: {
        color: '#222222',
        fontSize: 20,
        fontWeight: '500'
    },
    itemWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '75%',
        alignItems: 'center',
        marginBottom: 28
    },
    modal: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        paddingHorizontal: 16
    },
    close: {
        alignSelf: 'flex-end',
        marginTop: 44,
    },
    selectedItemBox: {
        backgroundColor: '#F6F6F8',
        borderRadius: 12,
        padding: 24
    },
    selectedItemTime: {
        color: '#000000',
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 32
    },
    selectedItemNumber: {
        color: '#222222',
        fontSize: 18,
        fontWeight: '500',
    },
    selectedItemAddressBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10
    },
    status: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#DAA5551A',
        alignSelf: 'flex-start',
        borderRadius: 100,
        marginTop: 14
    },
    t3:{
        color: '#000000',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8
    },
    t3Grey:{
        color: '#AEAEAE',
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#AEAEAE',
        paddingBottom: 8
    },
    itemImage:{
        width: 80,
        height: 80,
        marginRight: 14
    },
    itemBox:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14
    }
});
