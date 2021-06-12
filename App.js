/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import type {Node} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  useColorScheme,
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import { 
  NavigationContainer, 
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { 
  Provider as PaperProvider, 
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';


import MainTabScreen from './screens/MainTabScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import HelpScreen from './screens/HelpScreen';
import GenderScreen from './screens/admin/GenderScreen';
import ContestScreen from './screens/ContestScreen';
import { AuthContext } from './components/context';

import RootStackScreen from './screens/RootStackScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import UpdateProfileScreen from './screens/UpdateProfileScreen';
import RoleScreen from './screens/admin/RoleScreen';
import PlayerTypeScreen from './screens/admin/PlayerTypeScreen';
import VenueScreen from './screens/admin/VenueScreen';
import TournamentScreen from './screens/admin/TournamentScreen';
import TeamScreen from './screens/admin/TeamScreen';
import UpdateMatchScheduleScreen from './screens/admin/UpdateMatchScheduleScreen';
import UpdateMatchResultScreen from './screens/admin/UpdateMatchResultScreen';
import UserAccountApproval from './screens/admin/UserAccountApproval';
import ListAllUsersScreen from './screens/admin/ListAllUsersScreen';
import PlayerScreen from './screens/admin/PlayerScreen';
import MatchesScreen from './screens/admin/MatchesScreen';
import RechargeScreen from './screens/admin/RechargeScreen';
import AssignRoleToUserScreen from './screens/admin/AssignRoleToUserScreen';
import DeleteScreen from './screens/admin/DeleteScreen';
import UpdateUserScreen from './screens/admin/UpdateUserScreen';
import ResultWithUsersScreen from './screens/ResultWithUsersScreen';
import ForgetPasswordScreen2 from './screens/ForgetPasswordScreen2';
import UpdateMatchMinBet from './screens/admin/UpdateMatchMinBet';
import UpdateMatchMinBetSchedule from './screens/admin/UpdateMatchMinBetSchedule';
import UsersContestsForLiveMatch from './screens/UsersContestsForLiveMatch';
import UpdateActiveTournamentScreen from './screens/admin/UpdateActiveTournamentScreen';
import MatchesScheduleScreenForUpdate from './screens/admin/MatchesScheduleScreenForUpdate';
import ProfileScreen from './screens/ProfileScreen';
import ChatHomeScreen from './screens/ChatHomeScreen';
import RoomScreen from './screens/RoomScreen';
// const baseurl = 'localhost:8080';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const App: () => Node = () => {
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null); 

  const [isDarkTheme, setIsDarkTheme] = React.useState(false);

  // const initialLoginState = {
  //   isLoading: true,
  //   userName: '',
  //   userToken: null,
  //   role: ''
  // };
  const initialLoginState = {
    // isLoading: true,
    username: '',
    token: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }
  
  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  // const loginReducer = (prevState, action) => {
  //   switch( action.type ) {
  //     case 'RETRIEVE_TOKEN': 
  //       return {
  //         ...prevState,
  //         userToken: action.token,
  //         isLoading: false,
  //       };
  //     case 'LOGIN': 
  //       return {
  //         ...prevState,
  //         userName: action.id,
  //         userToken: action.token,
  //         role: action.role,
  //         isLoading: false,
  //       };
  //     case 'LOGOUT': 
  //       return {
  //         ...prevState,
  //         userName: null,
  //         userToken: null,
  //         role: '',
  //         isLoading: false,
  //       };
  //     case 'REGISTER': 
  //       return {
  //         ...prevState,
  //         userName: action.id,
  //         userToken: action.token,
  //         isLoading: false,
  //       };
  //   }
  // };

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          token: action.token,
          // isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userId: action.userId,
          username: action.username,
          role: action.role,
          token: action.token,
          // isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userId: null,
          username: null,
          role: null,
          token: null,
          // isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          username: action.id,
          token: action.token,
          // isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    // signIn: async(userId, foundUser, role) => {
    //   // setUserToken('fgkj');
    //   // setIsLoading(false);
    //   const userToken = String(foundUser[0].userToken);
    //   const userName = foundUser[0].username;
      
    //   try {
    //     // console.log('In App.js : ' + userId.toString());
    //     await AsyncStorage.setItem('userToken', userToken);
    //     await AsyncStorage.setItem('role', role);
    //     await AsyncStorage.setItem('userId', userId.toString());
    //   } catch(e) {
    //     console.log(e);
    //   }
    //   // console.log('user token: ', userToken);
    //   dispatch({ type: 'LOGIN', id: userName, token: userToken, role: role });
    // },
    signIn: async(userId, username, role, token) => {
      try {
        // console.log('From SignIn : ' + userId + ' ' + username + ' ' + role + ' ' + token);
        await AsyncStorage.setItem('userId', userId+'');
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('role', role);
        await AsyncStorage.setItem('token', token);
        // await AsyncStorage.setItem('role', role);
        // await AsyncStorage.setItem('userId', userId.toString());
      } catch(e) {
        console.log(e);
      }
      console.log('Token from Signin : ', token);
      // dispatch({ type: 'LOGIN', id: userName, token: userToken, role: role });
      dispatch({ type: 'LOGIN', userId: userId, username: username, role:role, token: token });
    },
    signOut: async() => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('role');
        await AsyncStorage.removeItem('token');
      } catch(e) {
        // console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
    toggleTheme: () => {
      setIsDarkTheme( isDarkTheme => !isDarkTheme );
    }
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      // setIsLoading(false);
      let token = null;
      try {
        token = await AsyncStorage.getItem('token');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: token });
    }, 1000);
  }, []);

  // if( loginState.isLoading ) {
  //   return(
  //     <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
  //       <ActivityIndicator size="large"/>
  //     </View>
  //   );
  // }

  return (
    // <SafeAreaProvider>
    //   <PaperProvider theme={theme}>
    //       <AuthContext.Provider value={authContext}>
    //       <NavigationContainer theme={theme}>
    //         { loginState.userToken !== null ? (
    //           <Drawer.Navigator>
    //             <Drawer.Screen name="Home" component={MainTabScreen} />
    //             <Drawer.Screen name="changePasswordScreen" component={ChangePasswordScreen} />
    //             <Drawer.Screen name="GenderScreen" component={GenderScreen} />
    //             <Drawer.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} />
    //             {/* <Drawer.Screen name="ContestScreen" component={ContestScreen} /> */}
    //           </Drawer.Navigator>
    //         )
    //       :
    //         <RootStackScreen/>
    //       }
    //       </NavigationContainer>
    //     </AuthContext.Provider>
    //   </PaperProvider>
    // </SafeAreaProvider>

    <SafeAreaProvider>
      <PaperProvider theme={theme}>
          <AuthContext.Provider value={authContext}>
          <NavigationContainer theme={theme}>
            { loginState.token !== null ? (
              <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen name="Home" component={MainTabScreen} />
                <Stack.Screen name="changePasswordScreen" component={ChangePasswordScreen} />
                <Stack.Screen name="GenderScreen" component={GenderScreen} />
                <Stack.Screen name="UpdateProfileScreen" component={UpdateProfileScreen} />
                <Stack.Screen name="ContestScreen" component={ContestScreen} />
                <Stack.Screen name="RoleScreen" component={RoleScreen} />
                <Stack.Screen name="PlayerTypeSCreen" component={PlayerTypeScreen} />
                <Stack.Screen name="VenueScreen" component={VenueScreen} />
                <Stack.Screen name="TournamentScreen" component={TournamentScreen} />
                <Stack.Screen name="TeamScreen" component={TeamScreen} />
                <Stack.Screen name="UpdateMatchScheduleScreen" component={UpdateMatchScheduleScreen} />
                <Stack.Screen name="UpdateMatchResultScreen" component={UpdateMatchResultScreen} />
                <Stack.Screen name="UserAccountApproval" component={UserAccountApproval} />
                <Stack.Screen name="ListAllUsersScreen" component={ListAllUsersScreen} />
                <Stack.Screen name="PlayerScreen" component={PlayerScreen} />
                <Stack.Screen name="MatchesScreen" component={MatchesScreen} />
                <Stack.Screen name="RechargeScreen" component={RechargeScreen} />
                <Stack.Screen name="AssignRoleToUser" component={AssignRoleToUserScreen} />
                <Stack.Screen name="DeleteScreen" component={DeleteScreen} />
                <Stack.Screen name="UpdateUserScreen" component={UpdateUserScreen} />
                <Stack.Screen name="HelpScreen" component={HelpScreen} />
                <Stack.Screen name="ResultWithUsersScreen" component={ResultWithUsersScreen} />
                <Stack.Screen name="ForgetPasswordScreen2" component={ForgetPasswordScreen2} />
                <Stack.Screen name="UpdateMatchMinBetSchedule" component={UpdateMatchMinBetSchedule} />
                <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
                <Stack.Screen name="UpdateMatchMinBet" component={UpdateMatchMinBet} />
                <Stack.Screen name="UsersContestForLiveMatch" component={UsersContestsForLiveMatch} />
                <Stack.Screen name="UpdateActiveTournamentScreen" component={UpdateActiveTournamentScreen} />
                <Stack.Screen name="MatchesScheduleScreenForUpdate" component={MatchesScheduleScreenForUpdate} />
                <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
                <Stack.Screen name="ChatHomeScreen" component={ChatHomeScreen} />
                <Stack.Screen name="RoomScreen" component={RoomScreen} />
              </Stack.Navigator>
            )
          :
            <RootStackScreen/>
          }
          </NavigationContainer>
        </AuthContext.Provider>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
