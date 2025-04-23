import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Pressable,
    Platform,

} from "react-native";
import AppWrapper from "../../../components/app-wrapper";
import {globalStyles} from "../../../theme/globalStyles";
import AppButton from "../../../components/app-button";
import {useClearByFocusCell} from "react-native-confirmation-code-field";
import {useDispatch, useSelector} from "react-redux";
import {setUserToken} from "../../../store/actions/user_token";
import PinCodeInputs from "../../../components/pin-code-inputs";
import {registrationFromNumber} from "../../../services/API/registration_from_number";
import {sendPin} from "../../../services/API/send_pin";
import MaskInput from "react-native-mask-input";
import {mask} from "../../../theme/mask_input";
import {FONTS} from "../../../theme/fonts";
import Modal from "react-native-modal";
import InvalidCodeIcon from "../../../assets/svg/InvalidCodeIcon.svg";
import AppLogo from "../../../components/app-logo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {setNativeProps} from "react-native-reanimated";
import {getUserData} from "../../../services/API/get_user_data";
import {setUserData} from "../../../store/actions/user_data";
import {setFirstAuth} from "../../../store/actions/first_auth";
import CheckBox from '@react-native-community/checkbox';
import AppMetrica from "@gennadysx/react-native-appmetrica";
import UserAgreementModal from "../../../components/user-agreemant-modal";

