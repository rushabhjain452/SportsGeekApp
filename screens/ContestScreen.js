import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    FlatList,
    ScrollView
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Card } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from 'react-native-paper';
import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../config';

import { AuthContext } from '../components/context';
import { log } from 'react-native-reanimated';
// import { FlatList, ScrollView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

// import Users from '../model/User';

const ContestScreen = (props) => {

    const { matchId } = props.route.params;

    const navigation = useNavigation();

    const [selectedTeamId, setSelectedTeamId] = useState(0);
    const [points, setPoints] = useState(0);
    const [oldPoints, setOldPoints] = useState(0);

    const [data, setData] = useState([]);
    const [matchData, setMatchData] = useState({});
    const [loading, setLoading] = useState(true);

    const [userId, setUserId] = useState(0);
    const [username, setUsername] = useState('');
    const [availablePoints, setAvailablePoints] = useState(0);
    const [tempAvailablePoints, setTempAvailablePoints] = useState(0);
    const [option, setOption] = useState('insert');
    const [contestId, setContestId] = useState(0);

    const [refreshing, setRefreshing] = useState(false);
    const [waiting, setWaiting] = React.useState(true);

    const [team1BetPoints, setTeam1BetPoints] = useState(0);
    const [team2BetPoints, setTeam2BetPoints] = useState(0);

    const [token, setToken] = useState('');

    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        // Get UserId
        const userId = await AsyncStorage.getItem('userId');
        setUserId(userId);
        const username = await AsyncStorage.getItem('username');
        setUsername(username);
        checkUserContest(userId, token);
        fetchUserData(userId, token);
        fetchMatchData(token);
        // fetchData(token);
    }, [refreshing]);

    const checkUserContest = (userId, token) => {
        const headers = { 'Authorization': 'Bearer ' + token };
        axios.get(baseurl + '/users/' + userId + '/contest/' + matchId, { headers })
            .then((response) => {
                if (response.status == 200) {
                    setPoints(response.data.contestPoints);
                    setOldPoints(response.data.contestPoints);
                    // console.log('checkUserContest : ' + typeof(json.data.contestPoints));
                    // console.log(typeof(json.data.contestPoints));
                    // console.log(json.data.contestPoints);
                    setSelectedTeamId(response.data.teamId);
                    setContestId(response.data.contestId);
                    setOption('update');
                } else {
                    setOldPoints(0);
                }
            })
            .catch((error) => {
                setOldPoints(0);
                // const response = error.message;
                // console.log('Error 1');
                // console.log(error);
                // showSweetAlert('error', 'Network Error', errorMessage);
            });
    }

    // BetOnTeam data
    const fetchData = (token, matchData) => {
        const headers = { 'Authorization': 'Bearer ' + token };
        axios.get(baseurl + '/matches/' + matchId + '/contest', { headers })
            .then((response) => {
                setLoading(false);
                setRefreshing(false);
                setWaiting(false);
                if (response.status == 200) {
                    setData(response.data);
                    let records = response.data;
                    let team1points = 0, team2points = 0;
                    // console.log(records);
                    // console.log(matchData.team1Id);
                    // console.log(matchData.team2Id);
                    records.forEach((item) => {
                        // if(item.teamId == matchData.team1Id){
                        //     // setTeam1BetPoints(oldPoints => oldPoints + item.contestPoints);
                        //     team1points += item.contestPoints;
                        // }else if(item.teamId == matchData.team2Id){
                        //     // setTeam2BetPoints(oldPoints => oldPoints + item.contestPoints);
                        //     team2points += item.contestPoints;
                        // }
                        if (item.teamShortName == matchData.team1Short) {
                            team1points += item.contestPoints;
                        } else if (item.teamShortName == matchData.team2Short) {
                            team2points += item.contestPoints;
                        }
                    });
                    // console.log(team1points + ' ' + team2points);
                    setTeam1BetPoints(team1points);
                    setTeam2BetPoints(team2points);
                } else {
                    console.log('Error 2');
                    console.log(error);
                    showSweetAlert('error', 'Network Error', errorMessage);
                }
            })
            .catch((error) => {
                setLoading(false);
                setRefreshing(false);
                setWaiting(false);
                console.log('Error 2');
                console.log(error);
                showSweetAlert('error', 'Network Error', errorMessage);
            });
    }

    // Matches Data
    const fetchMatchData = (token) => {
        const headers = { 'Authorization': 'Bearer ' + token };
        axios.get(baseurl + '/matches/' + matchId, { headers })
            .then((response) => {
                if (response.status == 200) {
                    setMatchData(response.data);
                    fetchData(token, response.data);
                } else {
                    setMatchData([]);
                }
            })
            .catch((error) => {
                console.log('Error 3');
                showSweetAlert('error', 'Network Error', errorMessage);
            })
    }
    // User data
    const fetchUserData = (userId, token) => {
        const headers = { 'Authorization': 'Bearer ' + token };
        axios.get(baseurl + '/users/' + userId, { headers })
            .then((response) => {
                if (response.status == 200) {
                    setAvailablePoints(response.data.availablePoints);
                    setTempAvailablePoints(response.data.availablePoints);
                } else {
                    showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch User\'s available points. Please try again after sometime.');
                }
            })
            .catch((error) => {
                console.log('Error 4');
                showSweetAlert('error', 'Network Error', errorMessage);
            })
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // fetchData(token);
        // fetchMatchData(token);
        // fetchUserData(userId, token);
    }, []);

    const { colors } = useTheme();

    const contestHandler = () => {
        let current_datetime = new Date();
        let str = matchData.startDatetime;
        // let match_datetime = new Date(str);
        // console.log('MatchDatetime : ' + str);
        // console.log('Match Date : ' + match_datetime.toISOString());
        // console.log('Match Date toString : ' + match_datetime.toString());
        // console.log('Formatted : ' + match_datetime.getDate() + '/' + ( match_datetime.getMonth()+1) + '/' + match_datetime.getFullYear());
        // console.log('UTC : ' + match_datetime.getUTCDate() + '/' + (match_datetime.getUTCMonth()+1) + '/' + match_datetime.getUTCFullYear() + '  ' + match_datetime.getUTCHours() + ':' + match_datetime.getUTCMinutes() + ':' + match_datetime.getUTCSeconds());
        // console.log('Current Date : ' + current_datetime.toISOString());
        // console.log('Type : ' + typeof(match_datetime));
        // new Date(year, monthIndex [, day [, hours [, minutes [, seconds [, milliseconds]]]]])
        let matchDate = new Date(str);
        let match_date = new Date(matchDate.getUTCFullYear(), matchDate.getUTCMonth(), matchDate.getUTCDate(), matchDate.getUTCHours(), matchDate.getUTCMinutes(), matchDate.getUTCSeconds());
        // console.log('MatchDatetime : ' + match_date.toString());
        // console.log('CurrentDatetime : ' + current_datetime.toString());
        // console.log(match_date - current_datetime);
        // console.log(match_date < current_datetime);
        if (selectedTeamId == 0) {
            showSweetAlert('warning', 'Team not selected', "Please select you Team for Contest.");
        }
        else if (points < 1) {
            showSweetAlert('warning', 'Invalid Contest Points', "Please enter valid value for Contest points.");
        }
        else if (points != parseInt(points)) {
            showSweetAlert('warning', 'Invalid Contest Points', "Contest points must be an integer value.");
        }
        else if (points < matchData.minimumPoints) {
            showSweetAlert('warning', 'Invalid Contest Points', "Please enter Contest points greater than minimum limit of " + matchData.minimumPoints);
        }
        else if (match_date < current_datetime) {
            showSweetAlert('warning', 'Match time out', "Sorry, the match has already started, so the contests for this match are closed now.");
        }
        else {
            // LOGS
            // console.log('userId : ' + userId);
            // console.log('matchId : ' + matchId);
            // console.log('selectedTeamId : ' + selectedTeamId);
            // console.log('points : ' + points);

            setWaiting(true);
            // console.log(parseInt(points));
            if (option == 'insert') {
                console.log('insert');
                // console.log('Type before insert : ' + typeof(points));
                if (parseInt(points) > parseInt(availablePoints)) {
                    setWaiting(false);
                    showSweetAlert('warning', 'Insufficient Points', "Your have only " + parseInt(availablePoints) + " available points.");
                }
                else {
                    const reqData = {
                        userId: userId,
                        matchId: matchId,
                        teamId: selectedTeamId,
                        contestPoints: parseInt(points),
                        winningPoints: 0
                    };
                    console.log(reqData);
                    const headers = { 'Authorization': 'Bearer ' + token };
                    axios.post(baseurl + '/contest', reqData, { headers })
                        .then((response) => {
                            setWaiting(false);
                            if (response.status == 201) {
                                setAvailablePoints((availablePoints) => parseInt(availablePoints) - parseInt(points));
                                setOldPoints(parseInt(points));
                                setContestId(response.data.contestId);
                                // console.log('Insert success : BetTeamId = ' + json.data.contestId);
                                // console.log('Insert : ' + typeof(points));
                                fetchData(token, matchData);
                                // fetchMatchData(token);
                                fetchUserData(userId, token);
                                setOption('update');
                                showSweetAlert('success', 'Contest placed successfully', "Your contest for " + parseInt(points) + " points is placed successfully.");
                            }
                            else {
                                console.log(response.status);
                                showSweetAlert('warning', 'Network Error', 'Something went wrong. Please check your internet connection or try again after sometime...');
                            }
                        })
                        .catch((error) => {
                            setWaiting(false);
                            console.log(error);
                            showSweetAlert('error', 'Network Error', errorMessage);
                        });
                }
            }
            else if (option == 'update') {
                console.log('update');
                let balance = parseInt(availablePoints) + parseInt(oldPoints);
                if (parseInt(points) > balance) {
                    setWaiting(false);
                    showSweetAlert('warning', 'Insufficient Points', "Your have only " + (balance) + " available points.");
                }
                else {
                    const reqData = {
                        userId: userId,
                        matchId: matchId,
                        teamId: selectedTeamId,
                        contestPoints: parseInt(points),
                        winningPoints: 0
                    };
                    console.log(reqData);
                    const headers = { 'Authorization': 'Bearer ' + token };
                    axios.put(baseurl + '/contest/' + contestId, reqData, { headers })
                        .then((response) => {
                            setWaiting(false);
                            if (response.status == 200) {
                                setAvailablePoints((availablePoints) => parseInt(availablePoints) + parseInt(oldPoints) - parseInt(points));
                                // console.log('After update : ' + typeof(oldPoints));
                                setOldPoints(points);
                                setContestId(response.data.contestId);
                                // console.log('Update success : BetTeamId = ' + json.data.contestId);
                                fetchData(token, matchData);
                                fetchUserData(userId, token);
                                // showSweetAlert('success', 'Contest updated successfully', "Your contest is updated from " + oldPoints + " points to " + points + " points.");
                                showSweetAlert('success', 'Contest updated successfully', "Your contest is updated to " + parseInt(points) + " points.");
                            }
                            else {
                                console.log(request.status);
                                showSweetAlert('warning', 'Network Error', 'Something went wrong. Please check your internet connection or try again after sometime...');
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setWaiting(false);
                            showSweetAlert('error', 'Network Error', errorMessage);
                        });
                }
            }
        }
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
            <Spinner visible={waiting} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
            {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
            <View>
                <StatusBar backgroundColor='#19398A' barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Place Contest</Text>
                </View>
                <Animatable.View
                    animation="fadeInUpBig"
                    style={[styles.footer, {
                        backgroundColor: colors.background
                    }]}
                >
                    <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Text>Available Points : {availablePoints}</Text>
                        <Text>Minimum Points : {matchData.minimumPoints}</Text>
                    </View>
                    {/* <Text>Minimum Contest Points : {matchData.minimumPoints}</Text> */}
                    <View style={styles.action}>
                        <TouchableOpacity
                            style={styles.radioCircle}
                            onPress={() => { setSelectedTeamId(matchData.team1Id) }}>
                            {selectedTeamId == matchData.team1Id && <View style={styles.selectedRb} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rect} onPress={() => setSelectedTeamId(matchData.team1Id)}>
                            <View style={styles.ellipseRow}>
                                <Card.Image style={styles.ellipse} source={{ uri: matchData.team1Logo }} />
                                <Text style={styles.mI}>{matchData.team1Short}</Text>
                            </View>
                            <View>
                                <Text style={styles.txtBetPoints}>{team1BetPoints}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.radioCircle}
                            onPress={() => { setSelectedTeamId(matchData.team2Id) }}>
                            {selectedTeamId == matchData.team2Id && <View style={styles.selectedRb} />}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.rect} onPress={() => { setSelectedTeamId(matchData.team2Id) }}>
                            <View style={styles.ellipseRow}>
                                <Card.Image style={styles.ellipse} source={{ uri: matchData.team2Logo }} />
                                <Text style={styles.mI}>{matchData.team2Short}</Text>
                            </View>
                            <View>
                                <Text style={styles.txtBetPoints}>{team2BetPoints}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.text_footer, {
                        color: colors.text
                    }]}>Contest Points (Remaining Points: {tempAvailablePoints > 0 ? tempAvailablePoints : 0})
            </Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="money"
                            color={colors.text}
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Contest Points"
                            placeholderTextColor="#666666"
                            keyboardType="numeric"
                            style={[styles.textInput, {
                                color: colors.text
                            }]}
                            onChangeText={(val) => {
                                setPoints(val)
                                // console.log(val);
                                let contestPoints = 0;
                                if (val == '')
                                    contestPoints = 0;
                                else {
                                    contestPoints = parseInt(val);
                                    if (isNaN(contestPoints) || contestPoints < 0) {
                                        contestPoints = 0;
                                    }
                                }
                                setTempAvailablePoints(parseInt(availablePoints) + parseInt(oldPoints) - contestPoints);
                                // console.log(contestPoints);
                            }}
                            value={points.toString()}
                        />
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => { contestHandler() }}
                            style={[styles.signIn, {
                                borderColor: '#19398A',
                                borderWidth: 1,
                                // marginTop: 5
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#19398A'
                            }]}>
                                {option == 'insert' ? 'Place Contest' : 'Update Contest'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.text_header1}>User Participated in this Contest</Text>
                    {data.length == 0 && (<Text style={{ marginTop: 20, fontSize: 15 }}>No users have placed contest on this match.</Text>)}
                    {
                        data.length > 0 && data.map((item, index) => {
                            {/* console.log(item.username + ' ' + userId); */ }
                            const mystyle = item.username == username ? styles.bgDark : styles.bgLight;
                            return (
                                <View style={[styles.card, mystyle]} key={item.contestId}>
                                    <View style={styles.cardlist}>
                                        {/* <Card.Image style={styles.ellipse1} source={{uri: item.profilePicture}} /> */}
                                        <View style={styles.ellipse1}>
                                            {/* <Text>{item.firstName.toString().chatAt(0) + item.lastName.toString().chatAt(0)}</Text> */}
                                            <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{item.firstName.substr(0, 1) + item.lastName.substr(0, 1)}</Text>
                                            {/* <Text>{typeof(item.firstName)}</Text> */}
                                        </View>
                                        <Text style={[styles.carditem, { width: '53%', fontSize: 17 }]}>{item.firstName + " " + item.lastName}</Text>
                                        <Text style={[styles.carditem, { width: '17%' }]}>{item.teamShortName}</Text>
                                        <Text style={[styles.carditem, { width: '15%' }]}>{item.contestPoints}</Text>
                                    </View>
                                </View>
                            )
                        })
                    }
                </Animatable.View>
            </View>
        </ScrollView>
    );
};

