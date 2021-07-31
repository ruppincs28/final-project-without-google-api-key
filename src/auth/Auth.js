import React, { useState, useEffect } from 'react';
import Login from './Login';
import { asyncGetUserNameFromLocalStorage } from '../utils/helpers';

function Auth(props) {
    const [loggedInAs, setLoggedInAs] = useState("")

    useEffect(() => {
        asyncGetUserNameFromLocalStorage().then(data => {
            if (data !== "") {
                // Let the splash screen show for a while
                setTimeout(() => props.navigation.navigate('DashboardTab'), 2000);
            }
        });
    }, [])

    return (
        <Login navigation={props.navigation} />
    )
}

export default Auth