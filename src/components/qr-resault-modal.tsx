import React, {useEffect, useState} from "react";
import {StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Modal from "react-native-modal";
import AppButton from "./app-button";
import {FONTS} from "../theme/fonts";
import {globalStyles} from "../theme/globalStyles";
import BigAcceptIcon from "../assets/svg/BigAcceptIcon.svg";
import BigSubtractIcon from "../assets/svg/BigSubtractIcon.svg";
import BigCancelIcon from "../assets/svg/BigCancellIcon.svg";
import DangerIcon from "../assets/svg/DangerIcon.svg";
import moment from "moment";
import CancelButton from "./cancel-button";

const QrResultModal = ({
                           status,
                           data,
                           isVisible,
                           onCloseModal,
                           handleShowCounterfeitModal,
                           closeModal,
                           onPressCancelButton
                       }: any) => {

    return (
        <Modal
            animationIn={'slideInUp'}
            animationOut={'slideOutDown'}
            animationOutTiming={400}
            isVisible={isVisible}
            style={{margin: 0}}>

            {/*{status === 1 && <View style={styles.iconBox}>*/}
            {/*    <BigAcceptIcon/>*/}
            {/*</View>}*/}

            {status === 2 && <View style={styles.iconBox}>
                <BigSubtractIcon/>
            </View>}
            {status === 3 && <View style={styles.iconBox}>
                <BigCancelIcon/>
            </View>}
            {status === 4 && <View style={styles.iconBox}>
                <DangerIcon/>
            </View>}

            <View style={[styles.modalBox, status === 1 && styles.modalBoxIfStatus1]}>
                {status === 1 &&
                    <View style={styles.modalTopBox}>
                        <Text style={[styles.successTitle, {fontSize: 18}]}>Оригинальный продукт KRAAB SYSTEMS!</Text>
                        {/*<Text style={styles.manufacturer}>*/}
                        {/*    Товар был произведен KRAAB SYSTEMS и находится в базе оригинальной продукции.*/}
                        {/*    /!*{data?.productName}*!/*/}
                        {/*    /!*{"\n"}*!/*/}
                        {/*    /!*от {moment(data?.createdAt).format("DD.MM.YYYY")}*!/*/}
                        {/*</Text>*/}
                        <View style={styles.bonusBox}>
                            <Text style={globalStyles.MobT3}>
                                Начислено
                            </Text>
                            <Text style={[globalStyles.MobH1, {color: "#222"}]}>
                                {data?.bonus} B
                            </Text>
                        </View>
                    </View>}

                {status === 2 &&
                    <View style={styles.modalTopBox}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.successTitle, {color: "#DAA555"}]}>QR-код уже был {"\n"}
                                отсканирован!</Text>
                            <Text style={styles.manufacturer}>
                                Данный товар был отсканирован. Если это были не вы, сообщите, пожалуйста, производителю.
                            </Text>
                        </View>
                    </View>}

                {status === 3 &&
                    <View style={styles.modalTopBox}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.successTitle, {color: "#DA5955"}]}>Ой, что-то пошло не так</Text>
                            <Text style={styles.manufacturer}>
                                Данный товар отсутствует в базе оригинальной продукции. Необходимо сообщить об этом
                                производителю.
                            </Text>
                        </View>
                    </View>}

                {status === 4 &&
                    <View style={styles.modalTopBox}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.successTitle, {color: "#DA5955"}]}>Ошибка{"\n"}сканирования!</Text>
                            <Text style={styles.manufacturer}>
                                Не получилось сканировать код
                                {"\n"}
                                пожалуйста, попробуйте еще раз
                            </Text>
                        </View>
                    </View>}


                {/*{status === 1 &&*/}
                {/*        <TouchableOpacity onPress={onCloseModal} style={styles.button}>*/}
                {/*            <Text style={styles.buttonTitle}>*/}
                {/*                Закрыть*/}
                {/*            </Text>*/}
                {/*        </TouchableOpacity>*/}
                {/*}*/}
                {status === 2 &&
                    <View>
                        <TouchableOpacity onPress={handleShowCounterfeitModal} style={styles.button}>
                            <Text style={styles.buttonTitle}>
                                Сообщить
                            </Text>
                        </TouchableOpacity>
                        <CancelButton onPress={onPressCancelButton} black/>
                    </View>


                }
                {status === 3 &&

                    <View>
                        <TouchableOpacity onPress={handleShowCounterfeitModal} style={styles.button}>
                            <Text style={styles.buttonTitle}>
                                Сообщить
                            </Text>
                        </TouchableOpacity>
                        <CancelButton onPress={onPressCancelButton} black/>
                    </View>
                }

                {status === 4 &&
                    <View>
                        <TouchableOpacity onPress={onCloseModal} style={styles.button}>
                            <Text style={styles.buttonTitle}>
                                Попробовать снова
                            </Text>
                        </TouchableOpacity>
                        <CancelButton onPress={onPressCancelButton} black/>
                    </View>
                }
            </View>
        </Modal>
    );
};

export default QrResultModal;

const styles = StyleSheet.create({
    modalBoxIfStatus1: {
        height: 127,
        paddingHorizontal: 16,
        top: 0,
        backgroundColor: "#fff",
        width: "100%",
        position: "absolute",
        paddingBottom: 16,
        paddingTop: 32,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    modalBox: {
        height: "65%",
        paddingHorizontal: 16,
        bottom: 0,
        backgroundColor: "#fff",
        width: "100%",
        position: "absolute",
        paddingBottom: 16,
        paddingTop: 32,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    modalTopBox: {
        flex: 1,
        paddingHorizontal: 0,
        margin: 0,
    },
    successTitle: {
        fontSize: 28,
        color: "#5FBB3F",
        fontFamily: FONTS.Manrope600,
        lineHeight: 33,
    },
    manufacturer: {
        fontSize: 20,
        fontWeight: "400",
        fontFamily: FONTS.Roboto400,
        color: "#222",
        lineHeight: 24,
        marginTop: 32,
    },
    bonusBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 18
    },
    button: {
        backgroundColor: "#000",
        width: "100%",
        height: 71,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        marginBottom: 8
    },
    buttonTitle: {
        color: "#F6F6F6",
        fontSize: 20,
        fontFamily: FONTS.Manrope600,
        top: -4,
    },
    iconBox: {
        width: 80,
        height: 80,
        backgroundColor: "#fff",
        position: "absolute",
        top: "10%",
        alignSelf: "center",
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
});
