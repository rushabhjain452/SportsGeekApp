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
    StatusBar,
    RefreshControl,
    Image,
    Alert
} from 'react-native';
import {
    Dropdown
  } from 'sharingan-rn-modal-dropdown';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import SwipeList from 'react-native-smooth-swipe-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';

import showSweetAlert from '../../helpers/showSweetAlert';
import {baseurl} from '../../config';

const RechargeScreen = ({navigation}) => {

    // LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const [data, setData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [userId, setUserId] = useState(0);
    const [points, setPoints] = useState(0);
    const [recData, setRecData] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [loading, setLoading] = useState(true);

    const [token, setToken] = useState('');

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        // displayRecharge(token);
    }, []);

    useEffect(async() => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        displayUser(token);
        displayRecharge(token);
    }, [refreshing]);

    const displayUser = (token) => {
        fetch(baseurl+'/user',{
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => response.json())
        .then((json) => {
            if(json.code == 200)
            {
                setData(json.data);
                // console.log(json.data);
                let dt = json.data;
                // console.log(dt.length);
                let arr = [];
                for(let i=0; i<dt.length; i++){
                    arr.push({
                        value: dt[i].userId,
                        label: dt[i].username
                    });
                }
                setUserData(arr);
                // console.log(userData);
            }
            else
                showSweetAlert('error', 'Error', 'Error in fetching User data. Please try again...');
        })
        .catch((error) => {
            showSweetAlert('error', 'Error', 'Error in fetching data. Please try again...');
            console.log(error);
        });
    }

    const displayRecharge = (token) => {
        fetch(baseurl+'/recharge', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => response.json())
        .then((json) => {
            if(json.code == 200)
            {
                setRecData(json.data);
            }
            else
                showSweetAlert('error', 'Error', 'Error in fetching User data. Please try again...');
            setLoading(false);
            setRefreshing(false);
        })
        .catch((error) => {
            showSweetAlert('error', 'Error', 'Error in fetching data. Please try again...');
            setLoading(false);
            setRefreshing(false);
        });
    }

    const onChangeSS = (value) => {
        setUserId(value);
    };

    const rechargeHandler = () => {
        if(userId == 0){
            showSweetAlert('warning', 'User not selected', 'Please select User to proceed recharge.');
        }
        else if(points < 1){
            showSweetAlert('warning', 'Invalid Points', 'Please enter valid points to procced recharge.');
        }
        else{
            setLoading(true);
            fetch(baseurl+'/recharge', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    userId: userId,
                    points: points
                })
            })
            .then((response) => response.json())
            .then((json) => {
                setLoading(false);
                if(json.code == 201){
                    showSweetAlert('success', 'Success', 'Recharge done successfully.');
                }
                else{
                    showSweetAlert('warning', 'Network Error', 'Something went wrong. Please check your internet connection or try again after sometime...');
                }
                setUserId(0);
                setPoints(0);
                displayRecharge(token);
            })
            .catch((error) => {
                setLoading(false);
                showSweetAlert('error', 'Error', 'Error in processing recharge.Please try again after sometime.');
            });
        }
    }

    const formatDate = (str) => {
        // let dt = new Date(dateStr);
        // let str = dt.toString();
        // // Wed May 26 2021 19:30:00 GMT+0530 (IST)
        // let day = str.substring(8,10);
        // let mth = str.substring(4,7);
        // let yr = str.substring(11,15);

        let day = str.substring(8,10);
        let mth = str.substring(5,7);
        let yr = str.substring(0,4);
        // let hr = str.substring(11,13);
        // let min = str.substring(14,16);
          
        return day + '-' + mth + '-' + yr;
    }

    const getConfirmation = (tournamentId) =>
        Alert.alert(
        "Recharge Confirmation",
        "Do you really want to recharge for " + points + " points ?",
        [
            {
                text: "Cancel"
            },
            { 
                text: "OK", 
                onPress: rechargeHandler
            }
        ]
    );

    return (
      <ScrollView keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
      {/* <Image
        source={{
          uri: 'https://myheadphonewebsite.000webhostapp.com/images/loading/loading1.gif',
        }}
      /> */}
      <View style={styles.container}>
          <StatusBar backgroundColor='#19398A' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Recharge Details</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            
            <Text style={[styles.text_footer, {marginTop: 35}]}>User Name</Text>
            <View style={styles.action}>
                {/* <FontAwesome 
                    name="mars"
                    color="#05375a"
                    size={20}
                /> */}
                <Dropdown
                    label="User Name"
                    data={userData}
                    enableSearch
                    value={userId}
                    onChange={onChangeSS}
                />
            </View>
            <Text style={[styles.text_footer, {marginTop: 35}]}>Points</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="money"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Enter Points"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setPoints(val)}
                    value={points+''}
                    maxLength={20}
                    keyboardType="number-pad"
                />
                { (points != 0) ? 
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
           
            <View style={styles.button}>
            <TouchableOpacity
                    onPress={getConfirmation}
                    style={[styles.signIn, {
                        borderColor: '#19398A',
                        borderWidth: 1,
                        marginTop: 10,
                        marginBottom: 20
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color:'#19398A'
                    }]}>Proceed to Recharge</Text>
                </TouchableOpacity>
            </View>
                {
                recData.map((item,index) => (
                    <View style={styles.card} key={item.rechargeId} >
                        <View style={styles.cardlist}>  
                            <View style={styles.ellipse1}>
                                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>{(item.userName).substr(0,2)}</Text>
                            </View>
                            <Text style={[styles.carditem, {width: '30%',paddingLeft:2}]}>{formatDate(item.rechargeDate)}</Text>
                            <Text style={[styles.carditem, {width: '40%',paddingLeft:2}]}>{item.userName}</Text>
                            <Text style={[styles.carditem, {width: '15%',paddingLeft:2}]}>{item.points}</Text>
                        </View>
                    </View>
                ))
            }
           
            
        </Animatable.View>
      </View>
      </ScrollView>
    );
};

export default RechargeScreen;

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
        paddingBottom: 20,
        paddingTop: 30
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
      fontSize: 16,
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