import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from "react-native";

const CancelButton = ({onPress, black}: any) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.container,]}>
            <Text style={[styles.title, black && {color: '#000', borderBottomColor: '#000'}]}>
                Отмена
            </Text>
        </TouchableOpacity>
    );
};

export default CancelButton;

const styles = StyleSheet.create({
    container:{
        zIndex: 9999
    },
    title:{
        color: '#fff',
        fontSize: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        alignSelf: 'center'
    }

})
