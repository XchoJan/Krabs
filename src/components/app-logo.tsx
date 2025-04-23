import React from 'react';
import {View} from "react-native";
import Kraab from '../assets/svg/appLogoVectors/Kraab.svg'
import Systems from '../assets/svg/appLogoVectors/Systems.svg'
const AppLogo = () => {
    return (
        <View>
            <View style={{marginBottom: 9}}>
                <Kraab/>
            </View>
            <View>
                <Systems/>
            </View>
        </View>
    );
};

export default AppLogo;
