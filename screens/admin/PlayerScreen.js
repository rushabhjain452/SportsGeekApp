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
    StatusBar
} from 'react-native';
import { Card } from 'react-native-elements';
import {
    Dropdown
} from 'sharingan-rn-modal-dropdown';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import SwipeList from 'react-native-smooth-swipe-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import showSweetAlert from '../../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';
import ImagePicker from 'react-native-image-crop-picker';

const PlayerScreen = ({ navigation }) => {

    const userAvatarLogo = 'https://firebasestorage.googleapis.com/v0/b/sportsgeek-74e1e.appspot.com/o/69bba4a0-c114-4379-9854-e4381a3130bc.png?alt=media&token=e9924ea4-c2d9-4782-bc2d-0fe734431c86';

    // LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const [data, setData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [teamId, setTeamId] = useState(0);
    const [playerId, setPlayerId] = useState(0);
    const [playerTypeData, setPlayerTypeData] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [playerTypeId, setPlayerTypeId] = useState(0);
    const [btnText, setBtnText] = useState('Add');
    const [profilePicture, setProfilePicture] = useState(null);
    const [valueSS, setValueSS] = useState('');
    const [token, setToken] = useState('');
    const [avatarPath, setAvatarPath] = useState(userAvatarLogo);
    const [success, setSuccess] = useState(false);

    useEffect(async () => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        displayTeam(token);
        displayPlayerType(token);
        // setPlayerType('');
    }, []);

    const displayTeam = (token) => {
        const headers = { 'Authorization': 'Bearer ' + token }
        axios.get(baseurl + '/teams', { headers })
            .then(response => {
                // setLoading(false);
                // setRefreshing(false);
                if (response.status == 200) {
                    setData(response.data);
                    // console.log(json.data);
                    let dt = response.data;
                    // console.log(dt.length);
                    let arr = [];
                    for (let i = 0; i < dt.length; i++) {
                        arr.push({
                            value: dt[i].teamId,
                            label: dt[i].shortName
                        });
                    }
                    setTeamData(arr);
                }
                else {
                    showSweetAlert('error', 'Network Error', errorMessage);
                }
            })
            .catch(error => {
                // setLoading(false);
                // setRefreshing(false);
                showSweetAlert('error', 'Network Error', errorMessage);
            })
    }

    const displayPlayerType = (token) => {
        const headers = { 'Authorization': 'Bearer ' + token }
        axios.get(baseurl + '/player-types', { headers })
            .then(response => {
                // setLoading(false);
                // setRefreshing(false);
                if (response.status == 200) {
                    setData(response.data);
                    // console.log(json.data);
                    let dt = response.data;
                    // console.log(dt.length);
                    let arr = [];
                    for (let i = 0; i < dt.length; i++) {
                        arr.push({
                            value: dt[i].playerTypeId,
                            label: dt[i].typeName
                        });
                    }
                    setPlayerTypeData(arr);
                }
                else {
                    showSweetAlert('error', 'Network Error', errorMessage);
                }
            })
            .catch(error => {
                // setLoading(false);
                // setRefreshing(false);
                showSweetAlert('error', 'Network Error', errorMessage);
            })
    }
    const photoSelectHandler = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then((image) => {
            if (validateImage(image)) {
                setAvatarPath(image.path);
                setProfilePicture(image);
            }
        }).catch((error) => {
            showSweetAlert('warning', 'Image not selected', 'Image not selected for team Logo.');
        });
    }

    const validateImage = (image) => {
        let result = true;
        if (image.height != image.width) {
            result = false;
            showSweetAlert('warning', 'Image validation failed!', 'Please select a square image.');
        }
        else if (image.mime != "image/jpeg" && image.mime != "image/png" && image.mime != "image/gif") {
            result = false;
            showSweetAlert('warning', 'Image validation failed!', 'Please select image of proper format. Only jpg, png and gif images are allowed.');
        }
        else if (image.size > 10485760) {
            result = false;
            showSweetAlert('warning', 'Image validation failed!', 'Please select image having size less than 10 MB.');
        }
        return result;
    }

    const photoRemoveHandler = () => {
        setAvatarPath(userAvatarLogo);
        setProfilePicture(avatarPath);
    };

    const addPlayer = () => {
        if (playerId == 0){
            showSweetAlert('warning', 'Invalid Input!', 'Please enter Player Id.');
        }
        else if (teamId == 0) {
            showSweetAlert('warning', 'Invalid Input!', 'Please enter Team name greater than 3 characters to proceed.');
        }
        else if (playerName.length < 3) {
            showSweetAlert('warning', 'Invalid Input!', 'Please enter Short name greater than 2 characters to proceed.');
        }
        else if (!profilePicture) {
            showSweetAlert('warning', 'Invalid Input!', 'Please Select Profile Picture.');
        }
        else {
            // setLoading(true);
            // Submitting Form Data (with Profile Picture)
            const formData = new FormData();
            formData.append('playerId', playerId);
            formData.append('teamId', teamId);
            formData.append('name', playerName);
            formData.append('typeId', playerTypeId);
            if (profilePicture == null) {
                formData.append('profilePicture', null);
            } else {
                let picturePath = profilePicture.path;
                let pathParts = picturePath.split('/');
                formData.append('profilePicture', {
                    // name: picturePath.substr(picturePath.lastIndexOf('/') + 1),
                    name: pathParts[pathParts.length - 1],
                    type: profilePicture.mime,
                    uri: profilePicture.path
                });
            }
            const headers = { 'Content-Type': 'multipart/form-data', 'Authorization': 'Bearer ' + token }
            axios.post(baseurl + '/players', formData, { headers })
                .then((response) => {
                    // setLoading(false);
                    if (response.status == 201) {
                        showSweetAlert('success', 'Success', 'Player added successfully.');
                        setSuccess(true);
                        // navigation.goBack();
                        // navigator.navigate('SignInScreen');
                    } else {
                        showSweetAlert('error', 'Network Error', errorMessage);
                    }
                    setPlayerId(0);
                    setPlayerName('');
                    setProfilePicture(null);
                    setAvatarPath(avatarPath);
                    setPlayerTypeId(0);
                    setTeamId(0);
                })
                .catch((error) => {
                    // setLoading(false);
                    // console.log(error);
                    console.log(error);
                        showSweetAlert('error', 'Network Error', errorMessage);
                });
            }
    }

    const onChangeSS = (value) => {
        setTeamId(value);
    };
    const onPlayerSS = (value) => {
        setPlayerTypeId(value);
    };
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#19398A' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Player Details</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView keyboardShouldPersistTaps='handled'>
                <Text style={[styles.text_footer, { marginTop: 35 }]}>Player Id</Text>
                    <View style={styles.action}>
                        <TextInput
                            placeholder="Enter Player Id"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setPlayerId(val)}
                            value={playerId}
                            maxLength={20}
                        />
                        {(playerId != 0) ?
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

                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Team Name</Text>
                    <View style={styles.action}>
                        {/* <FontAwesome 
                    name="mars"
                    color="#05375a"
                    size={20}
                /> */}
                        <Dropdown
                            label="Team Name"
                            data={teamData}
                            enableSearch
                            value={teamId}
                            onChange={onChangeSS}
                        />
                    </View>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Player Name</Text>
                    <View style={styles.action}>
                        <TextInput
                            placeholder="Enter Player Name"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setPlayerName(val)}
                            value={playerName}
                            maxLength={20}
                        />
                        {(playerName != '') ?
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
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Player Type</Text>
                    <View style={styles.action}>
                        {/* <FontAwesome 
                    name="mars"
                    color="#05375a"
                    size={20}
                /> */}
                        <Dropdown
                            label="Player Type"
                            data={playerTypeData}
                            enableSearch
                            value={playerTypeId}
                            onChange={onPlayerSS}
                        />
                    </View>
                    <Text style={[styles.text_footer, { marginTop: 35 }]}>Profile Picture</Text>
                    <View style={styles.imageUploadCard}>
                            <Card.Image style={styles.imageuploadStyle} source={{ uri: avatarPath }} />
                        <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={() => { photoSelectHandler() }}>
                        <Text style={styles.buttonTextStyle}>
                            {profilePicture == null ? <Icon name="account-check" color="#19398A" size={50} /> : <Icon name="account-edit" color="#19398A" size={50} />}
                        </Text>
                    </TouchableOpacity>
                    {profilePicture !=null &&
                        (<TouchableOpacity
                            // style={styles.removeButtonStyle}
                            onPress={() => { photoRemoveHandler() }}>
                            <Text style={styles.buttonTextStyle1}><Icon name="account-cancel" color="#19398A" size={50} /></Text>
                        </TouchableOpacity>)}
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={addPlayer}
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
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default PlayerScreen;

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
        marginTop: 20
    },
    button1: {
        alignItems: 'center',
        marginTop: 0
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
        height: 50,
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
        backgroundColor: '#e9c46a'
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
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 10,
        fontSize: 16,
    },
    // buttonStyle: {
    //     backgroundColor: '#19398A',
    //     borderWidth: 0,
    //     color: '#FFFFFF',
    //     borderColor: '#307ecc',
    //     height: 40,
    //     alignItems: 'center',
    //     borderRadius: 30,
    //     marginLeft: 80,
    //     marginRight: 35,
    //     //   marginTop: 15,
    //     width: '50%'
    // },
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
    },
    buttonTextStyle: {
        color: '#FFFFFF',
        paddingVertical: 5,
        fontSize: 16,
    },
    buttonTextStyle1: {
        color: '#FFFFFF',
        // paddingHorizontal:20,
        paddingVertical: 5,
        fontSize: 16,
    }
});