import React, { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import JobSearch from '../JobSearch';
import JobFavorites from '../JobFavorites';
import Profile from '../Profile';
import About from '../About';

const DashboardTabScreen = createBottomTabNavigator(
    {
        JobSearch: {
            screen: JobSearch,
            navigationOptions: {
                tabBarLabel: 'Job Search',
                tabBarIcon: ({ tintColor }) => {
                    return <MaterialCommunityIcons name="magnify" color={tintColor} size={25} />;
                }
            }
        },
        JobFavorites: {
            screen: JobFavorites,
            navigationOptions: {
                tabBarLabel: 'Favorites',
                tabBarIcon: ({ tintColor }) => {
                    return <MaterialCommunityIcons name="heart" color={tintColor} size={25} />;
                }
            }
        },
        Profile: {
            screen: Profile,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({ tintColor }) => {
                    return <MaterialCommunityIcons name="account" color={tintColor} size={25} />;
                }
            }
        },
        About: {
            screen: About,
            navigationOptions: {
                tabBarLabel: 'About',
                tabBarIcon: ({ tintColor }) => {
                    return <MaterialCommunityIcons name="cloud-question" color={tintColor} size={25} />;
                }
            }
        }
    },
    {
        initialRouteName: 'JobSearch',
        tabBarOptions: {
            activeTintColor: '#e91e63',
            showIcon: true
        }
    }
);

export default DashboardTabScreen;