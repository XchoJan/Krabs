import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, Linking, TouchableOpacity, ScrollView, FlatList, Image} from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";
import GoBackIcon from "../../../assets/svg/GoBackIcon.svg";
import AddPhotoIcon from "../../../assets/svg/addPhotoIcon.svg";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {setShowTabBar} from "../../../store/actions/show_tab_bar";
import {sendScannedQr} from "../../../services/API/api-scanner";
import QrResaultModal from "../../../components/qr-resault-modal";
import Modal from "react-native-modal";
import {globalStyles} from "../../../theme/globalStyles";
import LabelInput from "../../../components/label-input";
import AppButton from "../../../components/app-button";
import {FONTS} from "../../../theme/fonts";
import {getProductNames, sentCounterfeit, sentCounterfeitPhoto} from "../../../services/API/sent-counterfeit";
import ImagePicker from "react-native-image-crop-picker";
import {getUserData} from "../../../services/API/get_user_data";
import {setUserData} from "../../../store/actions/user_data";
import ScannerSvg from '../../../assets/svg/ScanSvg.svg'
import CancelButton from "../../../components/cancel-button";
import GalleryIcon from '../../../assets/svg/GalleryIcon.svg'
import CameraIcon from '../../../assets/svg/CameraIcon.svg'
import DropDownPicker from "react-native-dropdown-picker";


