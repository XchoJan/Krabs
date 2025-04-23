import React, {useEffect, useRef, useState} from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView, ScrollView, FlatList, ActivityIndicator, Pressable, Platform,
} from "react-native";
import AppWrapper from "../../../components/app-wrapper";
import SubscribeIcon from "../../../assets/svg/SubscribeIcon.svg";
import EditIcon from "../../../assets/svg/EditIcon.svg";
import {globalStyles, SCREEN_HEIGHT} from "../../../theme/globalStyles";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import PinCodeInputs from "../../../components/pin-code-inputs";
import {useIsFocused} from "@react-navigation/native";
import AppButton from "../../../components/app-button";
import {useDispatch, useSelector} from "react-redux";
import {getUserData} from "../../../services/API/get_user_data";
import {setUserToken} from "../../../store/actions/user_token";
import {setUserData} from "../../../store/actions/user_data";
import {FONTS} from "../../../theme/fonts";
import {removeAuth} from "../../../services/AsyncStorageServices";
import {
    deleteUserAccount, getFieldOfActivity,
    updateUserNameAndEmail,
    updateUserPhone,
    updateUserPhoto,
} from "../../../services/API/update_user_data";

import CancelIcon from "../../../assets/svg/CancelIcon.svg";
import AcceptIcon from "../../../assets/svg/AcceptIcon.svg";
import CustumBottomSheet from "../../../components/custum-bottom-sheet";
import ImagePicker from "react-native-image-crop-picker";
import BalanceHistoryItem from "../../../components/balance-history-item";
import {RefreshToken} from "../../../services/API/refresh_token";
import {getBonusesHistory} from "../../../services/API/api-scanner";
import moment from "moment/moment";
import {registrationFromNumber} from "../../../services/API/registration_from_number";
import {sendPinFromUpdateAccountPhone} from "../../../services/API/send_pin";
import {setActiveImage} from "../../../store/actions/acitve_image";
import CancelButton from "../../../components/cancel-button";
import {setFirstAuth} from "../../../store/actions/first_auth";
import DropDownPicker from "react-native-dropdown-picker";
import Onboarding from "../../../components/onboarding";
import {setShowTabBar} from "../../../store/actions/show_tab_bar";
import Modal from "react-native-modal";
import AppMetrica from "@gennadysx/react-native-appmetrica";
import UserAgreementModal from "../../../components/user-agreemant-modal";

