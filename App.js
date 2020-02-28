import React, {Component} from "react";
import {createAppContainer} from "react-navigation";
import {createBottomTabNavigator} from "react-navigation-tabs";
import {createStackNavigator} from "react-navigation-stack";
import StartScreen from "./screens/StartScreen";
import StandingsScreen from "./screens/StandingsScreen";
import SearchScreen from "./screens/SearchScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import * as firebase from 'firebase';
import SignUpScreen from "./screens/SignUpScreen";

const firebaseConfig = {
    apiKey: "AIzaSyDvMwT2YZCy4reaEMZ-yNxBu1hyd3ZJcyU",
    databaseURL: "https://highscoreapp-e79f2.firebaseio.com",
};
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

function getRoute() {
    console.log(firebase.auth().currentUser);
    if(firebase.auth().currentUser){
        return 'Main'
    }else{
        return 'Login'
    }
}

const MainNavigator = createStackNavigator(
    {
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                headerShown: false,
            },
        },
        SignUp: {
            screen: SignUpScreen,
            navigationOptions: {
                headerShown: false,
            },
        },
        Main: {
            screen: createBottomTabNavigator({
                Home: StartScreen,
                Standings: StandingsScreen,
                Search: SearchScreen,
                Settings: SettingsScreen,
            },{
                initialRouteName: 'Home',
                tabBarOptions: {
                    activeBackgroundColor: '#404040',
                    inactiveBackgroundColor: '#000000',
                    labelStyle: {
                        fontSize: 14,
                        color: '#ffffff',
                        paddingBottom: 12

                    },
                }
            }),
            navigationOptions: {
                headerShown: false,
            },
        },
    },

    {
        initialRouteName: getRoute(),
        navigationOptions: () => ({
                headerTitleStyle: {
                    fontWeight: "normal"
                },
                headerStyle: {
                    backgroundColor: '#f4511e',
                },
            }
        )
    }
);

const AppContainer = createAppContainer(MainNavigator);

export default class App extends Component {
    render() {
        return (
            <AppContainer/>
        );
    }
}