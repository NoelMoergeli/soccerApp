import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    PanResponder,
    Animated,
    Alert,
    TouchableOpacity
} from "react-native";
import Ball from '../assets/ball.png';

class Draggable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showDraggable: true,
            dropAreaValues: null,
            pan: new Animated.ValueXY(),
            opacity: new Animated.Value(1),
        };
    }

    UNSAFE_componentWillMount() {
        this._val = { x:0, y:0 }
        this.state.pan.addListener((value) => this._val = value);

        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (e, gesture) => true,
            onPanResponderGrant: (e, gesture) => {
                this.state.pan.setOffset({
                    x: this._val.x,
                    y:this._val.y
                })
                this.state.pan.setValue({ x:0, y:0})
            },
            onPanResponderMove: Animated.event([
                null, { dx: this.state.pan.x, dy: this.state.pan.y }
            ]),
            onPanResponderRelease: (e, gesture) => {
                Animated.timing(this.state.opacity, {
                    toValue: 0,
                    duration: 1000
                }).start(() =>
                    this.setState({
                        showDraggable: false
                    })
                );

                if (65 < gesture.moveX && gesture.moveX < 330
                    && 90 < gesture.moveY && gesture.moveY < 200 ) {
                    Alert.alert(
                        'GOOOOAL',
                        'You scored a Goal',
                        [
                            {text: 'OK', onPress: () =>
                                    this.props.goalScored()}
                        ],
                        {cancelable: false},
                    );

                } else{
                    Alert.alert(
                        'Missed!',
                        'You missed the Goal',
                        [
                            {text: 'OK', onPress: () => console.log('OK Pressed')},
                        ],
                        {cancelable: false},
                    );
                }
            }
        });
    }

    render() {
        return (
            <View style={{ width: "20%", alignItems: "center" }}>
                {this.renderDraggable()}
            </View>
        );
    }

    renderDraggable() {
        const panStyle = {
            transform: this.state.pan.getTranslateTransform()
        }
        if (this.state.showDraggable) {
            return (
                <View style={{ position: "absolute" }}>
                    <Animated.Image
                        {...this.panResponder.panHandlers}
                        style={[panStyle, styles.circle, {opacity:this.state.opacity}]}
                        source={Ball}
                    />
                </View>
            );
        }
    }
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counter: 0
        };
    }
    goalScored = () => {
        this.setState({counter : this.state.counter + 1})
    }


    render() {

        return (
            <View style={styles.mainContainer1}>
            <View style={styles.mainContainer}>
                <View style={styles.dropZone}>
                    <Text style={styles.text}>Score a Goal!</Text>
                    <View style={styles.goal}>
                        <View style={styles.lPost}><Text> </Text></View>
                        <View style={styles.crossbar}><Text> </Text></View>
                        <View style={styles.rPost}><Text> </Text></View>
                    </View>
                </View>
                <Text style={styles.score}> Your Score: </Text>
                <Text style={styles.score}> {this.state.counter} </Text>
                <View style={styles.ballContainer} />

                <View style={styles.row}>
                    <Draggable goalScored={this.goalScored}/>
                    <Draggable goalScored={this.goalScored}/>
                    <Draggable goalScored={this.goalScored}/>
                    <Draggable goalScored={this.goalScored}/>
                    <Draggable goalScored={this.goalScored}/>
                </View>
            </View>
                <View style={styles.button}>
                    <TouchableOpacity style={styles.logout} onPress={() => this.props.navigation.navigate('Main')}>
                        <Text style={styles.logoutText}>leave Game</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

let CIRCLE_RADIUS = 30;
const styles = StyleSheet.create({
    mainContainer1: {
        flex: 1,
        backgroundColor: "#ADFF33"
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "#ADFF33"
    },
    ballContainer: {
        height:200
    },
    circle: {
        backgroundColor: "skyblue",
        width: CIRCLE_RADIUS * 2,
        height: CIRCLE_RADIUS * 2,
        borderRadius: CIRCLE_RADIUS
    },
    row: {
        flexDirection: "row",
        marginBottom: 20
    },
    dropZone: {
        height: 200,
        backgroundColor: "#00334d",
    },
    text: {
        marginTop: 25,
        marginLeft: 5,
        marginRight: 5,
        textAlign: "center",
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold"
    },
    score: {
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        textAlign: "center",
        color: "#fff",
        fontSize: 25,
        fontWeight: "bold"
    },
    goal: {
        flex: 1,
        flexDirection: "row"
    },
    crossbar: {
        backgroundColor: "#fff",
        height: "6%",
        width: "76%",


    },
    lPost: {
        backgroundColor: "#fff",
        marginLeft: "10%",
        width: "3%",

    },
    rPost: {
        backgroundColor: "#fff",
        width: "3%",
    },
    logout: {
        backgroundColor: '#ec7874',
        marginTop: '55%',
        marginLeft: '10%',
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
    button: {
        marginBottom: 50,
    }
});