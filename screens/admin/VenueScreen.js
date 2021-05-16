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
    LogBox
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import SweetAlert from 'react-native-sweet-alert';
import SwipeList from 'react-native-smooth-swipe-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import baseurl from '../url';
import AsyncStorage from '@react-native-community/async-storage';


const VenueScreen = ({navigation}) => {

    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    const [data, setData] = useState([]);
    const [venue, setVenue] = useState('');
    const [btnText, setBtnText] = useState('Add');
    const [venueId, setVenueId] = useState(0);
    const [token, setToken] = useState('');

    useEffect(async() => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        displayVenue(token);
        setVenue('');
    }, []);

    const displayVenue = (token) => {
        fetch(baseurl+'/venue', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }) 
        .then((response) => response.json())
        .then((json) => {
            if(json.code == 200)
                setData(json.data);
            else
                showSweetAlert('error', 'Error', 'Error in fetching data. Please try again...');
        })
        .catch((error) => {
            showSweetAlert('error', 'Error', 'Error in fetching data. Please try again...');
        });
    }

    const showSweetAlert = (status, title, msg) => {
        SweetAlert.showAlertWithOptions({
            title: title,
            subTitle: msg,
            confirmButtonTitle: 'OK',
            confirmButtonColor: '#000',
            style: status,
            cancellable: true
        });
    }

    const addVenue = () => {
        // console.log(data.gender);
        // console.log(baseurl+'/gender');
        if(venue != ''){
            fetch(baseurl+'/venue', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json' ,
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    name: venue
                })
            })
            .then((response) => response.json())
            .then((json) => {
                if(json.code == 201){
                    showSweetAlert('success', 'Success', 'Venue added successfully.');
                    displayVenue(token);
                }
                else
                    showSweetAlert('error', 'Error', 'Failed to add Venue. Please try again...');
                    setVenue('');
            })
            .catch((error) => {
                showSweetAlert('error', 'Error', 'Failed to add Venue. Please try again...');
            });
        }else{
            showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Venue.');
        }
    }

    const deleteVenue = (id) => {
        fetch(baseurl+'/venue/'+id, {
            method: 'DELETE', 
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then((response) => response.json())
        .then((json) => {
            if(json.code == 200){
                showSweetAlert('success', 'Success', 'Venue deleted successfully.');
                displayVenue(token);
            }
            else
                showSweetAlert('error', 'Error', 'Failed to delete Venue. Please try again...');
                setVenue('');
        })
        .catch((error) => {
            showSweetAlert('error', 'Error', 'Failed to delete Venue. Please try again...');
        });
    }

    const editVenue = (venueId, name) => {
        setVenue(name);
        setBtnText('Update');
        setVenueId(venueId);
    } 

    const updateVenue = () => {
        if(venue != ''){
            fetch(baseurl+'/venue/'+venueId, {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json' ,
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify({
                    name: venue
                })
            })
            .then((response) => response.json())
            .then((json) => {
                if(json.code == 201){
                    showSweetAlert('success', 'Success', 'Venue updated successfully.');
                    displayVenue(token);
                }
                else
                    showSweetAlert('error', 'Error', 'Failed to update Venue. Please try again...');
                    setVenue('');
                    setBtnText('Add');
            })
            .catch((error) => {
                showSweetAlert('error', 'Error', 'Failed to update Venue. Please try again...');
            });
        }else{
            showSweetAlert('warning', 'Invalid Input', 'Please enter valid value for Venue.');
        }
    }

   return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#19398A' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Venue Details</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView keyboardShouldPersistTaps='handled'>
            <Text style={[styles.text_footer, {marginTop: 35}]}>Venue Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="mars"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Enter Venue Name"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setVenue(val)}
                    value={venue}
                    maxLength={20}
                />
                { (venue != '') ? 
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
                onPress={(btnText=='Add') ? addVenue : updateVenue}
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
                data.map((item,index) => (
                    <View style={styles.card} key={item.venueId} >
                        <View style={styles.cardlist}>  
                            <View style={styles.ellipse1}>
                                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>{(item.name).substr(0,1)}</Text>
                            </View>
                            <Text style={[styles.carditem, {width: '65%',paddingLeft:20}]}>{item.name}</Text>
                           <TouchableOpacity onPress={() => {editVenue(item.venueId, item.name)}} style={{width:'10%'}}><Text style={[styles.carditem]}><Icon name="circle-edit-outline" color="#19398A" size={30}/></Text></TouchableOpacity> 
                           <TouchableOpacity onPress={() => {deleteVenue(item.venueId)}}style={{width:'10%'}}><Text style={[styles.carditem]}><Icon name="delete-circle-outline" color="#19398A" size={30}/></Text></TouchableOpacity> 
                        </View>
                        </View>
                ))
            }
           
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default VenueScreen;

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
    }
  });