import React, { Component } from "react";
import {
    StyleSheet,
    Keyboard,
    Text,
    Button as RNButton,
    View,
    TextInput,
    TouchableWithoutFeedback,
    Alert,
    ActivityIndicator,
    Clipboard,
    Image,
    Share,
    LogBox,
    StatusBar,
    KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import { Button } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import { PROD_API } from '../services/ApiService';
import { storeInAsyncLocalStorage } from '../utils/helpers';

const firebaseConfig = {
    apiKey: 'AIzaSyBtgSqXRCiFMd0c_AtSX7-8xUIjd3C_71s',
    authDomain: 'hw3-storage.firebaseapp.com',
    databaseURL: 'https://hw3-storage.firebaseio.com',
    storageBucket: 'hw3-storage.appspot.com',
    messagingSenderId: '9793394157',
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Turn off Firebase timer related warnings
LogBox.ignoreAllLogs(true);

export default class Register extends Component {
    state = {
        username: '',
        password: '',
        verifiedPassword: '',
        image: null,
        uploading: false
    };

    async componentDidMount() {
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        await Permissions.askAsync(Permissions.CAMERA);
    }

    onRegisterPress = () => {
        let userObj = {
            Username: this.state.username,
            Password: this.state.password,
            Img: this.state.image
        }
        fetch(`${PROD_API}/users`, {
            method: 'POST',
            body: JSON.stringify(userObj),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(resp => resp.json())
            .then((resp) => {
                if (resp !== "Invalid Credentials") {
                    storeInAsyncLocalStorage(this.state.username).then(() => {
                        this.props.navigation.navigate('DashboardTab');
                    });

                }
            }, error => console.log(error))
    }

    render() {
        let { image } = this.state;

        return (
            <KeyboardAvoidingView style={styles.containerView} behavior="padding">

                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.loginScreenContainer}>
                        <View style={styles.loginFormView}>
                            <Text style={styles.logoText}>
                                JO
                                <Text style={styles.logoTextJob}>BUS</Text>
                            </Text>
                            <TextInput placeholder="Username" placeholderColor="#c4c3cb" onChangeText={(text) => { this.setState({ username: text }) }} style={styles.loginFormTextInput} />
                            <TextInput placeholder="Password" placeholderColor="#c4c3cb" onChangeText={(text) => { this.setState({ password: text }) }} style={styles.loginFormTextInput} secureTextEntry={true} />
                            <TextInput placeholder="Verify Password" placeholderColor="#c4c3cb" onChangeText={(text) => { this.setState({ verifiedPassword: text }) }} style={styles.loginFormTextInput} secureTextEntry={true} />
                            <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>

                                <RNButton
                                    onPress={this._pickImage}
                                    title="Pick an image from camera roll"
                                    color="#6600cc"
                                />
                                <Text></Text>
                                <RNButton
                                    onPress={this._takePhoto}
                                    title="Take a photo"
                                    color="#6600cc"
                                />

                                {this._maybeRenderImage()}
                                {this._maybeRenderUploadingOverlay()}

                                <StatusBar barStyle="default" />
                            </View>
                            <Button
                                buttonStyle={styles.loginButton}
                                onPress={this.onRegisterPress}
                                disabled={this.state.image === null || this.state.username === '' || this.state.password === ''
                                    || this.state.password !== this.state.verifiedPassword ? true : false}
                                title="Register"
                            />
                            <Button
                                buttonStyle={styles.fbLoginButton}
                                onPress={() => this.props.navigation.goBack()}
                                title="Back to Login"
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }

    // Helper overlay functions
    _maybeRenderUploadingOverlay = () => {
        if (this.state.uploading) {
            return (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}>
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            );
        }
    };

    _maybeRenderImage = () => {
        let { image } = this.state;
        if (!image) {
            return;
        }

        return (
            <View
                style={{
                    marginTop: 15,
                    width: 100,
                    borderRadius: 3,
                    elevation: 2,
                }}>
                <View
                    style={{
                        borderTopRightRadius: 3,
                        borderTopLeftRadius: 3,
                        shadowColor: 'rgba(0,0,0,1)',
                        shadowOpacity: 0.2,
                        shadowOffset: { width: 4, height: 4 },
                        shadowRadius: 5,
                        overflow: 'hidden',
                    }}>
                    <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
                </View>
            </View>
        );
    };

    _takePhoto = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };

    _pickImage = async () => {
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        this._handleImagePicked(pickerResult);
    };

    _handleImagePicked = async pickerResult => {
        try {
            this.setState({ uploading: true });

            if (!pickerResult.cancelled) {
                const uploadUrl = await uploadImageAsync(pickerResult.uri);
                this.setState({ image: uploadUrl });
            }
        } catch (e) {
            console.log(e);
            alert('Upload failed, sorry :(');
        } finally {
            this.setState({ uploading: false });
        }
    };
    // Helper overlay functions
}

async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
    });

    const ref = firebase
        .storage()
        .ref()
        .child(uuidv4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
    },
    loginScreenContainer: {
        flex: 1,
    },
    logoText: {
        fontSize: 40,
        fontWeight: "800",
        marginTop: 30,
        marginBottom: 30,
        textAlign: 'center',
    },
    logoTextJob: {
        color: "#16BDC5",
        fontSize: 40,
        fontWeight: "800",
        marginTop: 30,
        marginBottom: 30,
        textAlign: 'center',
    },
    loginFormView: {
        flex: 1
    },
    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,

    },
    loginButton: {
        backgroundColor: '#3897f1',
        borderRadius: 5,
        height: 45,
        marginLeft: 75,
        marginRight: 75,
        marginTop: 10,
    },
    fbLoginButton: {
        height: 45,
        marginTop: 10,
        alignItems: 'center',
        marginLeft: 75,
        marginRight: 75,
        justifyContent: 'center',
        backgroundColor: 'blue',
    },
})