const QrScannerScreen = () => {
    const navigation: any = useNavigation();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const tokenFromReducer = useSelector((store: any) => store.user_token.user_token);
    const [isModalVisible, setModalVisible] = useState(false);
    const [scannerStatus, setScannerStatus] = useState(0);

    const [data, setData] = useState([]);
    const [showCounterfeitModal, setShowCounterfeitModal] = useState<boolean>(false);


    const [cityName, setCityName] = useState<string>("");
    const [comments, setComments] = useState<string>("");
    const [photo, setPhoto] = useState(null);

    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [errorModalVisible, setErrorModalVisible] = useState(false);

    const [qrResponse, setQrResponse] = useState([]);

    const [images, setImages] = useState<any>([]);

    const [scannedResult, setScannedResult] = useState('')

    const [showPickerModal, setShowPickerModal] = useState(false)

    const [productNames, setProductNames] = useState([])

    const [category, setCategory] = useState<any>(null);

    const [open, setOpen] = useState(false)

    const [items, setItems] = useState<any>([])

    const [cityError, setCityError] = useState(false)
    const [commentError, setCommentError] = useState(false)

    console.log(successModalVisible, 'successModalVisible')

    useEffect(() => {
        let items: any = []
        getProductNames(tokenFromReducer).then((r) => {
            r.map((item: any) => {
                items.push({value: item.name, label: item.name, id: item.id})
            })
            setProductNames(items)
        })
    }, []);


    const pickImage = async () => {
        let imagesFromPicker: any = [];
        ImagePicker.openPicker({
            width: 550,
            height: 650,
            multiple: true,
            mediaType: "photo",
            maxFiles: 10,
            compressImageMaxHeight: 550,
            compressImageMaxWidth: 650,
        }).then((selectedImages) => {
            // console.log(selectedImages, "images from function");
            selectedImages.forEach((item) => {
                imagesFromPicker.push({
                    name: `IMG_${Date.now()}.JPG`,
                    type: item?.mime,
                    uri: item.path,
                    id: Date.now() + Math.floor(Math.random() * 10000),
                    lastModified: Date.now(),
                });
            });
            setImages((prevImages: any) => [...prevImages, ...imagesFromPicker]);
            setShowPickerModal(false)
        });
    };


    const pickCameraImage = async () => {
        ImagePicker.openCamera({
            width: 550,
            height: 650,
            compressImageMaxHeight: 550,
            compressImageMaxWidth: 650,
        }).then((selectedImages) => {
            // Добавим данные изображения из камеры к существующему массиву
            if (selectedImages) {
                let imageFromCamera = {
                    name: `IMG_${Date.now()}.JPG`,
                    type: selectedImages?.mime,
                    uri: selectedImages.path,
                    id: Date.now() + Math.floor(Math.random() * 10000),
                    lastModified: selectedImages.modificationDate || Date.now(),
                };

                setImages((prevImages: any) => [...prevImages, imageFromCamera]);
            }

            // Остальной код, если необходимо
            setShowPickerModal(false);
        });
    };

    const onSuccess = (e: any) => {
        const scannedData = e?.data;
        console.log(scannedData, "scannedData");
        setScannedResult(scannedData)
    };
    // console.log(qrResponse, "QR RESPONSE STATE");

    const sendQrResult = () => {
        sendScannedQr(tokenFromReducer, scannedResult).then((r) => {
            if (!scannedResult) {
                setScannerStatus(4)
                setModalVisible(true)
                return
            }
            console.log(r, 'R')
            if (r.bonus) {
                setData(r);
                setScannerStatus(1)
                setModalVisible(true)
                getUserData(tokenFromReducer).then((r) => {
                    dispatch(setUserData(r));
                });

                setTimeout(()=>{
                    setScannerStatus(0)
                    setModalVisible(false)
                }, 2700)
            } else if (r.statusCode === 400) {
                setScannerStatus(2);
                setModalVisible(true);
                setQrResponse(r);
            } else if (r.statusCode === 404) {
                setScannerStatus(3);
                setModalVisible(true);
                setQrResponse(r);
            }
        });
    }

    const handleSentCounterfeitMessage = () => {
        let data = {
            "product": category,
            "city": cityName,
            "text": comments,
        };

        sentCounterfeit(data, tokenFromReducer).then((r) => {
            console.log(r, 'RESPONSE FROM SEND')
            if (r.status === 'Pending') {
                setShowCounterfeitModal(false);
                setTimeout(()=>{
                    setSuccessModalVisible(true)
                    setScannedResult('')
                }, 750)
            } else {
                setErrorModalVisible(true)
                if (!cityName){
                    setCityError(true)
                    setTimeout(()=>{
                        setCityError(false)
                    }, 4500)
                    return
                }
                if (!comments){
                    setCommentError(true)
                    setTimeout(()=>{
                        setCommentError(false)
                    }, 4500)
                    return
                }
                return
            }
            sentCounterfeitPhoto(images, tokenFromReducer, r.id).then(r => {
                console.log(r, "send photos respnse");
            });
            setCategory("");
            setCityName("");
            setComments("");
            if (r?.id) {
                setImages([]);
            }
        });
    };

    useEffect(() => {
        if (isFocused) {
            dispatch(setShowTabBar(false));
        } else {
            dispatch(setShowTabBar(true));
        }
    }, [isFocused]);

    const removeImage = (imageId: any) => {
        const updatedImages = images.filter((image: any) => image.id !== imageId);
        setImages(updatedImages);
    };

    const renderPickedImages = ({item}: any) => {
        return (
            <View>
                <Image
                    style={{width: 150, height: 150, marginHorizontal: 6, borderRadius: 6}}
                    key={item.id}
                    source={{uri: item.uri}}
                />
                <TouchableOpacity
                    style={styles.xMarkBox}
                    onPress={() => removeImage(item.id)}
                >
                    <Text style={{color: "#fff", fontSize: 16}}>✕</Text>
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={{flex: 1, backgroundColor: "#130D0F", width: "100%"}}>
            <TouchableOpacity onPress={() => navigation.navigate('ShowRoomsNavigator')}
                              style={{position: 'absolute', top: '8%', left: 16, zIndex: 9999}}>
                <GoBackIcon/>
            </TouchableOpacity>
            {!showCounterfeitModal &&
             <QRCodeScanner
                onRead={onSuccess}
                topContent={<View/>}
                reactivateTimeout={4000}
                reactivate={true}
                showMarker={true}
                customMarker={<View style={styles.qrBorderBox}>
                    <View style={{height: 250, width: 250, top: -55}}>
                        <View style={styles.qrLeftBorder}></View>
                        <View style={styles.qrRightBorder}></View>
                        <View style={styles.qrBottomBorder}></View>
                        <View style={styles.qrTopBorder}></View>
                    </View>
                </View>}
            />}
            <TouchableOpacity onPress={sendQrResult} style={{position: 'absolute', top: '87%', alignSelf: 'center', zIndex: 9999}}>
                <ScannerSvg/>
            </TouchableOpacity>

            <QrResaultModal
                status={scannerStatus}
                data={data}
                isVisible={isModalVisible}
                onCloseModal={() => {
                    setModalVisible(false)
                    setScannedResult('')
                }}
                handleShowCounterfeitModal={() => {
                    setModalVisible(false);
                    setTimeout(()=>{
                        setShowCounterfeitModal(true);
                    }, 750)
                }}
                onPressCancelButton={() => {
                    setModalVisible(false)
                    setScannedResult('')
                }}
            />

            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                animationOutTiming={400}
                isVisible={showCounterfeitModal}
                style={{margin: 0}}
                useNativeDriver={true}
                hideModalContentWhileAnimating={true}
            >
                <View style={styles.modalBox}>
                    <Text style={[globalStyles.MobH2, {color: "#DA5955"}]}>Сообщить {"\n"}о
                        возможном {"\n"}контрафакте!</Text>
                    <ScrollView style={{marginTop: 38}}>
                        <View style={{marginBottom: 18, zIndex: 99999}}>
                            <Text style={{
                                fontFamily: FONTS.Manrope500,
                                fontSize: 16,
                                lineHeight: 16,
                                color: "#BEBEBE",
                                marginBottom: 12
                            }}>
                                Название продукта
                            </Text>
                            <DropDownPicker
                                style={{borderColor: '#BEBEBE'}}
                                dropDownContainerStyle={{borderColor: '#BEBEBE'}}
                                placeholder={'Выберите название продукта'}
                                setValue={setCategory}
                                value={category}
                                items={productNames}
                                setItems={setItems}
                                open={open}
                                setOpen={setOpen}
                            />
                        </View>

                        <LabelInput
                            large={false}
                            title={"Город"}
                            value={cityName}
                            onChangeText={setCityName}
                            error={cityError}
                            inputStyle={{height: 44}}
                        />
                        <LabelInput
                            title={"Комментарий"}
                            value={comments}
                            onChangeText={setComments}
                            large={true}
                            multiline={true}
                            largeError={commentError}
                        />
                        <View style={{flexDirection: "row"}}>
                            <TouchableOpacity style={styles.addPhotoBox}
                                // onPress={pickImage}
                                              onPress={() => {
                                                  setShowPickerModal(true)
                                              }}
                            >
                                <AddPhotoIcon/>
                                <Text style={styles.addPhotoTitle}>
                                    Добавить фото
                                </Text>
                            </TouchableOpacity>
                            <FlatList
                                horizontal={true}
                                data={images}
                                renderItem={renderPickedImages}
                            />
                        </View>

                        <AppButton
                            color={"#f6f6f6"}
                            style={styles.btnStyles}
                            title={"Отправить сообщение"}
                            onPress={handleSentCounterfeitMessage}
                        />
                        <CancelButton onPress={() => {
                            setShowCounterfeitModal(false)
                            setScannedResult('')
                        }} black/>
                    </ScrollView>
                </View>
                <Modal
                    isVisible={showPickerModal}
                    style={{margin: 0, zIndex: 99999}}
                >
                    <View style={[styles.modalBox, {height: 180, zIndex: 999999,}]}>
                        <View
                            style={styles.iconsContainer}>
                            <TouchableOpacity onPress={pickImage}>
                                <Text style={styles.iconBox}>
                                    <GalleryIcon/>
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={pickCameraImage}>
                                <Text style={styles.iconBox}>
                                    <CameraIcon/>
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                setShowPickerModal(false)
                            }}
                            style={{
                                alignSelf: 'center',
                                paddingBottom: 8
                            }}>
                            <Text style={{fontSize: 18, color: '#000'}}>
                                Отменить
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </Modal>

            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                animationOutTiming={400}
                isVisible={successModalVisible} style={{margin: 0}}>
                <View style={styles.statusModalBox}>
                    <Text style={styles.successText}>Сообщение{"\n"}успешно отправлено!</Text>
                    <AppButton color={"#fff"} title={"Закрыть"} style={styles.button} onPress={() => {
                        setSuccessModalVisible(false)
                    }}/>
                </View>
            </Modal>

            <Modal
                animationIn={'slideInUp'}
                animationOut={'slideOutDown'}
                animationOutTiming={300}
                isVisible={errorModalVisible} style={{margin: 0}}>
                <View style={styles.statusModalBox}>
                    <Text style={styles.errorText}>Ошибка{"\n"}отправки сообщения!</Text>
                    <AppButton color={"#fff"} title={"Назад"} style={styles.button} onPress={() => {
                        setErrorModalVisible(false)
                        setShowCounterfeitModal(true)
                    }}/>
                </View>
            </Modal>
        </View>
    );
};