export default ContestScreen;

const { height } = Dimensions.get("screen");
const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#19398A'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 30,
        marginTop: 30
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 20
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 16
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 15
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    radioCircle: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#3740ff',
        alignItems: 'center',
        justifyContent: 'center',
        // marginLeft:20 ,
        marginTop: 40,
        marginLeft: 5
    },
    selectedRb: {
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: '#19398A',
    },
    ellipseRow: {
        // height: 95,
        display: "flex",
        flexDirection: "row",
        marginTop: 8,
        //   marginLeft: 25,
        // alignSelf: "flex-start"
        // flex: 4,
        //   justifyContent: "space-between",
    },
    ellipse: {
        width: 60,
        height: 60,
        marginTop: 0,
        borderRadius: 30,
        marginLeft: 7
    },
    mI: {
        fontFamily: "roboto-regular",
        color: "#121212",
        fontSize: 18,
        marginLeft: 10,
        marginTop: 20,
        fontWeight: "bold"
    },
    rect: {
        width: '39%',
        height: 110,
        backgroundColor: "#E6E6E6",
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 10,
        //   marginTop: 10,
        marginLeft: 8,
        display: "flex",
        flexDirection: 'column',
        //    justifyContent: 'space-between',
        marginBottom: 30
    },
    card: {
        width: '100%',
        height: 50,
        // backgroundColor: "#E6E6E6",
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 3,
        marginTop: 5,
        // marginLeft: 8,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        //  marginBottom:50
    },
    bgLight: {
        backgroundColor: "#E6E6E6",
    },
    bgDark: {
        // backgroundColor: "#98FB98",
        backgroundColor: '#87CEFA'
    },
    text_header1: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 30
    },
    cardlist: {
        display: "flex",
        flexDirection: "row",
        marginTop: 4,
        justifyContent: "space-between",
    },
    ellipse1: {
        width: 30,
        height: 30,
        //   marginTop: 0,
        borderRadius: 100,
        marginLeft: 5,
        justifyContent: 'center',
        backgroundColor: '#e9c46a'
    },
    carditem: {
        color: "#121212",
        fontSize: 20,
        marginLeft: 3,
        marginTop: 5,
        fontWeight: "bold",
        display: 'flex',
        justifyContent: 'space-between',
        //    textAlign: 'center'
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    txtBetPoints: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10
    }
});