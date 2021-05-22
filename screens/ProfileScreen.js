import React, {useState, useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, ScrollView, RefreshControl, ActivityIndicator} from 'react-native';
import {
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import { Avatar } from "react-native-elements";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Share from 'react-native-share';
import ChangePasswordScreen from './ChangePasswordScreen';
import { AuthContext } from '../components/context';
import AsyncStorage from '@react-native-community/async-storage';
import showSweetAlert from '../helpers/showSweetAlert';
import {baseurl} from '../config';
import axios from 'axios';

const ProfileScreen = ({navigation}) => {

  const [data, setData] = useState({});
  const [winningPoints, setWinningPoints] = useState(0);
  const [loosingPoints, setLoosingPoints] = useState(0);
  const [userId, setUserId] = useState(0);
  const [shortName, setShortName] = useState('');
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');

  useEffect(async() => {
    const token = await AsyncStorage.getItem('token');
    setToken(token);
    // if(userId == 0){
    //   const userId = await AsyncStorage.getItem('userId');
    // }
    const userId = await AsyncStorage.getItem('userId');
    // console.log("Profile screen : " + userId);
    // console.log(typeof(userId));
    setUserId(userId);
    displayProfile(userId, token);
    displayWinningPoints(userId, token);
    displayLoosingPoints(userId, token);
  }, [refreshing]);

  useEffect(() => {
    displayProfile(userId, token);
    // displayWinningPoints(userId);
    // displayLoosingPoints(userId);
    if(data.firstName){
      setShortName(data.firstName.substr(0,1) + data.lastName.substr(0,1));
    }
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // displayProfile(userId);
    // displayWinningPoints(userId);
    // displayLoosingPoints(userId);
  }, []);

  const displayProfile = (userId, token) => {
    if(userId == 0){
      return;
    }
    const headers = {'Authorization': 'Bearer ' + token};
    axios.get(baseurl+'/users/'+userId, {headers})
    .then((response) => {
      if(response.status == 200){
          setData(response.data);
      }else{
        showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
      }
    })
    .catch((error) => {
      showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
    });
  }

  const displayWinningPoints = (userId, token) => {
    const headers = {'Authorization': 'Bearer ' + token};
    axios.get(baseurl+'/users/'+userId+'/winning-points', {headers})
    .then((response) => {
      if(response.status == 200){
        setWinningPoints(response.data.winningPoints);
      }else{
        showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
      }
    })
    .catch((error) => {
      showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
    });
  }

  const displayLoosingPoints = (userId, token) => {
    const headers = {'Authorization': 'Bearer ' + token};
    axios.get(baseurl+'/users/'+userId+'/loosing-points', {headers})
    .then((response) => {
      setLoading(false);
      setRefreshing(false);
      if(response.status == 200){
        setLoosingPoints(response.data.loosingPoints);
      }else{
        showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
      }
    })
    .catch((error) => {
      setLoading(false);
      setRefreshing(false);
      showSweetAlert('error', 'Network Error', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
    });
  }
  const { signOut } = React.useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>
      {loading == true  && (<ActivityIndicator size="large" color="#19398A" />)}
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          {/* <Avatar.Image 
            source={{
              uri: data.profilePicture
            }}
            size={80}
          /> */}
                <Avatar
                  size="medium"
                  rounded
                  title= {shortName}
                  activeOpacity={0.7}
                  containerStyle={{color: 'red',backgroundColor: '#adadad', marginTop: 10}}
               />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:5,
              marginBottom: 5,
            }]}>{data.firstName} {data.lastName}</Title>
            <Caption style={styles.caption}>{data.username}</Caption>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="phone" color="#19398A" size={25}/>
          <Text style={{color:"#000000", marginLeft: 20, fontSize:16}}>{data.mobileNumber}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#19398A" size={25}/>
          <Text style={{color:"#000000", marginLeft: 20, fontSize:16}}>{data.email}</Text>
        </View>
      </View>

      <View style={styles.infoBoxWrapper}>
      <View style={styles.infoBox}>
            <Title style = {{color: '#00F', fontWeight: 'bold'}}>{data.availablePoints}</Title>
            <Caption style = {{color: '#00F'}}>Available Points</Caption>
          </View>
          <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1,
            borderRightColor: '#dddddd',
            borderRightWidth: 1,
            
          }]}>
            <Title style = {{color: '#30923D', fontWeight: 'bold'}}>{winningPoints}</Title>
            <Caption style = {{color: '#30923D'}}>Total Winnings</Caption>
          </View>
          <View style={styles.infoBox}>
            <Title style = {{color: '#F00', fontWeight: 'bold'}}>{loosingPoints}</Title>
            <Caption style = {{color: '#F00'}}>Total Losing</Caption>
          </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => {navigation.navigate('UpdateProfileScreen')}}>
          <View style={styles.menuItem}>
            <Icon name="account-edit" color="#19398A" size={25}/>
            <Text style={styles.menuItemText}>Update Your Profile</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => navigation.navigate('changePasswordScreen')}>
          <View style={styles.menuItem}>
            <Icon name="form-textbox-password" color="#19398A" size={25}/>
            <Text style={styles.menuItemText}>Change Password</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {signOut()}}>
          <View style={styles.menuItem}>
            <Icon name="logout-variant" color="#19398A" size={25}/>
            <Text style={styles.menuItemText}>Signout</Text>
          </View>
        </TouchableRipple>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

function updatePassword() {
return (
    <ChangePasswordScreen/>
);
} 
export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 100,
  },
  infoBox: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftColor: '#dddddd',
    borderLeftWidth: 1,
    color: '#00F'
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#000000',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});