import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Login from '../auth/Login'
import Splash from '../layout/Splash'
import Register from '../auth/Register'
import Auth from '../auth/Auth';
import DashboardTabScreen from './DashboardTabScreen';

const StackNavigator = createStackNavigator(
    {
        Splash: {
            screen: Splash
        },
        DashboardTab: {
            screen: DashboardTabScreen
        },
        Auth: {
            screen: Auth
        },
        Login: {
            screen: Login
        },
        Register: {
            screen: Register
        }
    },
    {
        initialRouteName: 'Splash',
        headerMode: 'none',
        mode: 'modal'
    }
)

export default createAppContainer(StackNavigator)