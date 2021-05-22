import React, {useState, useEffect} from 'react';
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
import {
    Dropdown
  } from 'sharingan-rn-modal-dropdown';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import SwipeList from 'react-native-smooth-swipe-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import showSweetAlert from '../../helpers/showSweetAlert';
import {baseurl} from '../../config';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from 'axios';

const PlayerScreen = ({navigation}) => {

    // LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const [data, setData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [teamId, setTeamId] = useState(0);
    const [playerTypeData, setPlayerTypeData] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [playerTypeId, setPlayerTypeId] = useState(0);
    const [btnText, setBtnText] = useState('Add');
    const [valueSS, setValueSS] = useState('');
    const [token, setToken] = useState('');

    useEffect(async() => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        displayTeam(token);
        displayPlayerType(token);
        // setPlayerType('');
    }, []);

    const displayTeam = (token) => {
        const headers = {
            'Authorization': 'Bearer ' + token
        }
        axios.get(baseurl+'/teams', {headers})
        .then(response => {
            // setLoading(false);
            // setRefreshing(false);
            if(response.status == 200){
                setData(response.data);
                // console.log(json.data);
                let dt = response.data;
                // console.log(dt.length);
                let arr = [];
                for(let i=0; i<dt.length; i++){
                    arr.push({
                        value: dt[i].teamId,
                        label: dt[i].shortName
                    });
                }
                setTeamData(arr);
            }
            else{
                showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
            }
        })
        .catch(error => {
            // setLoading(false);
            // setRefreshing(false);
            showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
        })
    }

    const displayPlayerType = (token) => {
        const headers = {
            'Authorization': 'Bearer ' + token
        }
        axios.get(baseurl+'/player-types', {headers})
        .then(response => {
            // setLoading(false);
            // setRefreshing(false);
            if(response.status == 200){
                setData(response.data);
                // console.log(json.data);
                let dt = response.data;
                // console.log(dt.length);
                let arr = [];
                for(let i=0; i<dt.length; i++){
                    arr.push({
                        value: dt[i].playerTypeId,
                        label: dt[i].typeName
                    });
                }
                setPlayerTypeData(arr);
            }
            else{
                showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
            }
        })
        .catch(error => {
            // setLoading(false);
            // setRefreshing(false);
            showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
        })
    }

    // const addPlayerType = () => {
    //     // console.log(data.gender);
    //     // console.log(baseurl+'/gender');
    //     if(playerType != ''){
    //         fetch(baseurl+'/playertype', {
    //             method: 'POST',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json' 
    //             },
    //             body: JSON.stringify({
    //                 typeName: playerType
    //             })
    //         })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             if(json.code == 201){
    //                 showSweetAlert('success', 'Success', 'PlayerType added successfully.');
    //                 displayPlayerType();
    //             }
    //             else
    //                 showSweetAlert('error', 'Error', 'Failed to add PlayerType. Please try again...');
    //                 setPlayerType('');
    //         })
    //         .catch((error) => {
    //             showSweetAlert('error', 'Error', 'Failed to add PlayerType. Please try again...');
    //         });
    //     }else{
    //         showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for PlayerType.');
    //     }
    // }

    // const deletePlayerType = (id) => {
    //     fetch(baseurl+'/playertype/'+id, {
    //         method: 'DELETE'
    //     })
    //     .then((response) => response.json())
    //     .then((json) => {
    //         if(json.code == 200){
    //             showSweetAlert('success', 'Success', 'PlayerType deleted successfully.');
    //             displayPlayerType();
    //         }
    //         else
    //             showSweetAlert('error', 'Error', 'Failed to delete PlayerType. Please try again...');
    //             setPlayerType('');
    //     })
    //     .catch((error) => {
    //         showSweetAlert('error', 'Error', 'Failed to delete PlayerType. Please try again...');
    //     });
    // }

    // const editPlayerType = (playerTypeId, typeName) => {
    //    setPlayerType(typeName);
    //     setBtnText('Update');
    //     setPlayerTypeId(playerTypeId);
    // } 

    // const updatePlayerType = () => {
    //     if(playerType != ''){
    //         fetch(baseurl+'/playertype/'+playerTypeId, {
    //             method: 'PUT',
    //             headers: {
    //                 Accept: 'application/json',
    //                 'Content-Type': 'application/json' 
    //             },
    //             body: JSON.stringify({
    //                 typeName: playerType
    //             })
    //         })
    //         .then((response) => response.json())
    //         .then((json) => {
    //             if(json.code == 201){
    //                 showSweetAlert('success', 'Success', 'PlayerType updated successfully.');
    //                 displayPlayerType();
    //             }
    //             else
    //                 showSweetAlert('error', 'Error', 'Failed to update PlayerType. Please try again...');
    //             setPlayerType('');
    //             setBtnText('Add');
    //             // setGenderId(0);
    //         })
    //         .catch((error) => {
    //             showSweetAlert('error', 'Error', 'Failed to update PlayerType. Please try again...');
    //         });
    //     }else{
    //         showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for PlayerType.');
    //     }
    // }
    const onChangeSS = (value) => {
        setTeamId(value);
    };
    const onPlayerSS = (value) => {
        setTeamId(value);
    };
   return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#19398A' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Player Details</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView keyboardShouldPersistTaps='handled'>
            <Text style={[styles.text_footer, {marginTop: 35}]}>Team Name</Text>
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
            <Text style={[styles.text_footer, {marginTop: 35}]}>Player Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Enter Player Name"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setPlayerName(val)}
                    value={playerName}
                    maxLength={20}
                />
                { (playerName != '') ? 
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
            <Text style={[styles.text_footer, {marginTop: 35}]}>Player Type</Text>
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
             <Text style={[styles.text_footer, {marginTop: 35}]}>Profile Picture</Text>
             <View style={styles.action}>
                <FontAwesome 
                    name="camera-retro"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Uploaded File Name"
                    style={styles.textInput}
                    autoCapitalize="none"
                    // onChangeText={(val) => (val)}
                    // value={teamLogo}
                    maxLength={20}
                />
                 <TouchableOpacity >
                 <Animatable.View
                    animation="bounceIn"
                >
                    <Feather 
                        name="camera"
                        color="#19398A"
                        size={35}
                    />
                </Animatable.View>
                </TouchableOpacity>
            </View>
            <View style={styles.button}>
            <TouchableOpacity
                // onPress={(btnText=='Add') ? addPlayerType : updatePlayerType}
                    style={[styles.signIn, {
                        borderColor: '#19398A',
                        borderWidth: 1,
                        marginTop: 10,
                        marginBottom: 20
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color:'#19398A'
                    }]}>{btnText}</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.button1}>
            <TouchableOpacity
                // onPress={(btnText=='Add') ? addPlayerType : updatePlayerType}
                    style={[styles.signIn, {
                        borderColor: '#19398A',
                        borderWidth: 1,
                        // marginTop: 10,
                        // marginBottom: 20
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color:'#19398A'
                    }]}>Search</Text>
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
                {/* {
                data.map((item,index) => (
                    <View style={styles.card} key={item.playerTypeId} >
                        <View style={styles.cardlist}>  
                            <View style={styles.ellipse1}>
                                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>{(item.typeName).substr(0,2)}</Text>
                            </View>
                            <Text style={[styles.carditem, {width: '65%',paddingLeft:20}]}>{item.typeName}</Text>
                           <TouchableOpacity onPress={() => {editPlayerType(item.playerTypeId, item.typeName)}} style={{width:'10%'}}><Text style={[styles.carditem]}><Icon name="circle-edit-outline" color="#19398A" size={30}/></Text></TouchableOpacity> 
                           <TouchableOpacity onPress={() => {deletePlayerType(item.playerTypeId)}} style={{width:'10%'}}><Text style={[styles.carditem]}><Icon name="delete-circle-outline" color="#19398A" size={30}/></Text></TouchableOpacity> 
                        </View>
                        </View>
                ))
            } */}
           
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
        paddingTop:5,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor:'#808080',
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
         marginBottom:3
    },
    text_header1: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
        marginTop:50
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
    buttonStyle: {
      backgroundColor: '#19398A',
      borderWidth: 0,
      color: '#FFFFFF',
      borderColor: '#307ecc',
      height: 40,
      alignItems: 'center',
      borderRadius: 30,
      marginLeft: 80,
      marginRight: 35,
    //   marginTop: 15,
      width: '50%'
    }
  });