export default QrScannerScreen;

const styles = StyleSheet.create({
    qr_header: {
        top: "6%",
        paddingHorizontal: 24,
    },
    screenshootContainer: {
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#fff",
        padding: 2,
        top: 30,
    },
    qrLeftBorder: {
        position: "absolute",
        height: "30%",
        width: "30%",
        top: 0,
        left: 0,
        borderColor: "#F6F6F8",
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 12,
    },
    qrRightBorder: {
        position: "absolute",
        height: "30%",
        width: "30%",
        top: 0,
        right: 0,
        borderColor: "#F6F6F8",
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 12,
    },
    qrBottomBorder: {
        position: "absolute",
        height: "30%",
        width: "30%",
        bottom: 0,
        left: 0,
        borderColor: "#F6F6F8",
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 12,
    },
    qrTopBorder: {
        position: "absolute",
        height: "30%",
        width: "30%",
        bottom: 0,
        right: 0,
        borderColor: "#F6F6F8",
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 12,
    },
    qrBorderBox: {
        position: "absolute",
        zIndex: 999,
        alignSelf: "center",
        top: "35%",
    },

    modalBox: {
        height: "100%",
        paddingHorizontal: 16,
        bottom: 0,
        backgroundColor: "#fff",
        width: "100%",
        position: "absolute",
        paddingBottom: 16,
        paddingTop: 42,
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
    },
    addPhotoBox: {
        width: 155,
        height: 155,
        borderWidth: 1,
        borderColor: "grey",
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    addPhotoTitle: {
        fontSize: 18,
        lineHeight: 23,
        fontFamily: FONTS.Manrope400,
        color: "#BEBEBE",
        marginTop: 8,
    },
    btnStyles: {
        borderRadius: 12,
        backgroundColor: "#000",
        height: 64,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 44,
        marginBottom: 8
    },
    xMarkBox: {
        position: "absolute",
        top: 12,
        right: 18,
        backgroundColor: "#DBDBDB80",
        width: 32,
        height: 32,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    },
    statusModalBox: {
        height: 280,
        backgroundColor: "#fff",
        bottom: 0,
        position: "absolute",
        width: "100%",
        paddingHorizontal: 16,
        paddingTop: 32,
        paddingBottom: 12,
    },
    successText: {
        color: "#5FBB3F",
        fontFamily: FONTS.Manrope500,
        fontSize: 30,
        flex: 1,
    },
    errorText: {
        color: "#DA5955",
        fontFamily: FONTS.Manrope500,
        fontSize: 30,
        flex: 1,
    },
    button: {
        backgroundColor: "#222",
        height: 64,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        height: '80%',
        alignItems: 'center'
    },
    iconBox: {
        width: 50,
        height: 50,
    }
});

