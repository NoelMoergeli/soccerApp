import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView} from 'react-native';
import * as firebase from "firebase";

export default class LoginScreen extends Component {
    state = {
        email: "",
        password: "",
        error: "",
    };

    componentDidMount() {
        this.userLogin();
    }

    userLogin() {

        firebase
            .auth() // create new user
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                    this.props.navigation.navigate('Main')
                },
            )
            .catch(error => this.setState({error: 'Username or Password incorrect'}));
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Login</Text>
                </View>
                <View style={styles.content}>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Email"
                            placeholderTextColor="#003f5c"
                            onChangeText={text => this.setState({email: text})}/>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            placeholder="Password"
                            placeholderTextColor="#003f5c"
                            secureTextEntry
                            onChangeText={text => this.setState({password: text})}/>
                    </View>
                    <View style={styles.errorView}>
                        <Text style={styles.error}>{this.state.error}</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                            <Text style={styles.loginText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => this.userLogin()}>
                            <Text style={styles.loginText}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
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
    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 40
    },
    inputView: {
        width: "80%",
        backgroundColor: "#ec7874",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        height: 50,
        color: "white"
    },
    loginText: {
        height: 50,
        color: "white"
    },
    header: {
        height: 131,
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
    content: {
        marginTop: "60%",
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        fontSize: 15,
        color: '#ff0000',
        marginBottom: "5%"
    },
    errorView: {
        marginTop: 2,
        backgroundColor: "#404040",
        alignItems: 'center',
        height:35,
    }

});