import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import PrivateChatScreen from './PrivateChatScreen';
import PublicChatScreen from './PublicChatScreen';

const Tab = createMaterialTopTabNavigator();

// function PrivateChatScreen() {
//   // return (
//   //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//   //     <Text>Private Chat!</Text>
//   //   </View>
//   // );
//   const [threads, setThreads] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (loading) {
//       setLoading(false);
//     }
//       });
//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={threads}
//         keyExtractor={item => item._id}
//         ItemSeparatorComponent={() => <Divider />}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             onPress={() => navigation.navigate('RoomScreen', { thread: item })}
//           >
//             <List.Item
//               title={item.name}
//               description='Item description'
//               titleNumberOfLines={1}
//               titleStyle={styles.listTitle}
//               descriptionStyle={styles.listDescription}
//               descriptionNumberOfLines={1}
//             />
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// function PublicChatScreen() {
//     const [messages, setMessages] = useState([
//     /**
//      * Mock message data
//      */
//     // example of system message
//     {
//       _id: 0,
//       text: 'New room created.',
//       createdAt: new Date().getTime(),
//       system: true
//     },
//     // example of chat message
//     {
//       _id: 1,
//       text: 'Henlo!',
//       createdAt: new Date().getTime(),
//       user: {
//         _id: 2,
//         name: 'Test User'
//       }
//     }
//   ]);

//   // helper method that is sends a message
//   function handleSend(newMessage = []) {
//     setMessages(GiftedChat.append(messages, newMessage));
//   }

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={newMessage => handleSend(newMessage)}
//       user={{ _id: 1 }}
//     />
//   );
// }

const ChatScreen = () => {
    return (
      <Tab.Navigator>
      <Tab.Screen name="Public Chat" component={PublicChatScreen} />
      <Tab.Screen name="Private Chat" component={PrivateChatScreen} />
    </Tab.Navigator>
    );
};

export default ChatScreen;