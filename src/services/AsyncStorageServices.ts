import AsyncStorage from '@react-native-async-storage/async-storage';

export const getAuth = async () => {
  const token = await AsyncStorage.getItem('access');
  return { token };
};
export const removeAuth = async () => {
  const token = await AsyncStorage.removeItem('access');
};

// если надо взять токен  const {token} = await getAuth()
