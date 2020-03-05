import React, {Component} from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as firebase from "firebase";
import {Row, Rows, Table} from "react-native-table-component";

export default class StartScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dbPlayers: [],
            dbTeams: [],
            showFavouritePlayers: false,
            showFavouriteTeams: false,
            table1Head: "",
            table1Content: null,
            table2Head: "",
            table2Content: null,
            leaguePlayers: [],
            leagueTeams: [],
            sourcePlayers: [],
            sourceTeams: [],
            error: "",
        }
    }

    openFavouritePlayer() {

    }
    openFavouriteTeam() {

    }
    deleteFavourite(deletePlayer) {

        Alert.alert(
            'Attention',
            'Do you want to delete all your favourites',
            [
                {text: 'Yes', onPress: () => {
                        var adaRef = firebase.database().ref('users/' + firebase.auth().currentUser.uid).child(deletePlayer.key);
                        console.log(adaRef)
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

    openFavouritePlayers = async () => {
        let sourcePlayers = [];
        let leaguePlayers;
        let error = "";
        if (!this.state.showFavouritePlayers) {
            let dbPlayers = [];

            await firebase.database().ref('users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
                if(snapshot.val() != null){
                const values = snapshot.val();
                    dbPlayers = Object.keys(values).map(key=>({
                        ...values[key],
                        key: key,
                    }));
                }else{
                   error = "no favourite Players found";
                }
            });
            for (let i = 0; i < dbPlayers.length; i++) {
                const response = await fetch("https://api.footystats.org/league-players?key=example&league_id=" + dbPlayers[i].favouritePlayerLeague);
                const data = await response.json();
                leaguePlayers = data.data;
                for (let j = 0; j < leaguePlayers.length; j++) {
                    if (leaguePlayers[j].id === dbPlayers[i].favouritePlayer) {
                        sourcePlayers.push(leaguePlayers[j]);
                    }
                }
            }
            let table1Content = sourcePlayers.map((fp, i) => {
                return (
                    <View key={i} style={styles.playerList}>
                        <Text style={styles.NameText}>
                            {fp.known_as}
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.openFavouritePlayer()}>
                            <Text style={styles.buttonText}>open favourite</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteFavourite(dbPlayers[i])}>
                            <Text style={styles.buttonText}>delete favourite</Text>
                        </TouchableOpacity>
                    </View>
                );
            });
            this.setState({dbPlayers, sourcePlayers, leaguePlayers, table1Content,error, showFavouritePlayers: true});
        } else {
            this.setState({showFavouritePlayers: false, error});
        }
    };

    openFavouriteTeams = async () => {
        let sourceTeams = [];
        let leagueTeams;
        let error = "";
        if (!this.state.showFavouriteTeams) {
            let dbTeams = [];

            await firebase.database().ref('users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
                if(snapshot.val() != null) {
                    const values = snapshot.val();
                    dbTeams = Object.keys(values).map(key => ({
                        ...values[key],
                        key: key,
                    }));
                }else{
                    error = "no favourite Teams found";
                }
            });
            for (let i = 0; i < dbTeams.length; i++) {
                const response = await fetch("https://api.footystats.org/league-teams?key=example&league_id=" + dbTeams[i].favouriteTeamLeague);
                const data = await response.json();
                leagueTeams = data.data;
                for (let j = 0; j < leagueTeams.length; j++) {
                    if (leagueTeams[j].id === dbTeams[i].favouriteTeam) {
                        sourceTeams.push(leagueTeams[j]);
                    }
                }
            }
            let table2Content = sourceTeams.map((ft, i) => {
                return (
                    <View key={i} style={styles.playerList}>
                        <Text style={styles.NameText}>
                            {ft.cleanName}
                        </Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.openFavouriteTeam()}>
                            <Text style={styles.buttonText}>open favourite</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => this.deleteFavourite(dbTeams[i])}>
                            <Text style={styles.buttonText}>delete favourite</Text>
                        </TouchableOpacity>
                    </View>
                );
            });
            this.setState({dbTeams, sourceTeams, leagueTeams,table2Content,error, showFavouriteTeams: true});
        } else {
            this.setState({showFavouriteTeams: false,error});
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.pink}/>
                <View style={styles.header}>
                    <Text style={styles.title}>Home of Fútbol</Text>
                </View>
                <View style={styles.emptySpace}/>
                <SafeAreaView style={styles.container1}>
                    <ScrollView style={styles.scrollView}>
                        <TouchableOpacity style={styles.titleView1} onPress={() => this.openFavouritePlayers()}>
                            <Text style={styles.text1}>Favourite Players</Text>
                        </TouchableOpacity>
                        {(this.state.showFavouritePlayers && this.state.error === "") &&
                        <Table style={styles.table}>
                            {this.state.table1Content}
                        </Table>
                        }
                        <TouchableOpacity style={styles.titleView2} onPress={() => this.openFavouriteTeams()}>
                            <Text style={styles.text3}>Favourite Teams</Text>
                        </TouchableOpacity>
                        {(this.state.showFavouriteTeams && this.state.error === "") &&
                        <Table style={styles.table}>
                            {this.state.table2Content}
                        </Table>
                        }
                        <View style={styles.error}>
                            <Text style={styles.errorText}>{this.state.error}</Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }

}
const
    styles = StyleSheet.create({
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
        container1: {
            height: '75%',
            width: '100%',
        },
        scrollView: {},
        titleView1: {
            borderBottomColor: '#ffffff',
            borderBottomWidth: 1,
            borderTopColor: '#ffffff',
            borderTopWidth: 1,
            backgroundColor: '#000000',
            flexDirection: 'row',
            width: '100%',
        },
        titleView2: {
            borderBottomColor: '#ffffff',
            borderTopColor: '#ffffff',
            borderBottomWidth: 1,
            borderTopWidth: 1,
            backgroundColor: '#000000',
        },
        emptySpace: {
            height: '3%',
            backgroundColor: '#404040',
        },
        table: {
            backgroundColor: "#404040",
            marginHorizontal: 20,
            marginVertical: 10,
            borderRadius: 20,
        },
        favPlayers: {
            backgroundColor: '#ff0000',
            width: '100%',
        },
        NameText: {
            fontSize: 30,
            marginTop: 10,
            color: 'white',
        },
        playerList: {
            alignItems: 'center',
            marginBottom: 25,
        },
        button: {
            backgroundColor: '#ec7874',
            marginTop: '7%',
            marginLeft: '1%',
            height: 50,
            width: 300,
            borderRadius:20,
            alignItems: 'center',
        },
        buttonText: {
            color: 'white',
            fontSize: 24,
            marginTop: 10,
        },
        error: {
            marginTop: 20,
            alignItems: 'center',

        },
        errorText: {
            color: 'red',
            fontSize: 20
        }
    });