import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { List, Divider } from 'react-native-paper';
import Loading from '../components/Loading';

const PrivateChatScreen = () => {
  // return (
  //   <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //     <Text>Private Chat!</Text>
  //   </View>
  // );
  // const [threads, setThreads] = useState([]);
  const [threads, setThreads] = useState([
    {
      _id: 1,
      name: 'Rushabh Jain',
      latestMessage: {text: 'How are you ?'}
    },
    {
      _id: 2,
      name: 'Sajesh Adeya'
    }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
  });

  useEffect(() => {
    setThreads([
      {
        _id: 1,
        name: 'Rushabh Jain'
      },
      {
        _id: 2,
        name: 'Sajesh Adeya'
      }
    ]);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={item => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('RoomScreen', { thread: item })}
          >
            <List.Item
              title={item.name}
              description='Item description'
              titleNumberOfLines={1}
              titleStyle={styles.listTitle}
              descriptionStyle={styles.listDescription}
              descriptionNumberOfLines={1}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default PrivateChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  }
});