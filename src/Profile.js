import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    TouchableOpacity
} from 'react-native';
import { PROD_API } from './services/ApiService';
import { Button } from 'react-native-paper';
import { reloadAsync } from 'expo-updates';
import { asyncGetUserNameFromLocalStorage, removeAsyncStorage } from './utils/helpers';

export default class Profile extends Component {
    state = {
        user: {}
    };

    bs = React.createRef();

    async componentDidMount() {
        this.getUser();
    }

    getUser() {
        asyncGetUserNameFromLocalStorage().then(username => {
            fetch(`${PROD_API}/users/username/${username}`, {
                method: 'GET',
                headers: new Headers({
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Accept': 'application/json; charset=UTF-8'
                })
            })
                .then(resp => resp.json(), error => console.log(error))
                .then(data => this.setState({ user: data }), error => console.log(error))
        })
    }

    deleteUser() {
        fetch(`${PROD_API}/users/username/${this.state.user.Username}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(resp => resp.json())
            .then(() => this.removeAsyncStorageAndReloadApp(), error => console.log(error))
    }

    removeAsyncStorageAndReloadApp() {
        removeAsyncStorage().then(res => {
            if (res === "EmptiedAsyncStorage") {
                reloadAsync();
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}></View>
                <Image style={styles.avatar} source={{ uri: this.state.user.Img }} />
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.name}>{this.state.user.Username}</Text>
                        <Text style={styles.info}>Enthusiastic Job Seeker</Text>
                        <Text style={styles.description}>"If you will pump long enough, hard enough, and enthusiastically enough, sooner or later the effort will bring forth the reward."</Text>
                        <Text></Text>

                        <TouchableOpacity style={styles.buttonContainer}>
                            <Button
                                color="#03A9F4"
                                icon="logout-variant"
                                mode="contained"
                                onPress={() => this.removeAsyncStorageAndReloadApp()}>
                                Account - Logout
                        </Button>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer}>
                            <Button
                                color="red"
                                icon="delete-forever"
                                mode="contained"
                                onPress={() => Alert.alert(
                                    'Confirm Deletion',
                                    'Please confirm that you want to delete your account',
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => console.log('Cancel Pressed'),
                                            style: 'cancel'
                                        },
                                        {
                                            text: 'OK',
                                            onPress: () => { this.deleteUser() }
                                        }
                                    ],
                                    { cancelable: false }
                                )}>
                                Account - Delete
                        </Button>
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#03A9F4",
        height: 200,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 130
    },
    name: {
        fontSize: 22,
        color: "#FFFFFF",
        fontWeight: '600',
    },
    body: {
        marginTop: 40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding: 30,
    },
    name: {
        fontSize: 28,
        color: "#696969",
        fontWeight: "600"
    },
    info: {
        fontSize: 16,
        color: "#00BFFF",
        marginTop: 10
    },
    description: {
        fontSize: 16,
        color: "#696969",
        marginTop: 10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 10,
        height: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 195,
        borderRadius: 30,
    },
});
