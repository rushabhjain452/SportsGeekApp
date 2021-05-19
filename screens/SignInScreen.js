import React, {useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    Dimensions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
// import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';
import {baseurl} from '../config';
import showSweetAlert from '../helpers/showSweetAlert';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import { AuthContext } from '../components/context';

const SignInScreen = ({navigation}) => {

    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    const [waiting, setWaiting] = React.useState(false);

    const { colors } = useTheme();
    const { signIn } = React.useContext(AuthContext);
    const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    // const [userId, setUserId] = useState(0);
    // const [username, setUsername] = useState('');
    // const [role, setRole] = useState('');

    // const storeUserDetails = (userid, role) => {

    // }

    const loginHandle = (userName, password) => {

        if ( data.username.length == 0 || data.password.length == 0 ) {
            // Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
            //     {text: 'Okay'}
            // ]);
            showSweetAlert('error', 'Wrong Input!', 'Username or password field cannot be empty.');
            return;
        }

        // New API
        setWaiting(true);
        // Using Fetch
        // fetch(baseurl+'/users/authenticate', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json' 
        //     },
        //     body: JSON.stringify({
        //         username: data.username,
        //         password: data.password
        //     })
        // })
        // .then((response) => {
        //     setWaiting(false);
        //     // console.log(response);
        //     // console.log(response.status);
        //     if(response.status == 200){
        //         return response.json();
        //     }
        //     else if(response.status == 400){ // Invalid username or password
        //         // console.log('Response in JSON : ');
        //         // console.log(response.json());
        //         showSweetAlert('warning', 'Login Failed', "Invalid username or password!");
        //     }
        //     else if(response.status == 401){ // blocked
        //         showSweetAlert('warning', 'Login Failed', "Sorry! you have been blocked by the admin."); 
        //     }
        //     else if(response.status == 404){
        //         showSweetAlert('warning', 'Service Unavailble', "Something went wrong. Please try again after sometime...");
        //     }
        //     else{
        //         showSweetAlert('warning', 'Network Error', 'Something went wrong. Please try again after sometime...');
        //     }
        // })
        // .then((json) => {
        //     if(json){
        //         console.log('Trying to sign in...');
        //         console.log(json);
        //         signIn(json.userId, json.username, json.role, json.token);
        //     }
        // })
        // .catch((error) => {
        //     console.log('Error : ' + error);
        //     setWaiting(false);
        //     showSweetAlert('warning', 'Network Error', 'Something went wrong. Please try again after sometime...');
        // });

        // Using Axios
        const reqData = {
            username: data.username,
            password: data.password
        };
        axios.post(baseurl+'/users/authenticate', reqData)
        .then((response) => {
            setWaiting(false);
            // console.log(response.status);
            // console.log(response.data);
            if(response.status == 200){
                signIn(response.data.userId, response.data.username, response.data.role, response.data.token);
            }
        })
        .catch((error) => {
            setWaiting(false);
            // console.log('catch');
            // console.log(error.response.status);
            // console.log(error.response.data);
            const response = error.response;
            if(response.status == 400 || response.status == 401){
                showSweetAlert('warning', 'Login Failed', response.data.message);
            }else{
                showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
            }
        });
    }

    return (
      <View style={styles.container}>
          <StatusBar backgroundColor='#19398A' barStyle="light-content"/>
          <Spinner visible={waiting} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
        <View style={styles.header}>
            <Text style={styles.text_header}>Welcome!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={[styles.footer, {
                backgroundColor: colors.background
            }]}
        >
            <Text style={[styles.text_footer, {
                color: colors.text
            }]}>Username</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Username"
                    placeholderTextColor="#666666"
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => textInputChange(val)}
                    onEndEditing={(e)=>handleValidUser(e.nativeEvent.text)}
                    maxLength={50}
                />
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
            { data.isValidUser ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Username must be 4 characters long.</Text>
            </Animatable.View>
            }
            

            <Text style={[styles.text_footer, {
                color: colors.text,
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color={colors.text}
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    placeholderTextColor="#666666"
                    secureTextEntry={data.secureTextEntry ? true : false}
                    style={[styles.textInput, {
                        color: colors.text
                    }]}
                    autoCapitalize="none"
                    onChangeText={(val) => handlePasswordChange(val)}
                    maxLength={50}
                />
                 <TouchableOpacity
                    onPress={updateSecureTextEntry}
                > 
                    {data.secureTextEntry ? 
                    <Feather 
                        name="eye-off"
                        color="grey"
                        size={20}
                    />
                    :
                    <Feather 
                        name="eye"
                        color="grey"
                        size={20}
                    />
                    }
                 </TouchableOpacity> 
            </View>
            { data.isValidPassword ? null : 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password must be 8 characters long.</Text>
            </Animatable.View>
            }
            <TouchableOpacity onPress={() => navigation.navigate('ForgetPasswordScreen')}>
                <Text style={{color: '#19398A', marginTop:15}}>Forget password?</Text>
            </TouchableOpacity>
            <View style={styles.button}>
                <TouchableOpacity
                onPress={() => {loginHandle( data.username, data.password )}}
                    style={[styles.signIn, {
                        borderColor: '#19398A',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color:'#19398A'
                    }]}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => navigation.navigate('SignUpScreen')}
                    style={[styles.signIn, {
                        borderColor: '#19398A',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color: '#19398A'
                    }]}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </Animatable.View>
      </View>
    );
};

export default SignInScreen;

const {height} = Dimensions.get("screen");
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
        paddingBottom: 50
    },
    footer: {
        flex: 3,
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
    spinnerTextStyle: {
        color: '#FFF'
    }
  });