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
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import showSweetAlert from '../helpers/showSweetAlert';
import {baseurl, errorMessage} from '../config';
import axios from 'axios';

const UpdateProfileScreen = ({navigation}) => {

    const [userId, setUserId] = useState(0);
    // const [data, setData] = useState([]);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [genderId, setGenderId] = useState(0);
    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(true);
    const [mobileNumber, setMobileNumber] = useState(0);
    const [isProfilePictureSelected, setIsProfilePictureSelected] = useState(false);
    const [profilePicture, setProfilePicture] = useState('');

    const [genderData, setGenderData] = useState([]);
    const [token, setToken] = useState('');

    const [loading, setLoading] = React.useState(true);

    const email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    useEffect(async() => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        const userId = await AsyncStorage.getItem('userId');
        // console.log(userId);
        setUserId(userId);
        fetchGenderData();
        fetchUserData(userId, token);
    }, []);

    const fetchGenderData = () => {
        axios.get(baseurl+'/genders')
        .then((response) => {
            if(response.status == 200){
                setGenderData(response.data);
            }else{
                showSweetAlert('error', 'Network Error', errorMessage);
            }
        })
        .catch((error) => {
            showSweetAlert('error', 'Network Error', errorMessage);
        });
    }

    const fetchUserData = (userId, token) => {
        const headers = {'Authorization': 'Bearer ' + token};
        axios.get(baseurl+'/users/'+userId, {headers})
        .then((response) => {
            setLoading(false);
            if(response.status == 200){
                setEmail(response.data.email);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setMobileNumber(response.data.mobileNumber);
                setGenderId(response.data.genderId);
            }else{
                showSweetAlert('error', 'Network Error', errorMessage);
            }
        })
        .catch((error) => {
            setLoading(false);
            showSweetAlert('error', 'Network Error', errorMessage);
        });
    }

    const photoUploadHandler = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image);

        });
    }

    const updateProfileHandler = () => {
        if (firstName.length < 3) {
            showSweetAlert('warning', 'Invalid Input!', 'Please enter first name greater than 3 characters to proceed.');
        }
        else if(lastName.length < 3){
            showSweetAlert('warning', 'Invalid Input!', 'Please enter last name greater than 3 characters to proceed.');
        }
        else if(!validEmail){
            showSweetAlert('warning', 'Invalid Input!', 'Please enter email to proceed.');
        }
        else if(mobileNumber.length < 9){
            showSweetAlert('warning', 'Invalid Input!', 'Please enter mobile number to proceed.');
        }
        else if(genderId == 0){
            showSweetAlert('warning', 'Invalid Input!', 'Please select your gender to proceed.');
        }
        else{
            setLoading(true);
            const headers = {'Authorization': 'Bearer ' + token};
            const requestData = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                mobileNumber: mobileNumber,
                genderId: genderId
            };
            axios.put(baseurl+'/users/'+userId, requestData, {headers})
            .then((response) => {
                setLoading(false);
                console.log(response.status);
                console.log(response.data);
                if(response.status == 200){
                    showSweetAlert('success', 'Success', 'Profile Updated Successfully...!');
                }else{
                    showSweetAlert('warning', 'Updation Failed', 'Profile Updation failed...!');
                }
            })
            .catch((error) => {
                console.log(error.response.status);
                console.log(error.response.data);
                setLoading(false);
                showSweetAlert('error', 'Network Error', errorMessage);
            });
        }
    }

    return (
      <View style={styles.container}>
        <Spinner visible={loading} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
        <StatusBar backgroundColor='#19398A' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>Update Profile</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView keyboardShouldPersistTaps='handled'>

            <Text style={[styles.text_footer, {marginTop: 10}]}>First Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your FirstName"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setFirstName(val)}
                    maxLength={50}
                    value={firstName+""}
                />
                {firstName.length > 2 ? 
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
            { (firstName.length > 0 && firstName.length < 3) ? 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Firstname must be greater than 3 characters.</Text>
            </Animatable.View> 
            : null
            }
            <Text style={[styles.text_footer, {marginTop: 20}]}>Last Name</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your LastName"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setLastName(val)}
                    maxLength={50}
                    value={lastName+""}
                />
                {lastName.length > 2 ? 
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
            { (lastName.length > 0 && lastName.length < 3) ? 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Lastname must be greater than 3 characters.</Text>
            </Animatable.View> 
            : null
            }
            <Text style={[styles.text_footer, {marginTop: 20}]}>Gender</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="mars"
                    color="#05375a"
                    size={20}
                />
                {
                    genderData.map((item) => (
                        <View key={item.genderId} style={{display:'flex', flexDirection:'row'}}>
                            <TouchableOpacity
                                style={styles.radioCircle}
                                onPress={() => {setGenderId(item.genderId)}}>
                                    {genderId == item.genderId && <View style={styles.selectedRb} />}        
                            </TouchableOpacity>
                            <Text style={{paddingLeft:10}} onPress={() => {setGenderId(item.genderId)}}>{item.name}</Text>
                        </View>
                    ))
                }
            </View>

            <Text style={[styles.text_footer, {marginTop: 20}]}>Email</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="envelope-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Email Address"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => {
                        setEmail(val);
                        if(val.match(email_regex))
                            setValidEmail(true);
                        else
                            setValidEmail(false);
                    }}
                    keyboardType="email-address"
                    maxLength={50}
                    value={email+""}
                />
                {validEmail ? 
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
            { !validEmail ? 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Please enter valid email.</Text>
            </Animatable.View> 
            : null
            }
            <Text style={[styles.text_footer, {marginTop: 20}]}>Mobile Number</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="mobile"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Mobile Number"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setMobileNumber(val)}
                    keyboardType="number-pad"
                    maxLength={15}
                    value={mobileNumber+""}
                />
                {mobileNumber.length > 0 ? 
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
            { (mobileNumber.length > 0 && mobileNumber.length < 9) ? 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Please enter valid mobile number.</Text>
            </Animatable.View> 
            : null
            }

            <Text style={[styles.text_footer, {marginTop: 35}]}>Profile Picture</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="camera-retro"
                    color="#05375a"
                    size={20}
                />
                <TouchableOpacity
                    style={styles.buttonStyle}
                    activeOpacity={0.5}
                    onPress={() => {photoUploadHandler()}}>
                <Text style={styles.buttonTextStyle}>Upload Photo</Text>
                </TouchableOpacity>
                {data.check_textInputChange ? 
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
                    onPress={() => {updateProfileHandler()}}
                    style={[styles.signIn, {
                        borderColor: '#19398A',
                        borderWidth: 1,
                        marginTop: 1
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color:'#19398A'
                    }]}>Update Profile</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default UpdateProfileScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1, 
      backgroundColor: '#19398A'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
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
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
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
	radioCircle: {
		height: 20,
		width: 20,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: '#3740ff',
		alignItems: 'center',
		justifyContent: 'center',
        marginLeft:30 
	},
	selectedRb: {
		width: 15,
		height: 15,
		borderRadius: 50,
		backgroundColor: '#19398A',
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
    },
    buttonTextStyle: {
      color: '#FFFFFF',
      paddingVertical: 10,
      fontSize: 16,
    },
    spinnerTextStyle: {
        color: '#FFF'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    }
  });