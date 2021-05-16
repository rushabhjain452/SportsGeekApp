import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

function PrivateChatScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Private Chat!</Text>
    </View>
  );
}

function GroupChatScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Group Chat!</Text>
    </View>
  );
}

const ChatScreen = () => {
    return (
      <Tab.Navigator>
      <Tab.Screen name="Private Chat" component={PrivateChatScreen} />
      <Tab.Screen name="Group Chat" component={GroupChatScreen} />
    </Tab.Navigator>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});