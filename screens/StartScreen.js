import React, {Component} from "react";
import {
    Button,
    Image,
    Picker,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
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
        }
    }

    openFavouritePlayers() {
        if (this.state.showFavouritePlayers === false) {
            this.setState({sourcePlayers: []});
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
                const dbPlayers = Object.values(snapshot.val());
                this.setState({dbPlayers});
            });
            console.log(this.state.dbPlayers);
            console.log(this.state.dbPlayers.length);

            for (let i = 0; i < this.state.dbPlayers.length; i++) {
                fetch("https://api.footystats.org/league-players?key=example&league_id=" + this.state.dbPlayers[i].favouritePlayerLeague)
                    .then(response => response.json())
                    .then(data => {
                        let leaguePlayers = data.data;
                        this.setState({leaguePlayers: leaguePlayers});
                    });
                console.log(this.state.leaguePlayers.length);
                for (let j = 0; j < this.state.leaguePlayers.length; j++) {
                    if (this.state.leaguePlayers[j].id === this.state.dbPlayers[i].favouritePlayer) {
                        this.state.sourcePlayers.push(this.state.leaguePlayers[j]);
                        console.log("found");
                        console.log(this.state.sourcePlayers.length)
                    }
                }
            }
            console.log(this.state.sourcePlayers);
            let table1Content = this.state.sourcePlayers.map((fp) => {
                return [fp.known_as, '\n','Age:' + fp.age];
            });
            this.setState({showFavouritePlayers: true, table1Content: table1Content});
        } else {
            this.setState({showFavouritePlayers: false});
        }
    }


    openFavouriteTeams() {
        if (this.state.showFavouriteTeams === false) {
            this.setState({sourceTeams: []});
            firebase.database().ref('users/' + firebase.auth().currentUser.uid).on('value', (snapshot) => {
                const dbTeams = Object.values(snapshot.val());
                this.setState({dbTeams});
            });
            console.log(this.state.dbTeams);
            console.log(this.state.dbTeams.length);

            for (let i = 0; i < this.state.dbTeams.length; i++) {
                fetch("https://api.footystats.org/league-teams?key=example&league_id=" + this.state.dbTeams[i].favouriteTeamLeague)
                    .then(response => response.json())
                    .then(data => {
                        let leagueTeams = data.data;
                        this.setState({leagueTeams: leagueTeams});
                    });
                console.log(this.state.leagueTeams.length);
                for (let j = 0; j < this.state.leagueTeams.length; j++) {
                    if (this.state.leagueTeams[j].id === this.state.dbTeams[i].favouriteTeam) {
                        this.state.sourceTeams.push(this.state.leagueTeams[j]);
                        console.log("found");
                        console.log(this.state.sourceTeams.length)
                    }
                }
            }
            console.log(this.state.sourceTeams);
            let table2Content = this.state.sourceTeams.map((fp) => {
                return [fp.cleanName, '\n','Founded:' + fp.founded];
            });
            this.setState({showFavouriteTeams: true, table2Content: table2Content});
        } else {
            this.setState({showFavouriteTeams: false});
        }

    }

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
                        {(this.state.showFavouritePlayers === true) &&
                        <Table style={styles.table}>
                            <Row data={this.state.table1Head}/>
                            <Rows data={this.state.table1Content}/>
                        </Table>
                        }
                        <TouchableOpacity style={styles.titleView2} onPress={() => this.openFavouriteTeams()}>
                            <Text style={styles.text3}>Favourite Teams</Text>
                        </TouchableOpacity>
                        {(this.state.showFavouriteTeams === true) &&
                        <Table style={styles.table}>
                            <Row data={this.state.table2Head}/>
                            <Rows data={this.state.table2Content}/>
                        </Table>
                        }
                    </ScrollView>
                </SafeAreaView>
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
        borderBottomWidth: 1,
        backgroundColor: '#000000',
    },
    emptySpace:{
        height: '3%',
        backgroundColor: '#404040',
    },
    table: {
        backgroundColor: "#ec7874",
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 20,
        paddingLeft: '4%',
    },
    favPlayers: {
        backgroundColor: '#ff0000',
        width: '100%',

    }
});