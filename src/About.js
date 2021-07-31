import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Linking,
    TouchableOpacity
} from 'react-native';
import { Button } from 'react-native-paper';

export default class About extends Component {
    state = {
        user: {}
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}></View>
                <Image style={{}} source={{ uri: this.state.user.Img }} />
                <View style={styles.body}>
                    <View style={styles.bodyContent}>
                        <Text style={styles.logoText}>
                            JO
                                <Text style={styles.logoTextJob}>BUS</Text>
                        </Text>
                        <Text style={styles.name}>Natanel Endelshtein</Text>
                        <Text style={styles.name}>Alex Kalenyuk</Text>
                        <Text style={styles.info}></Text>
                        <Text style={styles.description}>Programming today is a race between software engineers striving to build bigger and better idiot-proof programs, and the universe trying to produce bigger and better idiots. So far, the universe is winning. (Rick Cook)</Text>
                        <Text></Text>

                        <TouchableOpacity style={styles.buttonContainer}>
                            <Button
                                color="#03A9F4"
                                icon="logout-variant"
                                mode="contained"
                                onPress={() => Linking.openURL("https://github.com/ruppincs28/final-project")}>
                                Go to GitHub Page
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
        height: 100,
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
    logoText: {
        fontSize: 40,
        fontWeight: "800",
        marginBottom: 30,
        textAlign: 'center',
    },
    logoTextJob: {
        color: "#16BDC5",
        fontSize: 40,
        fontWeight: "800",
        marginBottom: 30,
        textAlign: 'center',
    },
});
