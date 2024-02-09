/* eslint-disable prettier/prettier */
import {View, Text} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Home, Message, Profile} from '../screens';

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <MaterialIcons
                name="home"
                size={30}
                color={focused ? 'rgba(0, 0, 0, 0.8)' : 'gray'}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Message"
        component={Message}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <MaterialIcons
                name="chat"
                size={30}
                color={focused ? 'rgba(0, 0, 0, 0.8)' : 'gray'}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => {
            return (
              <MaterialIcons
                name="person"
                size={30}
                color={focused ? 'rgba(0, 0, 0, 0.8)' : 'gray'}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}
