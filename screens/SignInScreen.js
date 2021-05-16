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
import SweetAlert from 'react-native-sweet-alert';

import { useTheme } from 'react-native-paper';
import baseurl from './url';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';

// const Users = [
//     {
//         id: 1, 
//         email: 'user1@email.com',
//         username: 'user1', 
//         password: 'password', 
//         userToken: 'token123'
//     },
//     {
//         id: 2, 
//         email: 'user2@email.com',
//         username: 'user2', 
//         password: 'pass1234', 
//         userToken: 'token12345'
//     },
//     {
//         id: 3, 
//         email: 'testuser@email.com',
//         username: 'testuser', 
//         password: 'testpass', 
//         userToken: 'testtoken'
//     },
// ];
import { AuthContext } from '../components/context';

// import Users from '../model/User';

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

    const showSweetAlert = (status, title, msg) => {
        SweetAlert.showAlertWithOptions({
                title: title,
                subTitle: msg,
                confirmButtonTitle: 'OK',
                confirmButtonColor: '#000',
                style: status,
                cancellable: true
            },
            () => {
                setWaiting(false);
            }
        );
    }

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

        setWaiting(true);
        console.log('Uname : ' + data.username);
        fetch(baseurl+'/user/authenticateStatus', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                username: data.username
            })
        })
        .then((response) => response.json())
        .then((json) => {
            // console.log('Data Code1 : ' + json.code);
            if(json.code == 401){ // User is blocked by the admin
                setWaiting(false);
                showSweetAlert('warning', 'Login Failed', json.message); 
            }else if(json.code == 400){
                setWaiting(false);
                showSweetAlert('warning', 'Login Failed', "Invalid username or password.");
            }
            else if (json.code == 200){
                // console.log('Role : ' + json.data.role);
                // setRole(json.data.role);
                // setUsername(json.data.username);
                // setUserId(json.data.userId);
                fetch(baseurl+'/user/authenticate', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({
                        username: data.username,
                        password: data.password
                    })
                })
                .then((response) => {
                    // console.log('Response status : ' + response.status);
                    setWaiting(false);
                    if(response.status == 200){
                        return response.json(); 
                    }
                    else if(response.status == 404){
                        showSweetAlert('warning', 'Service Unavailble', "Something went wrong. Please try again after sometime...");
                    }
                    else if(response.status == 500){
                        showSweetAlert('warning', 'Login Failed', "Invalid username or password.");
                    }
                })
                .then((json2) => {
                    setWaiting(false);
                    if(json2){
                        console.log('Token : ' + json2.token);
                        console.log('Code : ' + json2.token);
                        if(json2.code == 500){
                            showSweetAlert('warning', 'Login Failed', "Invalid username or password.");
                        }
                        else if(json2.token == undefined){
                            showSweetAlert('warning', 'Service Unavailble', "Something went wrong. Please try again after sometime...");
                        }
                        else{
                            const user = json.data;
                            // console.log('From Main : ' + user.userId + ' ' + user.username + ' ' + user.role + ' ' + json2.token);
                            // signIn(userId, username, role, json2.token);
                            signIn(user.userId, user.username, user.role, json2.token);
                        }
                    }
                })
                .catch((error) => {
                    // console.log(error);
                    setWaiting(false);
                    showSweetAlert('warning', 'Network Error', 'Something went wrong. Please try again after sometime...');
                });
            }
        })
        .catch((error) => {
            showSweetAlert('warning', 'Network Error', 'Something went wrong. Please try again after sometime...');
        })

        // fetch(baseurl+'/user/authenticate', {
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
        //     // console.log(response);
        //     console.log(response.status);
        //     if(response.status == 200){
        //         return response.json();
        //     }
        //     else if(response.status == 404){
        //         showSweetAlert('warning', 'Service Unavailble', "Something went wrong. Please try again after sometime...");
        //     }
        //     else if(response.status == 500){
        //         showSweetAlert('warning', 'Login Failed', "Invalid username or password.");
        //     }
        //     setWaiting(false);
        // })
        // .then((json) => {
        //     // if(json.code == 200){
        //     //     // if(json.data.role == 'Admin'){
        //     //     //     // showSweetAlert('success', 'Login Success', 'You are admin.');
        //     //     //     signIn(json.data.username, json.data.role);
        //     //     // }
        //     //     // else if(json.data.role == 'User'){
        //     //     //     // showSweetAlert('success', 'Login Success', 'You are User.');
        //     //     //     signIn(json.data.username, json.data.role);
        //     //     // }
        //     //     // signIn(json.data.userId, json.data.username, json.data.role);
        //     //     // console.log('UserId in SignInScreen : ' + json.data.userId);
        //     // }
        //     // else if(json.code == 401){
        //     //     showSweetAlert('warning', 'Login Failed', json.message);
        //     // }
        //     // else if(json.code == 400){
        //     //     showSweetAlert('warning', 'Login Failed', json.message);
        //     // }
        //     // console.log("After : " + json.token);
        //     if(json){
        //         // showSweetAlert('success', 'Success', 'Login success.');
        //         // console.log(data.username);
        //         signIn(data.username, json.token);
        //     }
        //     setWaiting(false);
        // })
        // .catch((error) => {
        //     // console.log(error.code);
        //     console.log(error);
        //     showSweetAlert('warning', 'Network Error', 'Something went wrong. Please try again after sometime...');
        // });

        // signIn(foundUser);
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