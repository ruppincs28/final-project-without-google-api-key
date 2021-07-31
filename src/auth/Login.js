import React, { Component } from "react";
import { StyleSheet, Keyboard, Text, View, TextInput, TouchableWithoutFeedback, Alert, KeyboardAvoidingView } from 'react-native';
import { Button } from 'react-native-elements';
import { PROD_API } from '../services/ApiService';
import { storeInAsyncLocalStorage } from '../utils/helpers';

export default class Login extends Component {
    state = {
        username: '',
        password: ''
    };

    render() {
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
                            <Button
                                buttonStyle={styles.loginButton}
                                onPress={this.onLoginPress}
                                title="Login"
                            />
                            <Button
                                buttonStyle={styles.fbLoginButton}
                                onPress={() => this.onRegisterPress()}
                                title="Register"
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    onLoginPress = () => {
        fetch(`${PROD_API}/users/validate`, {
            method: 'POST',
            body: JSON.stringify({ username: this.state.username, password: this.state.password, img: '' }),
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

    onRegisterPress() {
        this.props.navigation.navigate('Register');
    }
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
        marginTop: 150,
        marginBottom: 30,
        textAlign: 'center',
    },
    logoTextJob: {
        color: "#16BDC5",
        fontSize: 40,
        fontWeight: "800",
        marginTop: 150,
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
