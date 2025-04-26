import React, {useState} from 'react';
import AppButton from '../../../components/app-button';
import AppWrapper from '../../../components/app-wrapper';
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Button,
  ScrollView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {FONTS} from '../../../theme/fonts';
import AppLogo from '../../../components/app-logo';

const WelcomeScreen = () => {
  const navigation: any = useNavigation();

  const handleGoPinScreen = () => {
    navigation.navigate('EnterPinScreen');
  };

  return (
    <View style={{flex: 1, width: '100%'}}>
      <AppWrapper withPadding={false}>
        <ImageBackground
          source={require('../../../assets/images/EUROKRAAB.png')}
          style={styles.backgroundImage}
        />
        <View
          style={{
            position: 'absolute',
            backgroundColor: '#000',
            opacity: 0.4,
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
          }}
        />
        <View style={styles.container}>
          <View
            style={{
              alignItems: 'center',
              top: Platform.OS === 'ios' ? 40 : 18,
            }}>
            <AppLogo />
          </View>
          <View>
            <Text style={styles.dobro}>ДОБРО</Text>

            <Text style={styles.pojalovat}>пожаловать!</Text>
          </View>
          <View style={{width: '100%'}}>
            <View style={{width: '100%', marginBottom: 16}}>
              <AppButton title={'Войти'} onPress={handleGoPinScreen} />
            </View>
          </View>
        </View>
      </AppWrapper>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    flex: 1,
    paddingBottom: 20,
    paddingTop: 30,
    paddingHorizontal: 16,
    width: '100%',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -1,
    left: 0,
    backgroundColor: '#000000',
    resizeMode: 'cover',
  },
  policyText: {
    fontSize: 14,
    color: '#AEAEAE',
  },
  system: {
    textAlign: 'center',
    fontSize: 24,
    top: -8,
    fontFamily: FONTS.Manrope600,
    color: '#FFFFFF',
  },
  kraab: {
    textAlign: 'center',
    fontSize: 34,
    fontFamily: FONTS.Manrope600,
    color: '#FFFFFF',
  },
  dobro: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 36,
    fontFamily: FONTS.Manrope600,
    textAlign: 'center',
  },
  pojalovat: {
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 36,
    fontFamily: FONTS.Manrope500,
    textAlign: 'center',
  },
  privicy_title: {
    fontFamily: FONTS.Roboto600,
    color: '#AEAEAE',
    fontSize: 14,
  },
  modalBox: {
    width: '110%',
    backgroundColor: '#fff',
    flex: 1,
    position: 'absolute',
    left: -18,
    height: '90%',
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 35,
  },
});
