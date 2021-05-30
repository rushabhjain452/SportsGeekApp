import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    LogBox,
    RefreshControl,
    Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import SwipeList from 'react-native-smooth-swipe-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import showSweetAlert from '../../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../../config';
import { Card } from 'react-native-elements';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

const TeamScreen = ({ navigation }) => {

    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const [data, setData] = useState([]);
    const [team, setTeam] = useState('');
    const [btnText, setBtnText] = useState('Add');
    const [teamId, setTeamId] = useState(0);
    const [shortName, setShortName] = useState('');
    const [teamLogo, setTeamLogo] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
    }, []);


    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        displayTeam(token);
        setTeam('');
        setTeamLogo('');
        setShortName('');
    }, [refreshing]);

    const displayTeam = (token) => {
        const headers = { 'Authorization': 'Bearer ' + token }
        axios.get(baseurl + '/teams', { headers })
            .then(response => {
                setLoading(false);
                setRefreshing(false);
                if (response.status == 200) {
                    setData(response.data);
                }
                else {
                    showSweetAlert('error', 'Network Error', errorMessage);
                }
            })
            .catch(error => {
                setLoading(false);
                setRefreshing(false);
                showSweetAlert('error', 'Network Error', errorMessage);
            })
    }

    const addTeam = () => {
        // console.log(data.gender);
        // console.log(baseurl+'/gender');
        if (team != '' && shortName != '') {
            fetch(baseurl + '/team', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: team,
                    shortName: shortName,
                    teamLogo: teamLogo
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.code == 201) {
                        showSweetAlert('success', 'Success', 'Team added successfully.');
                        displayTeam();
                    }
                    else
                        showSweetAlert('error', 'Error', 'Failed to add Team. Please try again...');
                    setVenue('');
                })
                .catch((error) => {
                    showSweetAlert('error', 'Error', 'Failed to add Team. Please try again...');
                });
        } else {
            showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Team.');
        }
    }

    const deleteTeam = (id) => {
        const headers = { 'Authorization': 'Bearer ' + token }
        axios.delete(baseurl + '/teams/' + id, { headers })
            .then((response) => {
                setLoading(false);
                if (response.status == 200) {
                    showSweetAlert('success', 'Success', 'Team deleted successfully.');
                    displayTeam(token);
                }
                else {
                    showSweetAlert('error', 'Error', 'Failed to delete Team. Please try again...');
                }
                setTeam('');
                setTeamLogo('');
                setShortName('');
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
                showSweetAlert('error', 'Error', 'Failed to delete Team. Please try again...');
            })
    }

    const editVenue = (teamId, name, shortName, teamLogo) => {
        setTeam(name);
        setBtnText('Update');
        setTeamId(teamId);
        setTeamLogo(teamLogo);
        setShortName(shortName);
    }

    const updateTeam = () => {
        if (team != '' && shortName != '') {
            fetch(baseurl + '/team/' + teamId, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: team,
                    shortName: shortName,
                    teamLogo: teamLogo
                })
            })
                .then((response) => response.json())
                .then((json) => {
                    if (json.code == 201) {
                        showSweetAlert('success', 'Success', 'Team updated successfully.');
                        displayTeam();
                    }
                    else
                        showSweetAlert('error', 'Error', 'Failed to update Team. Please try again...');
                    setTeam('');
                    setShortName('');
                    setBtnText('Add');
                })
                .catch((error) => {
                    showSweetAlert('error', 'Error', 'Failed to update Team. Please try again...');
                });
        } else {
            showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Team.');
        }
    }

    const launchImageLibrary = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        // ImagePicker.launchImageLibrary(options, (response) => {
        //   console.log('Response = ', response);

        //   if (response.didCancel) {
        //     console.log('User cancelled image picker');
        //   } else if (response.error) {
        //     console.log('ImagePicker Error: ', response.error);
        //   } else if (response.customButton) {
        //     console.log('User tapped custom button: ', response.customButton);
        //     alert(response.customButton);
        //   } else {
        //     const source = { uri: response.uri };
        //     console.log('response', JSON.stringify(response));
        //     this.setState({
        //       filePath: response,
        //       fileData: response.data,
        //       fileUri: response.uri
        //     });
        //   }
        // });
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#19398A' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Team Details</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Team Name</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="keyboard-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Enter Team Name"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setTeam(val)}
                            value={team}
                            maxLength={20}
                        />
                        {(team != '') ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Team Short Name</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="keyboard-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Enter Team Short Name"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setShortName(val)}
                            value={shortName}
                            maxLength={20}
                        />
                        {(shortName != '') ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Team Logo</Text>
                    <View style={styles.imageUploadCard}>
                        <TouchableOpacity onPress={launchImageLibrary}>
                            <Card.Image style={styles.imageuploadStyle} source={{ uri: "https://firebasestorage.googleapis.com/v0/b/sportsgeek-74e1e.appspot.com/o/49d6ea02-1daf-4844-ad14-740b02a930f1.png?alt=media&token=e9924ea4-c2d9-4782-bc2d-0fe734431c86" }} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={(btnText == 'Add') ? addTeam : updateTeam}
                            style={[styles.signIn, {
                                borderColor: '#19398A',
                                borderWidth: 1,
                                marginTop: 10,
                                marginBottom: 20
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#19398A'
                            }]}>{btnText}</Text>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={[styles.card]}>
            <SwipeList rowData={
                data.map((item) => ({
                    id: item.genderId,
                    rowView: getRowView(item),
                    leftSubView: getUpdateButton(item.genderId, item.name), //optional
                    rightSubView: getDeleteButton(item.genderId), //optional
                    style: styles.row, //optional but recommended to style your rows
                    useNativeDriver: false 
                }))
            }
             />
            </View> */}
                    {
                        data.map((item, index) => (
                            <View style={styles.card} key={item.teamId} >
                                <View style={styles.cardlist}>
                                    <View>
                                        <Card.Image style={styles.ellipse1} source={{ uri: item.teamLogo }} />
                                        {/* <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>{(item.name).substr(0,1)}</Text> */}
                                    </View>
                                    <Text style={[styles.carditem, { width: '15%', paddingLeft: 20 }]}>{item.shortName}</Text>
                                    <Text style={[styles.carditem, { width: '50%', paddingLeft: 20 }]}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => { editVenue(item.teamId, item.name) }} style={{ width: '10%' }}><Text style={[styles.carditem]}><Icon name="circle-edit-outline" color="#19398A" size={30} /></Text></TouchableOpacity>
                                    <TouchableOpacity onPress={() => { deleteTeam(item.teamId) }} style={{ width: '10%' }}><Text style={[styles.carditem]}><Icon name="delete-circle-outline" color="#19398A" size={30} /></Text></TouchableOpacity>
                                </View>
                            </View>
                        ))
                    }

                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default TeamScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#19398A',
    },
    container2: {
        // height:50,
        flex: 1,
        // paddingHorizontal: 20,
        // paddingVertical: 5,
        paddingHorizontal: 30,
        marginRight: 20,
        color: '#19398A',
        backgroundColor: '#f00',
        alignItems: 'stretch',
        justifyContent: 'center',
        alignSelf: 'stretch'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 30
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18,

    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 1
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        // borderBottomWidth: 1
    },
    button: {
        alignItems: 'center',
        // marginTop: 20
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
    color_textPrivate: {
        color: 'grey'
    },
    row: {
        alignSelf: 'stretch',
        paddingBottom: 10,
        paddingTop: 5,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#808080',
        backgroundColor: '#FFF'
    },
    card: {
        width: '100%',
        height: 65,
        backgroundColor: "#E6E6E6",
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 3,
        marginTop: 5,
        // marginLeft: 8,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3
    },
    text_header1: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginTop: 50
    },
    cardlist: {
        display: "flex",
        flexDirection: "row",
        marginTop: 4,
        justifyContent: "space-between",
    },
    ellipse1: {
        width: 40,
        height: 40,
        //   marginTop: 0,
        borderRadius: 100,
        marginLeft: 10,
        justifyContent: 'center',
        //   backgroundColor: '#e9c46a'
    },
    carditem: {
        color: "#121212",
        fontSize: 20,
        marginLeft: 3,
        marginTop: 5,
        fontWeight: "bold",
        display: 'flex',
        //    backgroundColor:'red'
        //    justifyContent: 'space-between',  
        //    textAlign: 'center'
    },
    imageUploadCard: {
        width: '100%',
        height: 120,
        backgroundColor: "#D5DBDB",
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 3,
        marginTop: 5,
        // marginLeft: 8,
        display: "flex",
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3
    },
    imageuploadStyle: {
        width: 100,
        height: 100,
        marginTop: 7,
        borderRadius: 80,
        marginLeft: '45%',
        justifyContent: 'center',
        //   backgroundColor: 'white'
    }
});