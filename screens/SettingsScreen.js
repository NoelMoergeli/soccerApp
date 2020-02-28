import React, {Component} from "react";
import {Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as firebase from "firebase";
import {auth} from "firebase";

export default class SettingsScreen extends Component {
    logout(){
        firebase
            .auth().signOut().then(() => this.props.navigation.navigate('Login'))
    }
    deleteFavourites(){
        Alert.alert(
            'Attention',
            'Do you want to delete all your favourites',
            [
                {text: 'Yes', onPress: () => {
                        var adaRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid);
                        adaRef.remove().then(function() {
                            console.log("Remove succeeded.")
                        })
                            .catch(function(error) {
                                console.log("Remove failed: " + error.message)
                            });
                    }},
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            ],
        );

    }
    someOption(){

    }
    deleteAccount(){
        var user = firebase.auth().currentUser;

        user.delete().then(function() {
            console.log('user deleted');
            console.log(this.props.navigation);
            this.props.navigation.navigate('Login');
        }).catch(function(error) {
            console.log('some error occured');
            this.props.navigation.navigate('Login');
        });
    }

    render() {
        const {navigate, push} = this.props.navigation;
        return (
            <View style={styles.container}>
                <View style={styles.pink}/>
                <View style={styles.header}>
                    <Text style={styles.title}>Settings</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.button}>
                    <TouchableOpacity style={styles.logout} onPress={() => this.logout()}>
                        <Text style={styles.logoutText}>logout</Text>
                    </TouchableOpacity>
                </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.logout} onPress={() => this.deleteFavourites()}>
                            <Text style={styles.logoutText}>delete favourites</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.logout} onPress={() => this.someOption()}>
                            <Text style={styles.logoutText}>some Option</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.logout} onPress={() => this.someOption()}>
                            <Text style={styles.logoutText}>some Option</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.logout} onPress={() => this.someOption()}>
                            <Text style={styles.logoutText}>some Option</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.logout} onPress={() => this.someOption()}>
                            <Text style={styles.logoutText}>some Option</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity style={styles.logout} onPress={() => this.deleteAccount()}>
                            <Text style={styles.logoutText}>delete Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#404040",
    },
    header: {
        height: "12%",
        borderBottomColor: "#ffffff",
        borderBottomWidth: 1,
        backgroundColor: "#000000",
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        color: '#ffffff'
    },
    pink: {
        height: "6%",
        borderBottomColor: "#ffffff",
        borderBottomWidth: 1,
        backgroundColor: "#000000",
    },
    body: {
        alignItems: 'center',
    },
    footer: {
    },
    logout: {
        backgroundColor: '#ec7874',
        marginTop: '7%',
        height: 50,
        width: 300,
        borderRadius:20,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 24,
        color: '#ffffff',
        marginTop: 10
    },
});