import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import showSweetAlert from '../helpers/showSweetAlert';
import { baseurl, errorMessage, chatRefreshDelay } from '../config';

const PublicChatScreen = () => {

  const [messages, setMessages] = useState([]);

  const [userId, setUserId] = useState(0);

  const [token, setToken] = useState('');

  const [loading, setLoading] = useState(true);

  const intervalRef = useRef();

  useEffect(async () => {
    const token = await AsyncStorage.getItem('token');
    setToken(token);
    // Get UserId
    let userId = await AsyncStorage.getItem('userId');
    userId = parseInt(userId);
    setUserId(userId);
    fetchMessages(token);
    // Refresh message at some interval
    intervalRef.current = setInterval(() => {
      if (token) {
        fetchMessages(token);
      }
    }, chatRefreshDelay);
    // Unmount
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  const fetchMessages = (token) => {
    const headers = { 'Authorization': 'Bearer ' + token };
    axios.get(baseurl + '/public-chat/formatted', { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 200) {
          const data = response.data;
          data.push({
            _id: 0,
            text: 'Welcome to SportsGeek Public Chat',
            // createdAt: new Date().getTime(),
            system: true
          });
          setMessages(data);
        } else {
          showSweetAlert('warning', 'Unable to fetch data!', 'Unable to fetch old Chats.');
        }
      })
      .catch((error) => {
        setLoading(false);
        // console.log(error);
        showSweetAlert('error', 'Network Error', errorMessage);
      })
  }

  // helper method that sends a message
  function handleSend(newMessage = []) {
    // console.log('newMessage : ');
    // console.log(newMessage);
    // API call to insert chat in DB
    const headers = { 'Authorization': 'Bearer ' + token }
    const reqData = {
      userId: userId,
      message: newMessage.text
    };
    axios
      .post(baseurl + '/public-chat', reqData, { headers })
      .then((response) => {
        setLoading(false);
        if (response.status == 201) {
          // showSweetAlert('success', 'Success', 'Message sent successfully.');
        }
        else {
          showSweetAlert('error', 'Error', 'Error in sending your message. Please try again...');
        }
      })
      .catch((error) => {
        showSweetAlert('error', 'Error', 'Error in sending your message. Please try again...');
      })
    // To display chat is UI
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
  }

  if (userId != 0) {
    return (
      <>
        {loading == true && (<ActivityIndicator size="large" color="#19398A" />)}
        <GiftedChat
          messages={messages}
          onSend={newMessage => handleSend(newMessage[0])}
          user={{ _id: userId }}
          renderUsernameOnMessage={true}
          showAvatarForEveryMessage={true}
          maxInputLength={1000}
        // scrollToBottom={true}
        />
      </>
    );
  } else {
    // return (<Text>Loading...</Text>);
    return null;
  }
}

export default PublicChatScreen;