const CELL_COUNT = 4;
const EnterPinScreen = () => {
    const dispatch = useDispatch();
    const [showPinCode, setShowPinCode] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [phoneNumber, setPhoneNumber] = useState<string>("");

    const [timeRemaining, setTimeRemaining] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [errorMessage, setErrorMessage] = useState(false);
    let intervalId: any;
    const phoneNumber1Ref = useRef<any>(null);
    const phoneNumber2Ref = useRef<any>(null);
    const [phoneNumber1, setPhoneNumber1] = useState<string>("");
    const [phoneNumber2, setPhoneNumber2] = useState<string>("");
    const handleChangePhoneNumber1 = (text: string) => {
        if (text.length === 3) {
            phoneNumber2Ref.current.focus();
        }
        setPhoneNumber1(text);
    };
    const [toggleCheckBox, setToggleCheckBox] = useState(false)

    const handleChangePhoneNumber2 = (text: string) => {
        if (text.length === 0) {
            setPhoneNumber2("");
            phoneNumber1Ref.current.focus(); // Переключение фокуса на первое текстовое поле
        } else {
            setPhoneNumber2(text);
        }
    };
    const startCountdown = () => {
        setIsRunning(true);
        setTimeRemaining(20);

        const intervalId = setInterval(() => {
            setTimeRemaining((prevTime) => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(intervalId);
                    setIsRunning(false);
                    return 0;
                }
            });
        }, 1000);
    };


    useEffect(() => {
        if (isRunning) {
            const intervalId = setInterval(() => {
                if (timeRemaining > 0) {
                    setTimeRemaining((prevTime) => prevTime - 1);
                } else {
                    clearInterval(intervalId);
                    setIsRunning(false);
                }
            }, 1000);

            return () => {
                clearInterval(intervalId);
            };
        }
    }, [isRunning, timeRemaining]);

    useEffect(() => {
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (value.length === 4) {
            sendPin(value, phoneNumber).then(r => {
                if (r.accessToken) {
                    getUserData(r.accessToken).then((r) => {
                        dispatch(setUserData(r));
                        if (!r.email && !r.name) {
                            dispatch(setFirstAuth(true))
                            AppMetrica.reportEvent('Новых пользователей зарегистрировано');
                        }
                    });
                    dispatch(setUserToken(r.accessToken));
                    AsyncStorage.setItem("access", r.accessToken).then();

                } else if (r.error) {
                    setErrorMessage(true);
                    setTimeout(() => {
                        setErrorMessage(false);
                    }, 2500);
                }
            });
        }
    }, [value]);

    const handleRegistrationFromNumber = () => {
        if (phoneNumber.length > 10) {
            registrationFromNumber(phoneNumber).then(r => {
                console.log(r, "registration");
                if (r) {
                    setShowPinCode(true);
                    startCountdown();
                }
            });
        }
    };

    useEffect(() => {
        setPhoneNumber(`+7${phoneNumber1}${phoneNumber2}`);
    }, [phoneNumber1, phoneNumber2]);


    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useEffect(() => {
        if (phoneNumber.length === 1) {
            setPhoneNumber("7");
        }
    }, [phoneNumber]);

    console.log(toggleCheckBox, 'toggleCheckBox')
    return (
        <ScrollView contentContainerStyle={{flex: 1,}}>
            <AppWrapper withPadding={false}>
                <ImageBackground source={require("../../../assets/images/EUROKRAAB.png")}
                                 style={styles.backgroundImage}/>
                <View style={{
                    position: 'absolute',
                    backgroundColor: '#000',
                    opacity: 0.4,
                    width: '100%',
                    height: '100%',
                    left: 0,
                    top: 0
                }}/>
                <View style={styles.container}>
                    <View style={{alignItems: "center", top: Platform.OS === 'ios' ? 40 : 18}}>
                        <AppLogo/>
                    </View>
                    {showPinCode
                        ?
                        <View>
                            <Text style={styles.addNumberTitle}>Введите код</Text>
                            <View style={{position: 'relative', width: '100%'}}>
                                <PinCodeInputs value={value} setValue={setValue}/>

                                {Platform.OS === 'ios' && <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <View style={{width: '22%', height: 2, backgroundColor: '#969697'}}/>
                                    <View style={{width: '22%', height: 2, backgroundColor: '#969697'}}/>
                                    <View style={{width: '22%', height: 2, backgroundColor: '#969697'}}/>
                                    <View style={{width: '22%', height: 2, backgroundColor: '#969697'}}/>
                                </View>}
                            </View>
                            {isRunning ? <View style={{marginTop: 44}}>
                                    <Text style={globalStyles.MobT3}>Следующий код будет доступен через:</Text>
                                    <Text style={[globalStyles.MobT1, {color: "#fff"}]}>{timeRemaining} сек...</Text>
                                </View> :
                                <TouchableOpacity style={[styles.sendCodeAgain]} onPress={handleRegistrationFromNumber}>
                                    <Text style={[globalStyles.MobT3, {color: "#fff"}]}>Запросить код повторно</Text>
                                </TouchableOpacity>}

                            {errorMessage &&
                                <View style={{flexDirection: "row", alignItems: "center", top: 24}}>
                                    <Text style={{marginRight: 13}}>
                                        <InvalidCodeIcon/>
                                    </Text>
                                    <View>
                                        <Text style={{fontSize: 16, color: "#fff", fontFamily: FONTS.Roboto600}}>
                                            Ошибка авторизации:
                                        </Text>
                                        <Text style={globalStyles.MobT3}>
                                            неверный проверочный код
                                        </Text>
                                    </View>
                                </View>}
                        </View>
                        :
                        <View>
                            <Text style={styles.addNumberTitle}>
                                Введите номер телефона:
                            </Text>

                            <View style={{
                                marginTop: 24,
                                flexDirection: "row",
                                borderBottomWidth: 1,
                                borderBottomColor: "#FFFFFF",
                                paddingBottom: Platform.OS === 'ios' ? 24 : 0
                            }}>
                                <Text style={{color: "#fff", fontSize: 29, top: 10, marginRight: 6}}>
                                    +7
                                </Text>
                                <Text style={{color: "#fff", fontSize: 30, top: 6}}>
                                    (
                                </Text>
                                <TextInput
                                    keyboardType={"numeric"}
                                    maxLength={3}
                                    style={{
                                        fontSize: 30,
                                        color: "#fff",
                                        bottom: 6,
                                        top: Platform.OS === 'ios' ? 8 : 0,
                                        width: 65,
                                        textAlign: 'center'
                                    }}
                                    value={phoneNumber1}
                                    onChangeText={handleChangePhoneNumber1}
                                    ref={phoneNumber1Ref}
                                />
                                <Text style={{color: "#fff", fontSize: 30, top: 6}}>
                                    )
                                </Text>
                                <Pressable
                                    style={{width: '45%'}}
                                    onPress={() => {
                                        console.log(111);
                                        if (phoneNumber1.length <= 2) {
                                            phoneNumber1Ref.current.focus();
                                        }
                                    }}
                                    disabled={phoneNumber1.length >= 2}
                                >
                                    <TextInput
                                        editable={phoneNumber1.length >= 2}
                                        keyboardType={"numeric"}
                                        maxLength={7}
                                        style={{
                                            fontSize: 30,
                                            color: "#fff",
                                            width: "100%",
                                            top: Platform.OS === 'ios' ? 8 : 0
                                        }}
                                        value={phoneNumber2}
                                        onChangeText={handleChangePhoneNumber2}
                                        ref={phoneNumber2Ref}
                                        onKeyPress={(e) => {
                                            if (e.nativeEvent.key >= "0" && e.nativeEvent.key <= "9") {
                                                // Если нажата цифра, но первое поле пусто, переключите фокус на первое поле
                                                if (phoneNumber1.length === 0) {
                                                    phoneNumber1Ref.current.focus();
                                                }
                                            }
                                        }}
                                    />
                                </Pressable>
                            </View>
                        </View>

                    }

                    <View style={{width: "100%"}}>
                        <View style={{width: "100%", marginBottom: 16}}>
                            {!showPinCode && <AppButton color={showPinCode ? "#BEBEBE" : "#222"} disabled={!toggleCheckBox}
                                        title={"Далее"}
                                        onPress={() => {
                                            handleRegistrationFromNumber();
                                        }}/>}
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <TouchableOpacity onPress={toggleModal} style={{alignSelf: "center"}}>
                                <Text style={styles.privicy_title}>
                                    Я принимаю условия
                                </Text>
                            </TouchableOpacity>
                            <View style={{borderWidth: 1, borderColor: 'grey', marginLeft: 6}}>
                                <CheckBox
                                    boxType={'square'}
                                    disabled={false}
                                    value={toggleCheckBox}
                                    onValueChange={(newValue) => setToggleCheckBox(newValue)}
                                    tintColor={'#fff'}
                                    onCheckColor={'#fff'}
                                    onFillColor={'grey'}
                                    onTintColor={'#fff'}
                                />
                            </View>

                        </View>
                    </View>
                </View>
            </AppWrapper>

            <UserAgreementModal isVisible={isModalVisible} onClose={()=> setModalVisible(false)}/>

        </ScrollView>

    );
};

