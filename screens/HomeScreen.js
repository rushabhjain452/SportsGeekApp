import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar,Icon, ScrollView,TouchableOpacity } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CarouselCardItem, { SLIDER_WIDTH, ITEM_WIDTH } from './CarouselCardItem';
import data from '../data';
import { Card} from 'react-native-elements'
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleScreen from './ScheduleScreen';
import { Container, Header, Content, CardItem, Thumbnail,Left, Body } from 'native-base';
// const HomeStack = createStackNavigator();
const HomeScreen = ({navigation}) => {
  const [index, setIndex] = React.useState(0)
  const isCarousel = React.useRef(null)
  return (
    <ScrollView keyboardShouldPersistTaps='handled'>
    <View style={styles.container}>
 <Carousel
        layout="tinder"
        layoutCardOffset={9}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        onSnapToItem={(index) => setIndex(index)}
        useScrollView={true}
      />
      <Pagination
        dotsLength={data.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.92)'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
      />
    </View>
    {/* <Card>
    <Card.Title>IPL Schedule 2021</Card.Title>
    <Card.Divider/>
    <Card.Image source={require('../assets/schedule.jpg')}></Card.Image>
    <Card.Divider/>
    <Button
      buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
      title='View Schedule' onPress={() => navigation.navigate('ScheduleScreen')} />
    </Card> */}
    <View style={{paddingBottom:20}}></View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight
  }
});