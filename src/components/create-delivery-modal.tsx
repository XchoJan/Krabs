import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";
import {FONTS} from "../theme/fonts";
import Modal from 'react-native-modal'
interface CreateDeliveryModalProps extends TouchableOpacityProps {
    title: string;
    color?: string;
    isVisible: boolean
}

const CreateDeliveryModal: React.FC<CreateDeliveryModalProps> = ({
                                                                     title,
                                                                     color,
                                                                     isVisible
                                                                      }) => {
    return (
        <Modal isVisible={isVisible}>
            <View style={styles.container} >
                <Text style={[styles.title, {color: color ? color : '#222'}]}>{title}</Text>
            </View>
        </Modal>
    );
};

export default CreateDeliveryModal;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: '90%',
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        position: 'absolute',
        bottom: 0
    },
    title:{
        fontSize: 20,
        color: '#222',
        lineHeight: 24,
        fontFamily: FONTS.Manrope600,

    }
});