export default EnterPinScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        flexWrap: "wrap",
        flex: 1,
        paddingBottom: 20,
        paddingTop: 30,
        paddingHorizontal: 16,
        width: "100%",
    },
    backgroundImage: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: -1,
        opacity: 0.9,
        left: 0,
        backgroundColor: "#000",
        resizeMode: "cover",

    },
    policyText: {
        fontSize: 14,
        color: "#AEAEAE",
    },
    root: {
        flex: 1,
        padding: 20,
    },
    title: {
        textAlign: "center",
        fontSize: 30,
    },
    codeFieldRoot: {
        marginTop: 20,
    },
    cell: {
        width: 50,
        height: 55,
        lineHeight: 38,
        fontSize: 30,
        borderBottomWidth: 1,
        borderBottomColor: "#F6F6F8",
        textAlign: "center",
        color: "#fff",
    },
    focusCell: {
        borderColor: "green",
    },
    phoneNumberInput: {
        width: "100%",
        borderBottomWidth: 1,
        borderBottomColor: "#9C9C9C",
        color: "#fff",
        fontSize: 30,
    },
    system: {
        textAlign: "center",
        fontSize: 24,
        top: -8,
        fontFamily: FONTS.Manrope600,
        color: "#FFFFFF",
    },
    kraab: {
        textAlign: "center",
        fontSize: 34,
        fontFamily: FONTS.Manrope600,
        color: "#FFFFFF",
    },
    addNumberTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "400",
    },
    privicy_title: {
        fontFamily: FONTS.Roboto600,
        color: "#AEAEAE",
        fontSize: 14,
    },
    modalBox: {
        width: "110%",
        backgroundColor: "#fff",
        position: "absolute",
        left: -18,
        height: "90%",
        bottom: 0,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 35,

    },
    sendCodeAgain: {
        marginTop: 44,
        borderBottomWidth: 1,
        borderBottomColor: "#6E6E6E",
        paddingBottom: 6,
        alignSelf: "flex-start",
    },
});
