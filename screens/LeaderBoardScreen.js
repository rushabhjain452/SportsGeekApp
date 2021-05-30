import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, RefreshControl, ActivityIndicator } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
// import Svg, { Ellipse } from "react-native-svg";
import {
  Avatar
} from 'react-native-paper';
import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage } from '../config';
import AsyncStorage from '@react-native-community/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useTheme } from 'react-native-paper';
import axios from 'axios';

function LeaderBoard(props) {

  const [data, setData] = useState([]);
  const [contestData, setContestData] = useState([]);
  const [userId, setUserId] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState('');
  const { colors } = useTheme();

  useEffect(async () => {
    const token = await AsyncStorage.getItem('token');
    setToken(token);
    const userId = await AsyncStorage.getItem('userId');
    setUserId(userId);
    fetchData(token);
  }, [refreshing]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // console.log('Refreshing...');
    // fetchData(token);
  }, []);

  const fetchData = (token) => {
    console.log('fetchData');
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/users/statistics', { headers })
      .then((response) => {
        if (response.status == 200) {
          setData(response.data);
          fetchContestData(response.data, token);
        } else {
          setData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  }

  const fetchContestData = (data, token) => {
    console.log('fetchContestData');
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/users/future-contest', { headers })
      .then((response) => {
        setLoading(false);
        setRefreshing(false);
        if (response.status == 200) {
          setContestData(response.data);
          let contestData = response.data;
          data.forEach((item) => {
            let obj = contestData.find(o => o.userId == item.userId);
            if (obj)
              item.totalWinningPoints += obj.contestPoints;
          });
          // setData(data);
          data.sort((obj1, obj2) => {
            if (obj1.totalWinningPoints < obj2.totalWinningPoints) {
              return 1;
            }
            else if (obj1.totalWinningPoints > obj2.totalWinningPoints) {
              return -1;
            }
            return 0;
          });
          console.log(data);
          setData(data);
          console.log('setData');
        } else {
          setContestData([]);
          showSweetAlert('error', 'Network Error', errorMessage);
        }
      })
      .catch((error) => {
        setLoading(false);
        setRefreshing(false);
        showSweetAlert('error', 'Network Error', errorMessage);
      });
  }

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps='handled' refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
      <View style={styles.rectStackRow}>
        {
          data.length >= 2 &&
          (
            <View style={styles.rect}>
              <View style={styles.ellipse1}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>2</Text>
              </View>
              <Text style={styles.carditemusername}>{data[1].firstName + " " + data[1].lastName}</Text>
              <Text style={[styles.carditem, { textAlign: 'center' }]}>{data[1].totalWinningPoints}</Text>
            </View>
          )
        }
        {
          data.length >= 1 &&
          (
            <View style={styles.rect1}>
              <View style={styles.ellipse1}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>1</Text>
              </View>
              <Text style={styles.carditemusername}>{data[0].firstName + " " + data[0].lastName}</Text>
              <Text style={[styles.carditem, { textAlign: 'center' }]}>{data[0].totalWinningPoints}</Text>
            </View>
          )
        }
        {
          data.length >= 3 &&
          (
            <View style={styles.rect2}>
              <View style={styles.ellipse1}>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>3</Text>
              </View>
              <Text style={styles.carditemusername}>{data[2].firstName + " " + data[2].lastName}</Text>
              <Text style={[styles.carditem, { textAlign: 'center' }]}>{data[2].totalWinningPoints}</Text>
            </View>
          )
        }
      </View>
      <View style={{ display: 'flex', flexDirection: 'row' }}>
        <Text style={[styles.popular, { width: 100 }]}>Top Users</Text>
        <TouchableOpacity style={{ marginTop: 15 }} onPress={() => setRefreshing(true)}>
          <FontAwesome
            name="refresh"
            color={colors.text}
            size={20}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.rect3}>
        <View style={styles.rankRow}>
          <Text style={styles.rank}>Rank</Text>
          <Text style={styles.user}>User</Text>
          <Text style={styles.points}>Points</Text>
        </View>
      </View>
      {
        data && data.map((item, index) => {
          const mystyle = item.userId == userId ? styles.bgDark : styles.bgLight;
          return (
            <View style={[styles.card, mystyle]} key={item.userId}>
              <View style={styles.cardlist}>
                <Text style={[styles.carditem, { marginLeft: 5, width: 30 }]}>{index + 1}</Text>
                <View style={styles.ellipse1}>
                  <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 18 }}>{item.firstName.substr(0, 1) + item.lastName.substr(0, 1)}</Text>
                </View>
                <Text style={[styles.carditem, { width: '60%', fontSize: 17 }]}>{item.firstName + " " + item.lastName}</Text>
                <Text style={[styles.carditem, { width: '20%' }]}>{item.totalWinningPoints}</Text>
              </View>
            </View>
          )
        })
      }
      <View style={{ marginTop: 50 }}></View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: "rgba(241,241,241,1)"
  },
  ellipse: {
    top: 0,
    left: 84,
    width: 31,
    height: 34,
    position: "absolute",
    opacity: 0.8
  },
  loremIpsum: {
    top: 6,
    left: 95,
    position: "absolute",
    fontFamily: "comic-sans-ms-regular",
    color: "#121212",
    fontSize: 16
  },
  loremIpsum1: {
    top: 6,
    left: 95,
    position: "absolute",
    fontFamily: "times-new-roman-regular",
    color: "#121212",
    fontSize: 20
  },
  rectStack: {
    width: 115,
    height: 140,
    marginTop: 23
  },
  rectStackRow: {
    display: "flex",
    height: 164,
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 30,
    marginLeft: 10,
    marginRight: 7,
  },
  rect: {
    left: 0,
    width: '32%',
    height: 130,
    // position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    // backgroundColor: 'green',
    bottom: 0,
    top: 20,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1
  },
  rect1: {
    width: '32%',
    height: 150,
    // position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    // backgroundColor: 'yellow',
    left: 0,
    bottom: 0,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1
  },
  rect2: {
    left: 0,
    width: '32%',
    height: 110,
    // position: "absolute",
    backgroundColor: "rgba(255,255,255,1)",
    // backgroundColor: 'red',
    bottom: 0,
    top: 40,
    borderRadius: 10,
    borderColor: '#000',
    borderWidth: 1
  },
  ellipse1: {
    top: 0,
    left: 78,
    width: 31,
    height: 34,
    position: "absolute",
    opacity: 0.8,
    // marginLeft: 50
  },
  loremIpsum2: {
    top: 6,
    left: 90,
    position: "absolute",
    fontFamily: "times-new-roman-regular",
    color: "#121212",
    fontSize: 18
  },
  rect1Stack: {
    width: 109,
    height: 164,
    marginLeft: 9
  },
  ellipse2: {
    top: 0,
    left: 79,
    width: 31,
    height: 34,
    position: "absolute",
    opacity: 0.8
  },
  loremIpsum3: {
    top: 6,
    left: 91,
    position: "absolute",
    fontFamily: "times-new-roman-regular",
    color: "#121212",
    fontSize: 18
  },
  rect2Stack: {
    width: 110,
    height: 127,
    marginLeft: 6,
    marginTop: 37
  },
  popular: {
    // fontFamily: "times-new-roman-regular",
    color: "rgba(147,147,147,1)",
    fontSize: 18,
    marginTop: 10,
    marginLeft: 19
  },
  rect3: {
    width: '92%',
    height: 37,
    backgroundColor: "rgba(25,57,138,1)",
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 5,
    flexDirection: "row",
    marginTop: 16,
    marginLeft: 19
  },
  rank: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    width: '25%'
  },
  user: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    // marginLeft: 50,
    width: '30%'
    // marginTop: 1
  },
  points: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    marginLeft: 127,
    width: '20%'
  },
  rankRow: {
    height: 18,
    flexDirection: "row",
    flex: 1,
    marginRight: 57,
    marginLeft: 7,
    marginTop: 11
  },
  rect4: {
    width: '92%',
    height: 60,
    backgroundColor: "rgba(255,255,255,1)",
    borderWidth: 0,
    borderColor: "#000000",
    borderRadius: 8,
    marginTop: 15,
    marginLeft: 19
  }, // styles for List display
  card: {
    // width: '100%',
    height: 50,
    // backgroundColor: "#E6E6E6",
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    //  marginBottom:50
  },
  bgLight: {
    backgroundColor: "#E6E6E6",
  },
  bgDark: {
    // backgroundColor: "#98FB98",
    backgroundColor: '#87CEFA'
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
    marginLeft: 5,
    justifyContent: 'center',
    backgroundColor: '#e9c46a',

  },
  carditem: {
    color: "#121212",
    fontSize: 18,
    marginLeft: 3,
    marginTop: 5,
    fontWeight: "bold",
    display: 'flex',
    justifyContent: 'space-between',
    //    textAlign: 'center'
  },
  carditemusername: {
    color: "#121212",
    fontSize: 14,
    marginLeft: 3,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold'
    //    textAlign: 'center',
    // borderBottomColor: 'green',
    // borderBottomWidth: 2,
    // height: 40,
  },
});

export default LeaderBoard;
