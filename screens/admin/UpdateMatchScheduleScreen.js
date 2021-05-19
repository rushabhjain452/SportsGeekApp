import React, { Component,useState, useEffect} from "react";
import { StyleSheet, View, Text, ScrollView, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { TouchableOpacity } from "react-native-gesture-handler";
// import { useNavigation } from '@react-navigation/native';
import showSweetAlert from '../../helpers/showSweetAlert';
import {baseurl} from '../../config';
import AsyncStorage from '@react-native-community/async-storage';

function UpdateMatchScheduleScreen({navigation}) {

  // const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
  }, []);

  useEffect(async() => {
    const token = await AsyncStorage.getItem('token');
    setToken(token);
    fetchData(token);
  }, [refreshing]);

  // useEffect(() => {
  //   const interval = setInterval(, 10000);
  // });

  // const refreshData = () => {
    
  // }

  const fetchData = (token) => {
      fetch(baseurl+'/matches/oldMatches', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      })
      .then((response) => response.json())
      .then((json) => {
        console.log('Code : ' + json.code);
        console.log(json);
        setLoading(false);
        setRefreshing(false);
        if(json.code == 200){
          setData(json.data);
        }else{
          showSweetAlert('error', 'Network Error!', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error!', 'Oops! Something went wrong and we can’t help you right now. Please try again later.');
      });
  }

  const formatDate = (str) => {

    // let dt = new Date(dateStr);
    // let str = dt.toString();
    // // Wed May 26 2021 19:30:00 GMT+0530 (IST)
    // let day = str.substring(8,10);
    // let mth = str.substring(4,7);
    // let yr = str.substring(11,15);
    // let hr = str.substring(16,18);
    // let min = str.substring(19,21);

    let day = str.substring(8,10);
    let mth = str.substring(5,7);
    let yr = str.substring(0,4);
    let hr = str.substring(11,13);
    let min = str.substring(14,16);
    let ampm;
    if(hr < 12){
      ampm = 'AM';
    }
    else{
      ampm = 'PM';
      hr -= 12;
    }
      
    return day + '-' + mth + '-' + yr + '  ' + hr + ':' + min + ' ' + ampm;
  }

  const handleCardClick = (matchId) => {
    // showSweetAlert('success', 'Match result update', 'Match Id : ' + matchId);
    navigation.navigate('UpdateMatchResultScreen', {matchId: matchId});
  }

  return (
    <ScrollView keyboardShouldPersistTaps='handled' style={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}> 
    <Text style={styles.text_header}>Old Matches</Text>
    {loading == true  && (<ActivityIndicator size="large" color="#19398A" />)}
      {data.length == [] && (<Text style={{fontSize:20, fontWeight:'bold', margin: 20}}>Sorry, there are no matches pending for setting Winner...</Text>)}
      {
        data.length > 0 && data.map((item, index) => (
          <TouchableOpacity style={styles.rect} key={item.matchId} onPress={() => {handleCardClick(item.matchId)}}>
            <Text style={styles.date}>{formatDate(item.startDatetime)}</Text>
            <View style={{display: "flex", flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={styles.ellipseRow}>  
                <Card.Image style={styles.ellipse} source={{uri: item.team1Logo}} />
                <Text style={styles.mI}>{item.team1Short}</Text>
              </View>
              <View style={styles.loremIpsumColumn}>
                <Text style={styles.vs}>VS</Text>
              </View>
              <View style={styles.rightteam}>
                <Text style={styles.eng}>{item.team2Short}</Text>
                <Card.Image style={styles.ellipse1} source={{uri: item.team2Logo}} />
              </View>
            </View>
            <View style={{height:40}}>
                <Text style={{textAlign: 'center',fontSize:16}}>{item.venue}</Text>
              </View>
          </TouchableOpacity>
        ))
      }
      <View style={{height: 20}}></View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    backgroundColor: "rgba(255,255,255,1)"
  },
  rect: {
    width: '95%',
    height: 130,
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 11,
  },
  ellipse: {
    width: 61,
    height: 61,
    marginTop: 0,
    borderRadius: 30,
    marginLeft: 7
  },
  mI: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginLeft: 11,
    marginTop: 20,
     fontWeight: "bold"
  },
  date: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    textAlign: "center",
    paddingTop: 7
  },
  vs: {
    fontFamily: "roboto-regular",
    color: "#121212",
    // marginTop: 22,
    // marginLeft: 33,
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  time: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    marginTop: 18,
    marginLeft: 13
  },
  loremIpsumColumn: {
    // width: 95,
    // marginLeft: 15,
    display: 'flex',
    // flexDirection: 'row',
    // alignItems: 'center',
    // height: 150,
    marginTop: 10,
    // textAlign: "center",
    // alignSelf: "center"
    // flex: 2
  },
  eng: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 20,
    marginLeft:20,
    marginTop: 20,
     fontWeight: "bold"
  },
  ellipse1: {
    width: 61,
    height: 61,
    marginLeft: 18,
    marginTop: 0,
    borderRadius:30
  },
  ellipseRow: {
    // height: 95,
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    marginLeft: 10,
    // alignSelf: "flex-start"
    // flex: 4
  },
  rect1: {
    width: 407,
    height: 142,
    backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    marginTop: 12,
    marginLeft: 10
  },
  ellipse2: {
    width: 61,
    height: 61,
    marginTop: 15,
    borderRadius: 30
  },
  mI3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    marginLeft: 11,
    marginTop: 37,
     fontWeight: "bold"
  },
  loremIpsum3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16
  },
  vs1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 22,
    marginLeft: 33
  },
  loremIpsum4: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    marginTop: 18,
    marginLeft: 19
  },
  loremIpsum3Column: {
    width: 95,
    marginLeft: 23
  },
  eng1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    marginLeft: 20,
    marginTop: 37,
  fontWeight: "bold"
  },
  ellipse3: {
    width: 61,
    height: 61,
    marginLeft: 18,
    marginTop: 17,
    borderRadius: 30
  },
  ellipse2Row: {
    height: 95,
    flexDirection: "row",
    marginTop: 26,
    marginLeft: 10,
    marginRight: 10
  },
  iplSchedule2021: {
    fontFamily: "roboto-regular",
    color: "rgba(00,00,00,1)",
    fontSize: 24,
    textAlign: "center",
    marginTop: -336,
  },
  rightteam: {
    // flex: 4
    display: 'flex',
    flexDirection: "row",
    marginTop: 10,
    marginRight: 10,
  },
  container2: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  text_header: {
      color: '#000',
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: "center",
  },
});

export default UpdateMatchScheduleScreen;
