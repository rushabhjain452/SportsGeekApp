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
import SweetAlert from 'react-native-sweet-alert';
import baseurl from './url';
import Spinner from 'react-native-loading-spinner-overlay';

const ForgetPasswordScreen2 = (props) => {

    const {userId} = props.route.params;
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
    const [valid, setValid] = useState(true);
    const [waiting, setWaiting] = React.useState(false);
    const [success, setSuccess] = useState(false);

    const password_regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@%!])[0-9a-zA-Z@%!]{8,}$/;

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

    const updatePasswordHandler = () => {
        if (otp.length != 6) {
            showSweetAlert('warning', 'Invalid Input!', 'Please enter valid OTP of 6 digits to proceed.');
        }
        else if(!validPassword){
            showSweetAlert('warning', 'Invalid Input!', 'Please enter valid password to proceed.');
        }
        else if(confirmPassword.length == 0){
            showSweetAlert('warning', 'Invalid Input!', 'Please enter confirm password to proceed.');
        }
        else if(password != confirmPassword){
            showSweetAlert('warning', 'Invalid Input!', 'Password and confirm password didn\'t match.');
        }
        else{
            setWaiting(true);
            fetch(baseurl+'/user/updateForgetPassword', {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    userId: userId,
                    otp: otp,
                    password: password
                })
            })
            .then((response) => response.json())
            .then((json) => {
                setWaiting(false);
                if(json.code == 200){
                    showSweetAlert('success', 'Success', 'Password changed successfully. Now, you can login with new password.');
                    // navigation.goBack();
                }else if(json.code == 404){
                    showSweetAlert('warning', 'Invalid OTP.', 'Please enter correct OTP to proceed');
                }else{
                    showSweetAlert('warning', 'Network Error', 'Something went wrong. Please check your internet connection or try again after sometime...');
                }
            })
            .catch((error) => {
                setWaiting(false);
                showSweetAlert('warning', 'Network Error', 'Something went wrong. Please try again after sometime...');
            });
        }
    }

   return (
      <View style={styles.container}>
        <StatusBar backgroundColor='#19398A' barStyle="light-content"/>
        <Spinner visible={waiting} textContent='Loading...' textStyle={styles.spinnerTextStyle} />
        <View style={styles.header}>
            <Text style={styles.text_header}>Register Now!</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <ScrollView keyboardShouldPersistTaps='handled'>
            <Text style={styles.text_footer}>OTP</Text>
            <View style={styles.action}>
                <FontAwesome 
                    name="user-o"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Enter OTP here"
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => {setOtp(val)}}
                    keyboardType="number-pad"
                    maxLength={6}
                />
                {otp.length == 6 ?
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
            { (otp.length > 0 && otp.length < 6) ? 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Please enter valid OTP of 6 digits</Text>
            </Animatable.View> 
            : null
            }
            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Your Password"
                    secureTextEntry={secureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => {
                        setPassword(val);
                        if(val.match(password_regex))
                            setValidPassword(true);
                        else
                            setValidPassword(false);
                    }}
                    maxLength={50}
                />
                 <TouchableOpacity
                    onPress={() => setSecureTextEntry(!secureTextEntry)}
                > 
                    {secureTextEntry ? 
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
            { (password.length > 0 && !validPassword) ? 
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Must contain at least 1 number, 1 special character and 1 uppercase 1 lowercase letter, and at least 8 or more characters.</Text>
            </Animatable.View>
            : null
            }

            <Text style={[styles.text_footer, {
                marginTop: 35
            }]}>Confirm Password</Text>
            <View style={styles.action}>
                <Feather 
                    name="lock"
                    color="#05375a"
                    size={20}
                />
                <TextInput 
                    placeholder="Confirm Your Password"
                    secureTextEntry={confirmSecureTextEntry ? true : false}
                    style={styles.textInput}
                    autoCapitalize="none"
                    onChangeText={(val) => setConfirmPassword(val)}
                    maxLength={50}
                />
                 <TouchableOpacity
                    onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
                >
                    {confirmSecureTextEntry ? 
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
            { (confirmPassword.length > 0 && password != confirmPassword) ?
            <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>Password and confirm password must match.</Text>
            </Animatable.View>
            : null
            }

            <View style={styles.button}>
            <TouchableOpacity
                onPress={() => {signupHandler( )}}
                    style={[styles.signIn, {
                        borderColor: '#19398A',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                >
                    <Text style={[styles.textSign, {
                        color:'#19398A'
                    }]}>Update Password</Text>
                </TouchableOpacity>

            </View>
            <View style={{marginTop: 100}}></View>
            </ScrollView>
        </Animatable.View>
      </View>
    );
};

export default ForgetPasswordScreen2;

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
        display: 'flex',
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    spinnerTextStyle: {
        color: '#FFF'
    }
  });