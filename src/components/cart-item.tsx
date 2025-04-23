import React from 'react';
import {View, StyleSheet, Text, Pressable, Image, TouchableOpacity} from "react-native";
import {globalStyles} from "../theme/globalStyles";
import PlusIcon from '../assets/svg/PlusIcon.svg'
import MinusIcon from '../assets/svg/MinusIcon.svg'
import DeleteIcon from '../assets/svg/DeleteIcon.svg'

const CartItem = ({item, onPressPlus, onPressMinus, onPressDelete}: any) => {

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {
                    (!item?.photo?.length && !item.mainPhoto) ? (
                        <Image source={require('../assets/images/noImage.png')} style={styles.image} />
                    ) : (
                        <Image source={{ uri: item?.photo && item?.photo.length > 0 ? item?.photo[0] : item.mainPhoto }} style={styles.image} />
                    )
                }

            </View>
            <View style={styles.minContainer}>
                <View style={{marginLeft: 8}}>
                    <Text numberOfLines={1} style={[globalStyles.MobT3, {maxWidth: 180}]}>{item?.name} / {item?.color}</Text>
                    <View style={{ flexDirection: 'row'}}>
                        <View style={styles.calcItemsBox}>
                            <Pressable style={{ height: '100%', justifyContent: 'center'}} onPress={onPressMinus}>
                                <MinusIcon/>
                            </Pressable>
                            <Text style={styles.calcItem}>
                                {item?.quantity}
                            </Text>
                            <Pressable onPress={onPressPlus}>
                                <PlusIcon/>
                            </Pressable>
                        </View>
                        <TouchableOpacity style={{top: 18}} onPress={onPressDelete}>
                           <DeleteIcon width={44} height={44}/>
                        </TouchableOpacity>

                    </View>
                </View>
                <View style={{height: '100%', justifyContent: 'flex-end'}}>
                    <Text style={[globalStyles.MobT1, {alignSelf: 'flex-end'}]}>
                        {item?.totalItemPrice} B
                    </Text>
                </View>
            </View>

        </View>
    );
};

export default CartItem;

const  styles = StyleSheet.create({
    container:{
        width: '100%',
        height: 80,
        flexDirection: 'row',
        marginBottom: 18
    },
    imageContainer:{
        width: 80,
        height: 80,
    },
    minContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '75%'
    },
    calcItemsBox:{
        flexDirection: 'row',
        width: 108,
        backgroundColor: '#F6F6F8',
        height: 40,
        borderRadius: 24,
        marginTop: 21,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12
    },
    calcItem:{
        fontSize: 20,
        color: '#000000',
        fontWeight: '600',
        lineHeight: 24
    },
    image:{
        width: '100%',
        height: '100%'
    }
})
