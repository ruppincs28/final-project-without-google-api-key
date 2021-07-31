import React, { Component } from 'react';
import { Alert, Dimensions, View, Text, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, Linking } from 'react-native';
import { Card } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { JOBS_API, PROD_API, ROUTE_API } from './services/ApiService';
import { Searchbar } from 'react-native-paper';
import * as Location from 'expo-location';
import HTML from "react-native-render-html";
import JSSoup from 'jssoup';
import BottomSheet from 'reanimated-bottom-sheet';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'

import { asyncGetUserNameFromLocalStorage } from './utils/helpers';


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;

export default class JobSearch extends Component {
    state = {
        search: '',
        location: '',
        jobs: [],
        queriedJobs: [],
        modalHtml: '&nbsp;',
        applyHtml: '&nbsp;',
        hybridRouteResult: {},
        destCoords: {},
        loading: true
    };

    bs = React.createRef();

    async componentDidMount() {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }

        let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
        this.setState({ location: location })

        this.getJobs();
        setTimeout(this.populateJobsWithRoute.bind(this), 8000)
    }

    getJobs() {
        console.log(`${JOBS_API}lat=${this.state.location.coords.latitude}&long=${this.state.location.coords.longitude}`)
        fetch(JOBS_API, {
            method: 'GET'
        })
            .then(resp => resp.text(), error => console.log(error))
            .then(data => {
                let parsedData = JSON.parse(data);
                this.setState({ jobs: parsedData });
                this.setState({ queriedJobs: parsedData });
            }, error => console.log(error))
    }

    populateJobsWithRoute() {
        let companiesWithAddresses = this.state.jobs.map(job => `${job.company} ${job.location}`);

        fetch(`${ROUTE_API}/routes/calculate`, {
            method: 'POST',
            body: JSON.stringify({
                CompaniesWithAddresses: companiesWithAddresses,
                Coordinates: {
                    Lat: this.state.location.coords.latitude,
                    Lng: this.state.location.coords.longitude
                }
            }),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(resp => resp.json())
            .then(data => {
                this.setState({
                    jobs: this.state.jobs.map((job, index) => {
                        job.route = data[index];
                        return job;
                    })
                }, () => this.setState({ loading: false }));
            }, error => console.log(error))
    }

    updateSearch = (text) => {
        this.setState({ search: text });
        this.setState({ queriedJobs: this.state.jobs.filter(job => job.title.includes(text)) });
    };

    formatDate(string) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    }

    handleAddToFavorites(username, job) {
        fetch(`${PROD_API}/jobs/username/${username}`, {
            method: 'POST',
            body: JSON.stringify(job),
            headers: new Headers({
                'Content-Type': 'application/json; charset=UTF-8',
                'Accept': 'application/json; charset=UTF-8'
            })
        })
            .then(resp => resp.json())
            .then(() => Alert.alert(
                'Job added to favorites successfully'
            ), error => console.log(error))
    }

    renderJobs() {
        return this.state.queriedJobs.map(job => {
            const {
                url,
                title,
                description,
                route,
                id,
                company,
                created_at,
                how_to_apply,
                company_logo
            } = job;

            return (
                <Card title={title} key={id} jobId={id}>
                    <View style={{ height: 220 }}>
                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Image source={{ uri: company_logo }} style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                resizeMode: 'center',
                                height: 100,
                                width: 200
                            }} />
                        </View>
                        <View style={styles.detailWrapper}>
                            <Text style={styles.italics}>{company}</Text>
                            <Text style={styles.italics}>{this.formatDate(created_at)}</Text>
                        </View>
                        <Button color="#03A9F4" icon="dots-horizontal-circle" mode="contained" onPress={() => {
                            this.setState({
                                modalHtml: `${description}${route.CarDriveJustification}\nSource: ${route.SourceCoordinates.Lat}, ${route.SourceCoordinates.Lng}\nPrivateVehicleCoordinates: ${route.PrivateVehicleCoordinates.Lat}, ${route.PrivateVehicleCoordinates.Lng}\n`,
                                applyHtml: how_to_apply,
                                hybridRouteResult: { latitude: route.PrivateVehicleCoordinates.Lat, longitude: route.PrivateVehicleCoordinates.Lng },
                                destCoords: { latitude: route.DestCoordinates.Lat, longitude: route.DestCoordinates.Lng }
                            }, () => this.bs.current.snapTo(0));

                        }}>
                            Show more
                        </Button>
                        <Button style={{ marginTop: 7 }} color="pink" icon="cards-heart" mode="contained"
                            onPress={() => asyncGetUserNameFromLocalStorage().then(username => this.handleAddToFavorites(username, {
                                Id: id,
                                Title: title,
                                Company: company,
                                CreatedAt: created_at,
                                Url: url,
                                CompanyLogo: company_logo
                            }))}>
                            Add to favorites!
                        </Button>
                    </View>
                </Card>
            );
        });
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                <View style={styles.panelHeader}>
                    <View style={styles.panelHandle} />
                </View>
            </View>
        )
    }

    renderInner() {
        let soup = new JSSoup(this.state.applyHtml);
        let a = soup.find('a');
        let origin = { latitude: this.state.location.coords.latitude, longitude: this.state.location.coords.longitude }
        let redirectToGoogleMapsData = {
            source: this.state.hybridRouteResult,
            destination: this.state.destCoords,
            params: [
                {
                    key: "travelmode",
                    value: "transit"        // may be "walking", "bicycling" or "transit" as well
                },
                {
                    key: "dir_action",
                    value: "navigate"       // this instantly initializes navigation using the given travel mode
                }
            ]
        }

        return Object.keys(this.state.hybridRouteResult).length !== 0 && Object.keys(this.state.destCoords).length !== 0 && (
            <>
                <View style={styles.panel}>
                    <Text style={styles.panelTitle}>Job Description</Text>
                    <HTML
                        source={{ html: this.state.modalHtml }}
                    />
                    <Button color="#03A9F4" icon="briefcase" mode="contained" onPress={() => Linking.openURL(a?.attrs.href)}>
                        Apply Now!
                    </Button>
                    <Text>{" "}</Text>
                    <MapView style={{ width: '100%', height: '15%' }} scrollEnabled={false} minZoomLevel={15} maxZoomLevel={15} initialRegion={{
                        latitude: this.state.location.coords.latitude,
                        longitude: this.state.location.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO,
                    }}>
                        <MapView.Marker coordinate={origin} />
                        <MapView.Marker coordinate={this.state.hybridRouteResult} title="Destination" />
                        <MapViewDirections
                            origin={origin}
                            destination={this.state.hybridRouteResult}
                            apikey={"NO_API_KEY_IN_THIS_REPOSITORY_FOR_SAFETY_CONCERNS"}
                            strokeWidth={3}
                            strokeColor="hotpink"
                        />
                    </MapView>
                    <Text>{" "}</Text>
                    <Text>{"After reaching the destination, proceed using public transport (link with directions below)"}</Text>
                    <Text>{" "}</Text>
                    <Button color="#03A9F4" icon="briefcase" mode="contained" onPress={() => getDirections(redirectToGoogleMapsData)}>
                        Get Directions
                    </Button>
                </View>
            </>
        )
    }

    render() {
        const { search } = this.state;

        return this.state.jobs.length !== 0 && !this.state.loading ?
            <View style={styles.container}>
                <BottomSheet
                    ref={this.bs}
                    snapPoints={[550, 300, 0]}
                    borderRadius={10}
                    enabledContentTapInteraction={false}
                    renderContent={() => this.renderInner()}
                    renderHeader={() => this.renderHeader()}
                    initialSnap={2}
                />
                <Searchbar
                    placeholder="Search for a position"
                    onChangeText={this.updateSearch}
                    value={search}
                    style={{ marginTop: 30, marginLeft: 10, marginRight: 10 }}
                />
                <ScrollView style={{ marginTop: 20 }}>
                    {this.renderJobs()}
                </ScrollView>
            </View>
            :
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Searching for jobs in your area...</Text>
            </View>
    }
}

const styles = {
    italics: {
        fontStyle: 'italic'
    },
    detailWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10
    },
    titleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    title: {
        fontSize: 24
    },
    searchBar: {
        position: 'absolute',
        left: 10,
        top: 10,
        right: 10,
        height: 50,
        zIndex: 1,
        backgroundColor: 'white'
    },
    search: {
        borderColor: 'gray',
        borderWidth: StyleSheet.hairlineWidth,
        height: 40,
        borderRadius: 10,
        paddingHorizontal: 15,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    box: {
        width: 200,
        height: 200,
    },
    panelContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    panel: {
        height: 2500,
        padding: 20,
        backgroundColor: '#f7f5eee8',
    },
    header: {
        backgroundColor: '#f7f5eee8',
        shadowColor: '#000000',
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
        textAlign: 'center'
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#318bfb',
        alignItems: 'center',
        marginVertical: 10,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    photo: {
        width: '100%',
        height: 225,
        marginTop: 30,
    },
    map: {
        height: '100%',
        width: '100%',
    },
};
