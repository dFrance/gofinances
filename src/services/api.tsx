import AsyncStorage from '@react-native-async-storage/async-storage';
const dataKeyTransactions = '@gofinances:transactions';

export async function getTransactions() {
    const getData = await AsyncStorage.getItem(dataKeyTransactions)
    const parseData = JSON.parse(getData!)
    return parseData
}