import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  AddPost,
  Chat,
  EditProfile,
  Onboardings,
  Profile,
  SignIn,
  SignUp,
  UserProfile,
} from './src/screens';
import Tabs from './src/navigation/tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

export default function App() {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState(null);
  React.useEffect(() => {
    AsyncStorage.getItem('alreadyLaunched').then(value => {
      if (value === null) {
        AsyncStorage.setItem('alreadyLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={'Onboardings'}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Onboardings" component={Onboardings} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={'SignIn'}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="AddPost" component={AddPost} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
