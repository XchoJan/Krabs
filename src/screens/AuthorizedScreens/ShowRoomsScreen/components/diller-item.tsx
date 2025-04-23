import React from 'react';
import {StyleSheet, Text, View, Linking, Pressable} from "react-native";
import {globalStyles} from "../../../../theme/globalStyles";

const DillerItem = ({item}: any) => {
    return (
        <View style={styles.container}>
            <Text style={{fontSize: 18, color: '#000', marginBottom: 12}}>
                {item?.addresses[0]?.city}
            </Text>
            <View style={styles.itemsContainer}>
                <View style={{width: '50%'}}>
                    <Text  style={[globalStyles.MobT2, {maxWidth: '90%'}]}>{item.title}</Text>
                </View>
                <View style={{width: '50%'}}>
                    <Text style={[styles.text, {textAlign: 'right'}]}>{item?.addresses[0]?.address.split(',')[0]}</Text>
                  <Pressable onPress={()=>{
                      Linking.openURL(`tel:+7${item?.addresses[0]?.phone}`)
                  }}>
                      <Text style={[styles.text, {textAlign: 'right', marginTop: 6}]}>
                         +7{item?.addresses[0]?.phone}
                      </Text>
                  </Pressable>
                </View>
            </View>
        </View>
    );
};

export default DillerItem;

const styles = StyleSheet.create({
    container:{
        width: '100%',
        marginBottom: 8
    },
    itemsContainer:{
        width: '100%',
        height: 90,
        backgroundColor: '#fff',
        borderRadius: 12,
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'space-between',
        paddingTop: 12
    },
    text:{color: '#000', fontSize: 16}
})
