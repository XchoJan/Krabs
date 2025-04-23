import React from 'react';
import {Pressable, Image, Text, View, StyleSheet, TouchableOpacity} from "react-native";

interface Item {
    category: string,
    document: string,
    id: string,
    name: string,
    photo: string,
}

const DocumentItem: React.FC<{ item: Item, onPressItem: any }> = ({ item, onPressItem }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onPressItem} style={styles.imageBox}>
                <Image source={{ uri: item.photo }} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.title}>{item.name}</Text>
        </View>

    );
};

export default DocumentItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    imageBox: {
        width: 100,
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',

    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: 100,
        maxHeight: 100
    }
})
