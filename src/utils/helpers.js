import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper functions
export async function asyncGetUserNameFromLocalStorage() {
    try {
        const value = await AsyncStorage.getItem('loggedInAs');
        console.log(value);
        if (value !== null) {
            return value;
        } else {
            return "";
        }
    } catch (e) {
        console.log(e);
    }
}

export async function storeInAsyncLocalStorage(value) {
    try {
        await AsyncStorage.setItem('loggedInAs', value);
        console.log("Successfully saved in AsyncStorage")
    } catch (e) {
        console.log(e);
    }
}

export async function removeAsyncStorage() {
    const allKeys0 = await AsyncStorage.getAllKeys()
    console.log(allKeys0)
    const keys = ['loggedInAs']
    try {
        await AsyncStorage.multiRemove(keys)
    } catch (e) {
        // remove error
    }
    console.log('Done')
    const allKeys = await AsyncStorage.getAllKeys()
    console.log(allKeys)
    if (allKeys.length === 0) {
        return "EmptiedAsyncStorage";
    } else {
        return "AsyncStorageErr";
    }
}
