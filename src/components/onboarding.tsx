import React, {useState, useRef} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View, Animated} from "react-native";
import GestureRecognizer from "react-native-swipe-gestures";
import {FONTS} from "../theme/fonts";

const Onboarding = ({onPressStart}: any) => {
    const content = [
        {
            title: 'Добро пожаловать \n в приложение \n KRAAB SYSTEMS!',
            description: '',
            image: require('../assets/images/Onboarding0.png')
        },
        {
            title: 'Участвуйте \n в Бонусной программе \n для мастеров',
            description: '— Сканируйте QR-код\n' +
                '— Копите бонусы\n' +
                '— Обменивайте на подарки', image: require('../assets/images/Onboarding1.png')
        },
        {
            title: 'Будьте уверены в \n настоящем продукте',
            description: 'С каждым сканированием\n' +
                'вы проверяете продукцию\n' +
                'на оригинальность', image: require('../assets/images/Onboarding2.png')
        },
        {
            title: 'Полезные материалы всегда под рукой',
            description: 'Актуальные прайсы, каталоги, тех.карты в быстром доступе',
            image: require('../assets/images/Onboarding3.png')
        },
        {
            title: 'Быстрый поиск дилеров в вашем городе',
            description: 'Адреса и контакты официальных представителей по всей России',
            image: require('../assets/images/Onboarding4.png')
        },
    ]

    const [activeState, setActiveState] = useState(0)

    return (
        <View style={styles.container}>
            <GestureRecognizer
                onSwipeLeft={() =>{
                    if(activeState < 4){
                        setActiveState(activeState + 1)
                    }
                }}
                onSwipeRight={() => {
                    if (activeState !== 0) {
                        setActiveState(activeState - 1)
                    }
                }}
                style={{flex: 1, width: '100%'}}
            >
                <View style={{flex: 1, height: '100%'}}>
                    <View>
                        <View>
                            <Text style={styles.title}>{content[activeState].title}</Text>
                            <View style={{width: '100%', marginBottom: 24, alignItems: 'center'}}>
                                <Text style={[
                                    styles.description,
                                    activeState !== 1 && {
                                        paddingHorizontal: 16,
                                        textAlign: 'center',
                                    }]}>
                                    {content[activeState].description}
                                </Text>
                            </View>
                        </View>

                    </View>

                    <View style={{flex: 1, position: 'relative', width: '100%'}}>
                        <Image
                            source={content[activeState].image}
                            style={[
                                styles.image,
                                {alignSelf: 'center'},
                                activeState === 2 && {marginBottom: 144, width: 280, height: 280, resizeMode: 'contain'},
                                activeState === 0 && {alignSelf: 'center', width: '100%', height: '95%', resizeMode: 'contain', bottom: -10},
                                activeState === 1 && {width: '100%', height: '100%', alignSelf: 'center', resizeMode: 'contain'},
                                activeState === 3 && {width: '100%', height: '85%', resizeMode: 'contain', bottom: -10},
                                activeState === 4 && {
                                    width: '90%',
                                    height: 280,
                                    marginBottom: 184,
                                    resizeMode: 'contain'
                                },
                            ]}
                        />
                        {activeState === 4 &&
                            <TouchableOpacity style={styles.button} onPress={() => {
                                if (activeState !== 4) {
                                    setActiveState(activeState + 1)
                                } else {
                                    onPressStart()
                                }
                            }}>
                                <Text style={styles.buttonTitle}>{activeState !== 4 ? 'Далее' : 'Начать'}</Text>
                            </TouchableOpacity>}
                        <View style={styles.dotsContainer}>
                            {content.map((item, index) => (
                                <View key={index}
                                      style={[styles.dot, index === activeState ? styles.activeDot : null]}/>
                            ))}
                        </View>
                    </View>

                </View>
            </GestureRecognizer>
        </View>
    );
};

export default Onboarding;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        paddingTop: 84,

    },
    title: {
        fontSize: 28,
        color: "#000",
        marginBottom: 34,
        textAlign: 'center',
        paddingHorizontal: 24,
        fontFamily: FONTS.Manrope500
    },
    description: {
        fontSize: 20,
        color: 'grey'
    },
    image: {
        width: '100%',
        bottom: 0,
        position: 'absolute',
    },
    button: {
        width: 120,
        height: 54,
        backgroundColor: '#000',
        borderRadius: 18,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 120

    },
    buttonTitle: {
        color: '#fff',
        fontSize: 18
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        marginTop: 24,
        position: 'absolute',
        bottom: 40,
        alignSelf: 'center'


    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#D9D9D9',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: '#797979',
    },
})