const PersonalAreaScreen = () => {
    const dispatch = useDispatch();
    const tokenFromReducer = useSelector((store: any) => store.user_token.user_token);
    const userDataFromReducer = useSelector((store: any) => store.user_data.user_data);
    const [editing, setEditing] = useState<boolean>(false);
    const [fio, setFio] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [showChangeNumberBox, setShowChangeNumberBox] = useState<boolean>(false);
    const [value, setValue] = useState("");
    const [pinCodeIsSent, setPinCodeIsSent] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [pinCodeError, setPinCodeError] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [showLogoutBox, setShowLogoutBox] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDeleteProfile, setShowDeleteProfile] = useState(false);
    const [accountDeleted, setAccountDeleted] = useState(false);

    const phoneNumber1Ref = useRef<any>(null);
    const phoneNumber2Ref = useRef<any>(null);
    const [phoneNumber1, setPhoneNumber1] = useState<string>("");
    const [phoneNumber2, setPhoneNumber2] = useState<string>("");

    const [newPhoneNumber, setNewPhoneNumber] = useState("");

    const [phoneError, setPhoneError] = useState(false)
    const firstAuth = useSelector((store: any) => store?.first_auth?.first_auth);

    const [showFioError, setShowFioError] = useState(false)
    const [showEmailError, setShowEmailError] = useState(false)
    const [showNotValidEmailError, setShowNotValidEmailError] = useState(false)

    const [fieldOfActivity, setFieldOfActivity] = useState<any>([])

    const [open, setOpen] = useState(false);
    const [selectedFieldOfActivity, setSelectedFieldOfActivity] = useState<any>(null);
    const [showOnboarding, setShowOnboarding] = useState(false)
    const [isModalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (firstAuth) {
            setEditing(true)
            setShowOnboarding(true)
            dispatch(setShowTabBar(false))
            setTimeout(() => {
                dispatch(setFirstAuth(false))
            }, 4500)
        }
    }, [firstAuth]);


    function formatPhoneNumber(phoneNumber: any) {
        phoneNumber = phoneNumber?.replace(/\D/g, "");
        if (phoneNumber?.length !== 11) {
            return "Неверный формат номера";
        }
        return `+${phoneNumber.charAt(0)} (${phoneNumber.substr(1, 3)}) ${phoneNumber.substr(4, 3)}-${phoneNumber.substr(7, 2)}-${phoneNumber.substr(9, 2)}`;
    }

    const formattedPhoneNumber = formatPhoneNumber(userDataFromReducer?.phone);

    const handleChangePhoneNumber1 = (text: string) => {
        if (text.length === 3) {
            phoneNumber2Ref.current.focus();
        }
        setPhoneNumber1(text);
    };

    const handleChangePhoneNumber2 = (text: string) => {
        if (text.length === 0) {
            setPhoneNumber2("");
            phoneNumber1Ref.current.focus(); // Переключение фокуса на первое текстовое поле
        } else {
            setPhoneNumber2(text);
        }
    };

    const pickImage = async () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            cropperCircleOverlay: true,
            freeStyleCropEnabled: true,
        }).then(image => {
            console.log(image, "image from function");
            setSelectedImage({
                name: `IMG_` + Date.now() + `.JPG`,
                type: image?.mime,
                uri: image.path,
                id: Date.now(),
                lastModified: Date.now(),
            });
        });
    };

    useEffect(() => {
        if (value.length === 4) {
            sendPinFromUpdateAccountPhone(tokenFromReducer, newPhoneNumber, value).then(r => {
                console.log(r, "update phone R");
                if (r.statusCode === 400) {
                    setPinCodeError(true);
                    setTimeout(() => {
                        setPinCodeError(false);
                    }, 2500);
                }
                if (r === true) {
                    getUserData(tokenFromReducer).then((r) => {
                        dispatch(setUserData(r));
                    });
                    setPinCodeError(true);
                    setShowChangeNumberBox(false);
                    setPinCodeIsSent(false);
                    setPinCodeError(false);
                    setNewPhoneNumber("");
                    setValue("");
                }
            });
        }
    }, [value]);

    useEffect(() => {
        if (!isFocused) {
            setShowChangeNumberBox(false);
        }
    }, [!isFocused]);

    useEffect(() => {
        getUserData(tokenFromReducer).then((r) => {
            console.log(r, "RESPONSE GET USER DATA");
            if (r.statusCode === 401) {
                RefreshToken(tokenFromReducer).then((r) => {
                    console.log("REFRESH TOKEN RESPONSE");
                });
            }
            console.log(r, "RRRRRRRrr");
            dispatch(setUserData(r));
        });
    }, [tokenFromReducer]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 2500);
    }, []);

    useEffect(() => {
        if (userDataFromReducer) {
            setFio(userDataFromReducer?.name);
            setEmail(userDataFromReducer?.email);
            setPhoneNumber(userDataFromReducer?.phone);
        }
    }, [userDataFromReducer]);

    const handleLogOut = async () => {
        dispatch(setUserToken(""));
        dispatch(setUserData([]));
        await removeAuth();
    };

    const handleUpdateUserFioAndEmail = () => {
        if (!fio?.length) {
            setShowFioError(true)
            setTimeout(() => {
                setShowFioError(false)
            }, 2550)
            return
        }
        if (!email?.length) {
            setShowEmailError(true)
            setTimeout(() => {
                setShowEmailError(false)
            }, 2550)
            return
        }

        updateUserNameAndEmail(fio, email, selectedFieldOfActivity, tokenFromReducer).then(r => {
            console.log(r, 'UPDATED')
            if (r?.errorsMessages && r?.errorsMessages[0]?.message === 'email must be an email') {
                setShowNotValidEmailError(true)
                setTimeout(() => {
                    setShowNotValidEmailError(false)
                }, 2550)
                return
            }

            setEditing(false);

            getUserData(tokenFromReducer).then((r) => {
                dispatch(setUserData(r));
            });
        });

        if (selectedImage) {
            updateUserPhoto(selectedImage, tokenFromReducer).then(r => {
                // console.log(r, "updateUserPhoto res");
                if (r) {
                    getUserData(tokenFromReducer).then((r) => {
                        dispatch(setUserData(r));
                        setSelectedImage(null);
                    });
                }
            });
        }
    };

    const deleteUser = () => {
        deleteUserAccount(tokenFromReducer).then((r) => {
            //console.log(r, 'delete account response');
            if (r === true) {
                setAccountDeleted(true);
            }
        });
    };

    useEffect(() => {
        setNewPhoneNumber(`+7${phoneNumber1}${phoneNumber2}`);
    }, [phoneNumber1, phoneNumber2]);

    const handleChangePhoneNumber = () => {
        if (newPhoneNumber.length > 10) {
            updateUserPhone(tokenFromReducer, newPhoneNumber).then(r => {
                console.log(r, "change phone number");
                if (r === true) {
                    setPinCodeIsSent(true);
                } else if (r.message === 'Phone number already in use') {
                    setPhoneError(true)
                    setTimeout(() => {
                        setPhoneError(false)
                    }, 3000)
                }
            });
        }
    };

    useEffect(() => {
        if (showChangeNumberBox) {
            dispatch(setActiveImage(true))
        } else {
            dispatch(setActiveImage(false))
        }
    }, [showChangeNumberBox]);


    useEffect(() => {
        let data: any = []

        getFieldOfActivity(tokenFromReducer).then((r) => {
            console.log(r, 'SFERI')
            r.map((item: string) => {
                data.push({label: item, id: item, value: item})
            })
            setFieldOfActivity(data)
        })
    }, []);

    const onPressStart = ()=> {
        dispatch(setShowTabBar(true))
        setShowOnboarding(false)

    }

    useEffect(() => {
        // Отправка события при открытии профиля
        AppMetrica.reportEvent('Входы в профиль');
    }, []);

    const renderProfileStatus = () => {
        if (!editing && !showDeleteProfile) {
            return (
                <View style={{flex: 1}}>
                    <View style={styles.userDataBox}>
                        <View>
                            {userDataFromReducer?.name || userDataFromReducer?.email ?
                                <View>
                                    <Text style={[globalStyles.MobT1, {color: "#222222", marginBottom: 12}]}>
                                        {userDataFromReducer?.name}
                                    </Text>
                                    <Text style={[globalStyles.MobT3, {marginBottom: 8, color: "#757575"}]}>
                                        {userDataFromReducer?.email}
                                    </Text>
                                </View> : null}

                            <Text style={[globalStyles.MobT3, {color: "#757575"}]}>
                                {formattedPhoneNumber}
                            </Text>

                        </View>
                        <TouchableOpacity style={{right: 14}} onPress={() => {
                            setEditing(true);
                        }}>
                            <EditIcon/>
                        </TouchableOpacity>
                    </View>
                    <View style={{marginTop: 224}}>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(true);
                        }} activeOpacity={0.4} style={styles.exitBox}>
                            <Text style={[globalStyles.MobT3]}>
                                Пользовательское соглашение
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            setShowLogoutBox(true);
                        }} activeOpacity={0.4} style={styles.exitBox}>
                            <Text style={[globalStyles.MobT3]}>
                                Выйти из аккаунта
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        } else if (editing && !showDeleteProfile) {
            return (
                <View style={styles.editDataBox}>
                    <View style={{flex: 1}}>

                        <View style={styles.editInput}>
                            <TextInput
                                placeholder={"ФИО"}
                                placeholderTextColor={"#AEAEAE"}
                                style={{fontSize: 20, color: "#000", alignItems: 'center',}}
                                value={fio}
                                onChangeText={setFio}
                            />

                        </View>
                        {showFioError && <Text style={styles.errorMessage}>
                            Поле ФИО необоходимо заполнить
                        </Text>}
                        <View style={styles.editInput}>
                            <TextInput
                                placeholder={"Email*"}
                                placeholderTextColor={"#AEAEAE"}
                                style={{fontSize: 20, color: "#000"}}
                                value={email}
                                onChangeText={setEmail}
                            />

                        </View>
                        <DropDownPicker
                            zIndex={999999}
                            containerStyle={{borderWidth: 0,}}
                            selectedItemContainerStyle={{borderWidth: 0,}}
                            dropDownContainerStyle={{
                                borderWidth: 1,
                                borderColor: "#CECECE",

                            }}
                            labelStyle={{fontSize: 20, color: "#000", left: 8}}
                            style={{borderWidth: 1, borderColor: "#CECECE", zIndex: 999999}}
                            showArrowIcon={true}
                            open={open}
                            value={selectedFieldOfActivity}
                            items={fieldOfActivity}
                            setOpen={setOpen}
                            setValue={setSelectedFieldOfActivity}
                            setItems={setFieldOfActivity}
                            placeholder={"Выберите Сферу деятельности"}
                            listMode={'SCROLLVIEW'}

                        />

                        {showEmailError && <Text style={styles.errorMessage}>
                            Поле Email необоходимо заполнить
                        </Text>}
                        {showNotValidEmailError && <Text style={styles.errorMessage}>
                            Введите корректный Email адрес
                        </Text>}
                        <TouchableOpacity style={styles.changeNumberBtn} onPress={() => {
                            setShowChangeNumberBox(true);
                        }}>
                            <Text style={styles.changeNumberBtnText}>
                                Изменить номер
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {!open && <View style={{top: '10%'}}>
                        <TouchableOpacity
                            style={[styles.saveBtn]}
                            onPress={handleUpdateUserFioAndEmail}>
                            <Text style={styles.saveBtnTitle}>
                                Сохранить
                            </Text>
                        </TouchableOpacity>
                        <CancelButton black onPress={() => {
                            setEditing(false)
                        }}/>
                    </View>}

                </View>
            );
        } else if (showDeleteProfile && !editing) {
            return (
                !accountDeleted ? <View style={{flex: 1, alignItems: "center"}}>
                        <Text style={globalStyles.MobH3}>
                            Удаление аккаунта
                        </Text>
                        <Text style={styles.deleteProfileDescription}>
                            удаление аккаунта означает, что вся информация о сканированиях и бонусах будет удалена
                        </Text>
                        <View style={styles.buttons_box}>
                            <TouchableOpacity onPress={() => {
                                deleteUser();
                            }} style={styles.buttons}>
                                <AcceptIcon/>
                                <Text style={styles.deleteBackButtons}>Удалить</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowDeleteProfile(false);
                                    setEditing(true);
                                }}
                                style={styles.buttons}>
                                <CancelIcon/>
                                <Text style={styles.deleteBackButtons}>Назад</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    :
                    <View style={{alignItems: "center"}}>
                        <Text style={globalStyles.MobH3}>
                            Профиль
                        </Text>
                        <Text style={globalStyles.MobH3}>
                            успешно удален
                        </Text>
                        <View style={styles.buttons_box}>
                            <TouchableOpacity
                                onPress={() => {
                                    setAccountDeleted(false);
                                    setShowDeleteProfile(false);
                                    setEditing(true);
                                    handleLogOut().then();
                                }}
                                style={styles.buttons}>
                                <AcceptIcon/>
                                <Text style={{marginLeft: 8, color: '#000'}}>Назад</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
            );
        }
    };

    return (
        <View style={{flex: 1, width: '100%'}}>
            {loading ? <View style={{height: '100%', alignItems: 'center', justifyContent: 'center'}}>
                    <ActivityIndicator size={"large"}/>

                </View> :
                <KeyboardAwareScrollView
                    style={{backgroundColor: '#fff'}}
                    scrollEnabled={!(showLogoutBox || showChangeNumberBox)}
                    contentContainerStyle={(showLogoutBox || showChangeNumberBox) ? {
                        flex: 1,
                        backgroundColor: '#fff'
                    } : null}
                >

                    {editing && firstAuth ? <View style={{
                        width: '90%',
                        alignSelf: 'center',
                        height: 48,
                        backgroundColor: 'grey',
                        position: 'absolute',
                        bottom: 20,
                        zIndex: 9999,
                        borderRadius: 16,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Text style={{color: '#fff', fontSize: 16}}>
                            Баллы за регистрацию начислены
                        </Text>
                    </View> : null}

                    <View style={{flex: 1}}>
                        <View style={{flex: 1,}}>
                            <StatusBar translucent={true} backgroundColor={"transparent"} barStyle={"dark-content"}/>
                            <View style={[styles.profile_image_container, {height: SCREEN_HEIGHT * 0.4}]}>
                                {!userDataFromReducer?.photo && !selectedImage ? (
                                    <Image
                                        style={[
                                            styles.profile_image,
                                            editing && {opacity: 0.8, backgroundColor: "#000"},
                                        ]}
                                        source={require("../../../assets/images/ProfileDefaultImage.png")}/>
                                ) : (
                                    <Image
                                        style={[
                                            styles.profile_image,
                                            editing && {opacity: 0.8, backgroundColor: "#000"},
                                        ]}
                                        source={{uri: selectedImage?.uri || userDataFromReducer?.photo}}
                                    />
                                )}
                                {editing &&
                                    <TouchableOpacity
                                        onPress={pickImage}
                                        style={[styles.editIconBox, showChangeNumberBox && {zIndex: 0}]}>
                                        <EditIcon/>
                                    </TouchableOpacity>}

                                {editing && <View
                                    style={styles.editingView}/>}

                                {editing && !showChangeNumberBox ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowDeleteProfile(true);
                                            setEditing(false);
                                        }}
                                        style={styles.delete_profile_box}>
                                        <Text style={styles.deleteProfileTitle}>
                                            удалить профиль
                                        </Text>
                                    </TouchableOpacity> : null}
                            </View>
                            <View style={styles.bottom_content}>
                                {renderProfileStatus()}
                            </View>
                        </View>




                        {showChangeNumberBox &&
                            <View style={styles.changeNumberBox}>
                                <View style={{height: '15%'}}>
                                    <Pressable
                                        onPress={() => {
                                            setShowChangeNumberBox(false)
                                            setPinCodeIsSent(false)
                                            setPhoneNumber1('')
                                            setPhoneNumber2('')
                                        }}
                                        style={styles.closeContainerBox}/>
                                </View>
                                <View style={{height: '20%'}}>
                                    {!pinCodeIsSent ?
                                        <View>
                                            <Text style={styles.addNumberTitle}>
                                                Введите новый номер телефона:
                                            </Text>

                                            <View style={{marginTop: 24, flexDirection: "row", paddingBottom: 6}}>
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
                                                        width: 65,
                                                        top: Platform.OS === 'ios' ? 10 : 0,
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
                                                    style={{width: "45%"}}
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
                                                            bottom: 6,
                                                            width: "100%",
                                                            top: Platform.OS === 'ios' ? 10 : 0

                                                        }}
                                                        value={phoneNumber2}
                                                        onChangeText={handleChangePhoneNumber2}
                                                        ref={phoneNumber2Ref}
                                                        onKeyPress={(e) => {
                                                            if (e.nativeEvent.key >= "0" && e.nativeEvent.key <= "9") {
                                                                if (phoneNumber1.length === 0) {
                                                                    phoneNumber1Ref.current.focus();
                                                                }
                                                            }
                                                        }}
                                                    />
                                                </Pressable>
                                            </View>
                                            <View style={{
                                                borderBottomWidth: 1,
                                                borderBottomColor: "#FFFFFF",
                                                marginTop: 8
                                            }}/>
                                            {phoneError &&
                                                <Text style={{zIndex: 9999, fontSize: 16}}>
                                                    Номер уже используется
                                                </Text>}

                                        </View>
                                        :
                                        <View>
                                            <Text style={[globalStyles.MobT1, {color: "#fff"}]}>Введите код</Text>
                                            <PinCodeInputs value={value} setValue={(pinValue: any) => {
                                                setValue(pinValue);
                                                setPinCodeError(false);
                                            }}/>

                                            {Platform.OS === 'ios' && <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                                <View style={{width: '22%', height: 2, backgroundColor: '#969697'}}/>
                                                <View style={{width: '22%', height: 2, backgroundColor: '#969697'}}/>
                                                <View style={{width: '22%', height: 2, backgroundColor: '#969697'}}/>
                                                <View style={{width: '22%', height: 2, backgroundColor: '#969697'}}/>
                                            </View>}

                                            <TouchableOpacity style={[styles.sendCodeAgain]}
                                                              onPress={handleChangePhoneNumber}>
                                                <Text style={[globalStyles.MobT3, {color: "#fff"}]}>Запросить код
                                                    повторно</Text>
                                            </TouchableOpacity>
                                            {pinCodeError &&
                                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                                    <Text style={{marginRight: 8, top: 8}}>
                                                        <CancelIcon/>
                                                    </Text>
                                                    <Text style={[globalStyles.MobT3, {marginTop: 24}]}>
                                                        Ошибка авторизации:{"\n"}
                                                        неверный проверочный код
                                                    </Text>
                                                </View>
                                            }
                                        </View>
                                    }
                                </View>

                                <View style={{bottom: Platform.OS === 'ios' ? 120 : 20}}>
                                    <AppButton onPress={handleChangePhoneNumber} title={"Далее"}/>
                                    <View style={{marginTop: 14}}>
                                        <CancelButton onPress={() => {
                                            setShowChangeNumberBox(false)
                                            setPhoneNumber1('')
                                            setPhoneNumber2('')
                                            setPinCodeIsSent(false)
                                        }}/>

                                    </View>
                                </View>


                            </View>}

                        {showLogoutBox &&
                            <View style={styles.logOutContainer}>
                                <View style={{alignItems: "center", justifyContent: "center", flex: 1}}>
                                    <Text style={[globalStyles.MobT1, {
                                        zIndex: 999999,
                                        color: "#fff",
                                        textAlign: "center"
                                    }]}>
                                        Вы уверены,{"\n"}
                                        что хотите выйти?
                                    </Text>
                                    <View style={styles.buttons_box}>
                                        <TouchableOpacity style={styles.buttons} onPress={() => {
                                            handleLogOut().then();
                                            setShowLogoutBox(false);
                                        }}>
                                            <View>
                                                <AcceptIcon/>
                                            </View>
                                            <Text style={{fontSize: 16, color: "#fff", marginLeft: 6}}>
                                                Выйти
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.buttons} onPress={() => {
                                            setShowLogoutBox(false);
                                        }}>
                                            <View>
                                                <CancelIcon/>
                                            </View>
                                            <Text style={{fontSize: 16, color: "#fff", marginLeft: 6}}>
                                                Отменить
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>}
                    </View>
                </KeyboardAwareScrollView>}

            {showOnboarding &&
                <View style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'red',
                    position: 'absolute',
                    zIndex: 99999,
                    top: 0,
                    left: 0,
                    flex: 1
                }}>
                   <Onboarding onPressStart={onPressStart}/>
                </View>
            }

            <UserAgreementModal isVisible={isModalVisible} onClose={()=> setModalVisible(false)}/>


            {/*<Modal isVisible={isModalVisible} onSwipeCancel={() => {*/}
            {/*    setModalVisible(false);*/}
            {/*}}>*/}
            {/*    <View style={styles.modalBox}>*/}
            {/*        <View style={{flexDirection: "row", justifyContent: "space-between"}}>*/}
            {/*            <Text style={[globalStyles.MobH1, {color: "#090808"}]}>Пользовательское соглашение</Text>*/}
            {/*            <TouchableOpacity onPress={() => {*/}
            {/*                setModalVisible(false);*/}
            {/*            }}>*/}
            {/*                <Text style={{fontSize: 18, color: "#000", fontWeight: "600"}}>*/}
            {/*                    X*/}
            {/*                </Text>*/}
            {/*            </TouchableOpacity>*/}
            {/*        </View>*/}
            {/*        /!*<Button title="Hide modal" onPress={toggleModal} />*!/*/}
            {/*        <ScrollView>*/}
            {/*            <Text style={[globalStyles.MobT3, {color: "#000", marginTop: 35}]}>*/}
            {/*                Пользовательское соглашение (далее "Соглашение") – это юридический документ, регулирующий*/}
            {/*                отношения между оператором (владельцем) сайта или приложения (далее "Сайт" или "Приложение")*/}
            {/*                и*/}
            {/*                его пользователями. Прежде чем использовать Сайт или Приложение, пожалуйста, внимательно*/}
            {/*                прочитайте это Соглашение, так как использование Сайта или Приложения означает ваше полное и*/}
            {/*                безоговорочное согласие с условиями Соглашения.*/}

            {/*                Пользовательское соглашение (далее "Соглашение") – это юридический документ, регулирующий*/}
            {/*                отношения между оператором (владельцем) сайта или приложения (далее "Сайт" или "Приложение")*/}
            {/*                и*/}
            {/*                его пользователями. Прежде чем использовать Сайт или Приложение, пожалуйста, внимательно*/}
            {/*                прочитайте это Соглашение, так как использование Сайта или Приложения означает ваше полное и*/}
            {/*                безоговорочное согласие с условиями Соглашения.*/}
            {/*            </Text>*/}
            {/*        </ScrollView>*/}
            {/*    </View>*/}
            {/*</Modal>*/}

        </View>
    );
};

