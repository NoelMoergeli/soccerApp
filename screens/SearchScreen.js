import React, {Component} from "react";
import * as firebase from "firebase";

import {
    Button,
    Image,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Picker,
    SafeAreaView,
    ScrollView,
    Alert
} from 'react-native';

export default class SearchScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playerName: null,
            teamName: null,
            league: "",
            sourcePlayer: null,
            sourceTeam: null,
            leagueTeams: [],
            leaguePlayers: [],
            showPlayerSearch: false,
            showTeamSearch: false,
        }
    }

    searchPlayer() {
        fetch("https://api.footystats.org/league-players?key=example&league_id=" + this.state.league)
            .then(response => response.json())
            .then(data => {
                let leaguePlayers = data.data;
                this.setState({leaguePlayers: leaguePlayers});
            });
        for (let i = 0; i < this.state.leaguePlayers.length; i++) {
            if (this.state.leaguePlayers[i].known_as === this.state.playerName) {
                this.setState({sourcePlayer: this.state.leaguePlayers[i]});
                return;
            }
        }
    }

    searchTeam() {
        console.log("hello1");
        fetch("https://api.footystats.org/league-teams?key=example&league_id=" + this.state.league)
            .then(response => response.json())
            .then(data => {
                let leagueTeams = data.data;
                let sourceTeam;

                console.log("hello2" + this.state.teamName);
                for (let i = 0; i < leagueTeams.length; i++) {
                    console.log(leagueTeams[i].cleanName);
                    if (leagueTeams[i].cleanName === this.state.teamName) {
                        console.log("hello 3");
                        sourceTeam = this.state.leagueTeams[i];
                        break;
                    }
                }
                if(sourceTeam){
                    console.log("gets set")
                    this.setState({leagueTeams: leagueTeams, sourceTeam: sourceTeam});
                }else{
                    this.setState({leagueTeams: leagueTeams});
                }
            });
    }

    setFavouritePlayer() {
        firebase.database().ref('users/' + firebase.auth().currentUser.uid).push({
            favouritePlayer: this.state.sourcePlayer.id,
            favouritePlayerLeague: this.state.league
        });
        Alert.alert(
            'Success',
            'Player added to favourites',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
        );
    }

    setFavouriteTeam() {
        firebase.database().ref('users/' +  firebase.auth().currentUser.uid).push({
            favouriteTeam: this.state.sourceTeam.id,
            favouriteTeamLeague: this.state.league
        });
        Alert.alert(
            'Success',
            'Team added to favourites',
            [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
        );
    }

    openPlayerSearch() {
        if (this.state.showPlayerSearch === false) {
            this.setState({showPlayerSearch: true});
        } else {
            this.setState({showPlayerSearch: false});
        }

    }

    openTeamSearch() {
        if (this.state.showTeamSearch === false) {
            this.setState({showTeamSearch: true});
        } else {
            this.setState({showTeamSearch: false});
        }

    }

    updateLeague = (league) => {
        this.setState({league: league});
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.pink}/>
                <View style={styles.header}>
                    <Text style={styles.title}>Search</Text>
                </View>
                <View style={styles.body1}>
                    <View style={styles.dropdown}>
                        <Picker selectedValue={this.state.league}
                                onValueChange={this.updateLeague}
                                itemStyle={{height: '100%'}}>
                            <Picker.Item label="select a league" value="info"/>
                            <Picker.Item label="Premier League" value="1625"/>
                            <Picker.Item label="La Liga" value="1"/>
                            <Picker.Item label="Bundesliga" value="2"/>
                        </Picker>
                    </View>
                </View>
                <SafeAreaView style={styles.container1}>
                    <ScrollView style={styles.scrollView}>
                        <TouchableOpacity style={styles.titleView1} onPress={() => this.openPlayerSearch()}>
                            <Text style={styles.text1}>Player Search</Text>
                        </TouchableOpacity>
                        {(this.state.showPlayerSearch === true) &&
                        <View style={styles.body}>
                            <View style={styles.playerSearch}>
                                <Text style={styles.text2}>Name:</Text>
                                <TextInput
                                    style={styles.input}
                                    value={this.state.playerName}
                                    onChangeText={(e) => this.setState({playerName: e})}/>
                                <TouchableOpacity style={styles.playerButton} onPress={() => this.searchPlayer()}>
                                    <Text style={styles.playerButtonText}>search</Text>
                                </TouchableOpacity>
                            </View>
                            {(this.state.sourcePlayer != null) &&
                            <View style={styles.playerView}>
                                <Text>{this.state.sourcePlayer.known_as}</Text>
                                <Text>Age: {this.state.sourcePlayer.age}</Text>
                                <Text>Nationality: {this.state.sourcePlayer.nationality}</Text>
                                <Text>Position: {this.state.sourcePlayer.position}</Text>
                                <Text>Minutes played: {this.state.sourcePlayer.minutes_played_overall}</Text>
                                <Text>Goals: {this.state.sourcePlayer.goals_overall}</Text>
                                <Text>Assists: {this.state.sourcePlayer.assists_overall}</Text>
                                <Text>Conceded: {this.state.sourcePlayer.conceded_overall}</Text>
                                <Text>Yellow Cards: {this.state.sourcePlayer.yellow_cards_overall}</Text>
                                <Text>Red Cards: {this.state.sourcePlayer.red_cards_overall}</Text>
                                <TouchableOpacity style={styles.favouriteButton} onPress={() => this.setFavouritePlayer()}>
                                    <Text style={styles.playerButtonText}>set favourite</Text>
                                </TouchableOpacity>
                            </View>
                            }
                        </View>
                        }
                        <View>
                            <TouchableOpacity style={styles.titleView2} onPress={() => this.openTeamSearch()}>
                                <Text style={styles.text3}>Team Search</Text>
                            </TouchableOpacity>
                            {(this.state.showTeamSearch === true) &&
                            <View style={styles.body}>
                                <View style={styles.playerSearch}>
                                    <Text style={styles.text2}>Name:</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={this.state.teamName}
                                        onChangeText={(e) => this.setState({teamName: e})}/>
                                    <TouchableOpacity style={styles.playerButton} onPress={() => this.searchTeam()}>
                                        <Text style={styles.playerButtonText}>search</Text>
                                    </TouchableOpacity>
                                </View>
                                {(this.state.sourceTeam != null) &&
                                <View style={styles.playerView}>
                                    <Text>Name: {this.state.sourceTeam.cleanName}</Text>
                                    <Text>Founded: {this.state.sourceTeam.founded}</Text>
                                    <Text>Table Position: {this.state.sourceTeam.table_position}</Text>
                                    <TouchableOpacity style={styles.favouriteButton}
                                                      onPress={() => this.setFavouriteTeam()}>
                                        <Text style={styles.playerButtonText}>set favourite</Text>
                                    </TouchableOpacity>
                                </View>
                                }
                            </View>
                            }
                        </View>
                    </ScrollView>
                </SafeAreaView>
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
    text1: {
        fontSize: 20,
        color: '#ffffff',
        marginLeft: "32%",
        marginBottom: '5%',
        marginTop: '5%'
    },
    text3: {
        fontSize: 20,
        color: '#ffffff',
        marginLeft: "34%",
        marginTop: '5%',
        marginBottom: '5%'
    },
    text2: {
        fontSize: 20,
        color: '#ffffff',
        marginTop: '2%',
        marginLeft: '7%',
        marginBottom: '5%',
    },
    body: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '1%',
        paddingBottom: '3%',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
    },
    body1: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '5%',
        paddingBottom: '1%',
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
    },
    footer: {},
    playerSearch: {
        flexDirection: 'row',
        width: '100%',
        marginTop: '5%',

    },
    input: {
        paddingLeft: 6,
        height: 30,
        backgroundColor: '#ffffe6',
        width: 100,
        borderRadius: 20,
        marginTop: 5,
        marginLeft: 5,
    },
    playerButton: {
        backgroundColor: '#ec7874',
        marginTop: '1%',
        marginLeft: '5%',
        height: 35,
        width: 100,
        borderRadius: 20,
        alignItems: 'center',

    },
    favouriteButton: {
        backgroundColor: '#ec7874',
        marginTop: '1%',
        marginLeft: '5%',
        height: 35,
        width: 120,
        borderRadius: 20,
        alignItems: 'center',
    },
    playerButtonText: {
        fontSize: 20,
        color: '#ffffff',
        marginTop: 6,
    },
    playerView: {
        backgroundColor: "#ec7874",
        width: '70%',
        borderRadius: 20,
        padding: 10,
        marginTop: 10,
        alignItems: 'center',

    },
    dropdown: {
        backgroundColor: "#ec7874",
        width: '90%',
        borderRadius: 20,
        height: 50,

    },
    container1: {
        height: '75%',
        width: '100%',

    },
    scrollView: {},
    titleView1: {
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        backgroundColor: '#000000',
        flexDirection: 'row',
        width: '100%',
    },
    titleView2: {
        borderBottomColor: '#ffffff',
        borderBottomWidth: 1,
        backgroundColor: '#000000',
    },
});