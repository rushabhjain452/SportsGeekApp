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
    LogBox,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import SwipeList from 'react-native-smooth-swipe-list';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import showSweetAlert from '../../helpers/showSweetAlert';
import {baseurl} from '../../config';
import { Card} from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

const ListAllUsersScreen = ({navigation}) => {

    const [data, setData] = useState([]);
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(async() => {
        const token = await AsyncStorage.getItem('token');
        setToken(token);
        displayUser(token);
    }, [refreshing]);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
    }, []);

    const displayUser = (token) => {
        const headers = {
            'Authorization': 'Bearer ' + token
        }
        axios.get(baseurl+'/users', {headers})
        .then(response => {
            setLoading(false);
            setRefreshing(false);
            if(response.status == 200){
                setData(response.data);
            }
            else{
                showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
            }
        })
        .catch(error => {
            setLoading(false);
            setRefreshing(false);
            showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
        })
    }

   return (
      <ScrollView keyboardShouldPersistTaps='handled' style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {loading == true  && (<ActivityIndicator size="large" color="#19398A" />)}
          <StatusBar backgroundColor='#19398A' barStyle="light-content"/>
        <View style={styles.header}>
            <Text style={styles.text_header}>List of Users</Text>
        </View>
        <Animatable.View 
            animation="fadeInUpBig"
            style={styles.footer}
        >
            <View>
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
                
                {/* data.map((item,index) => (
                    <View style={styles.card} key={item.userId} >
                        <View style={styles.cardlist}>  
                            <View style={styles.ellipse1}>
                                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 18}}>{item.firstName.substr(0,1) + item.lastName.substr(0,1)}</Text>
                            </View>
                            <Text style={[styles.carditem, {width: '40%',paddingLeft:20}]}>{item.firstName +" "+ item.lastName}</Text>
                            <Text style={[styles.carditem, {width: '35%',paddingLeft:20}]}>{item.username}</Text>
                           <TouchableOpacity onPress={() => {updateUser(item.userId)}} style={{width:'10%'}}><Text style={[styles.carditem]}><Icon name="account-check" color="#19398A" size={30}/></Text></TouchableOpacity> 
                        </View>
                    </View>
                )) */}

                {
                data.map((item,index) => (
                    <TouchableOpacity key={item.userId} onPress={() => { navigation.navigate('UpdateUserScreen', {userId: item.userId});}}>
                    <View style={styles.mycard}>
                        <View>  
                            <Text style={{fontSize:18,fontWeight:'bold'}}>Name : {item.firstName + " " + item.lastName}</Text>
                            <Text style={{fontSize:18,fontWeight:'bold'}}>Username : {item.username}</Text>
                            <Text style={{fontSize:18,fontWeight:'bold'}}>Mobile no : {item.mobileNumber}</Text>
                            <Text style={{fontSize:18,fontWeight:'bold'}}>Email : {item.email}</Text>
                            <Text style={{fontSize:18,fontWeight:'bold'}}>Available Points : {item.availablePoints}</Text>
                        </View>
                    </View>
                    </TouchableOpacity>
                ))
                }
           
            </View>
        </Animatable.View>
      </ScrollView>
    );
};

export default ListAllUsersScreen;

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
        fontSize: 30,
        marginTop: 20
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
        paddingTop:5,
        paddingLeft: 20,
        borderBottomWidth: 1,
        borderBottomColor:'#808080',
        backgroundColor: '#FFF'
    },
    card: {
        width: '100%',
        height: 100,
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
    mycard:{
        width: '100%',
        backgroundColor: "#E6E6E6",
        borderWidth: 1,
        borderColor: "#000000",
        borderRadius: 7,
        marginTop: 5,
        // marginLeft: 8,
        // display: "flex",
        // flexDirection: 'row', 
        // justifyContent: 'space-between',
        // marginBottom:,
        padding: 10,
    }
  });