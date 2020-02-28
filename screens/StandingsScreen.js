import React, {Component} from "react";
import {Button, Image, StyleSheet, Text, View, Picker, SafeAreaView, ScrollView} from 'react-native';
import {Table, TableWrapper, Row, Rows, Col, Cols, Cell} from 'react-native-table-component';

export default class StandingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            league: "",
            tableHead: "",
            tableContent: null,
            leagueTable: []
        }
    }

    updateLeague = (league) => {
        this.setState({tableHead: "",tableContent: null});
        fetch("https://api.footystats.org/league-tables?key=example&league_id=" + league)
            .then(response => response.json())
            .then(data => {
                let leagueTable = data.data.league_table;
                let tableHead = ['Rank', 'Team', 'Won', 'Drew', 'Lost', 'Points'];
                let tableContent = leagueTable.map((lt) => {
                    return [lt.position, lt.cleanName,
                        (lt.seasonWins_home + lt.seasonWins_away),
                        (lt.seasonDraws_home + lt.seasonDraws_away),
                        (lt.seasonLosses_home + lt.seasonLosses_away),
                        lt.points];
                });
                this.setState({leagueTable: leagueTable, tableHead: tableHead, tableContent: tableContent})

            });
        this.setState({league: league})

    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.pink}/>
                <View style={styles.header}>
                    <Text style={styles.title}>Standings</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.dropdown}>
                        <Picker selectedValue={this.state.league}
                                onValueChange={this.updateLeague}
                                itemStyle={{height: '100%'}}>
                            <Picker.Item label=" select a league " value="info"/>
                            <Picker.Item label="Premier League" value="1625"/>
                            <Picker.Item label="La Liga" value="1"/>
                            <Picker.Item label="Bundesliga" value="2"/>
                        </Picker>
                    </View>
                    {(this.state.tableContent != null)&&
                        <SafeAreaView style={styles.container1}>
                        <ScrollView style={styles.scrollView}>
                        <Table style={styles.table}>
                        <Row data={this.state.tableHead}/>
                        <Rows data={this.state.tableContent}/>
                        </Table>
                        </ScrollView>
                        </SafeAreaView>
                    }
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
        marginTop: '5%',
    },
    footer: {
        alignItems: 'center',
        marginTop: '5%',
    },
    dropdown: {
        backgroundColor: "#ec7874",
        width: '90%',
        borderRadius: 20,
        height: 50,
    },
    text: {
        fontSize: 20,
        color: '#ffffff',
        marginTop: '2%',
    },
    container1: {
        height: '80%',
        width: '100%',
        marginTop: '5%',
    },
    scrollView: {
        backgroundColor: "#ec7874",
        marginHorizontal: 20,
        borderRadius: 20,
    },
    table: {
    },
});