export default PersonalAreaScreen;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1
    },
    profile_image_container: {
        width: "100%",

    },
    editIconBox: {
        position: "absolute",
        top: "40%",
        zIndex: 999,
        left: "46%",
    },
    profile_image: {
        width: "100%",
        height: "95%",
        resizeMode: "cover",
    },
    bottom_content: {
        width: "100%",
        flex: 1,
        backgroundColor: "#fff",
        top: -33,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 32,
    },
    balance_box: {
        width: "100%",
        backgroundColor: "#F6F6F8",
        height: 114,
        marginTop: 32,
        borderRadius: 16,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        alignItems: "center",
        marginBottom: 24,
    },
    userDataBox: {
        flexDirection: "row",
        justifyContent: "space-between",
        height: '40%',
        flex: 1

    },
    editDataBox: {
        height: '100%',
    },
    editInput: {
        borderWidth: 1,
        borderColor: "#CECECE",
        borderRadius: 12,
        height: 54,
        marginBottom: 12,
        paddingLeft: 16,
        justifyContent: 'center'
    },
    changeNumberBtn: {
        marginTop: 24,
        marginBottom: 32,
    },
    changeNumberBtnText: {
        color: "#AEAEAE",
        fontSize: 16,
        fontWeight: "600",
        paddingBottom: 3,
        borderBottomWidth: 1,
        borderBottomColor: "#AEAEAE",
        alignSelf: "flex-start",
    },
    changeNumberBox: {
        width: "100%",
        height: "100%",
        position: "absolute",
        left: 0,
        top: 0,
        backgroundColor: "#000",
        opacity: 0.9,
        justifyContent: "space-between",
        paddingHorizontal: 16,

    },
    changeNumberInput: {
        width: "100%",
        borderBottomWidth: 1,
        borderColor: "#fff",
        marginTop: 38,
    },
    errorMessage: {
        color: 'red',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8
    },
    saveBtn: {
        width: "100%",
        height: 71,
        backgroundColor: "#222222",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        marginBottom: 8
    },
    saveBtnTitle: {
        fontWeight: "600",
        fontSize: 20,
        lineHeight: 24,
        color: "#F8F8F8",
    },
    deleteProfileTitle: {
        fontSize: 16,
        color: "#BEBEBE",
        fontFamily: FONTS.Roboto400,
        fontWeight: "600",
    },
    exitBox: {
        borderBottomWidth: 1,
        borderBottomColor: "#AEAEAE",
        paddingBottom: 4,
        marginTop: 18,
        alignItems: 'flex-start',
        alignSelf: 'flex-start'
    },
    editingView: {
        backgroundColor: "#000",
        width: "100%",
        height: "100%",
        top: 0,
        position: "absolute",
        opacity: 0.6,

    },
    delete_profile_box: {
        position: "absolute",
        zIndex: 999,
        top: "70%",
        right: 20,
        borderBottomColor: "#BEBEBE",
        borderBottomWidth: 1,
        paddingBottom: 6,
    },
    logOutContainer: {
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        opacity: 0.8,
        zIndex: 99999,
        position: "absolute",
        top: 0,
        left: 0,
    },
    buttons: {
        flexDirection: "row",
        alignItems: "center",
    },
    buttons_box: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "70%",
        marginTop: 54,
    },
    deleteProfileDescription: {
        fontFamily: FONTS.Roboto600,
        fontSize: 16,
        color: "#BEBEBE",
        textAlign: "center",
        marginTop: 12,
    },
    addNumberTitle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "400",
    },
    sendCodeAgain: {
        marginTop: 44,
        borderBottomWidth: 1,
        borderBottomColor: "#6E6E6E",
        paddingBottom: 6,
        alignSelf: "flex-start",
    },
    deleteBackButtons: {
        marginLeft: 9,
        fontFamily: FONTS.Roboto400,
        color: "#000",
        fontSize: 16,
        lineHeight: 20,
    },
    closeContainerBox: {
        height: '100%',
        top: 0,
        position: 'absolute',
        zIndex: 99999,
        width: '100%'
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
});
