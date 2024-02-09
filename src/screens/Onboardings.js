/* eslint-disable prettier/prettier */
import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';

const Done = ({...props}) => {
  return (
    <TouchableOpacity style={{paddingHorizontal: 8}} {...props}>
      <Text style={{fontSize: 16}}>Lets Go</Text>
    </TouchableOpacity>
  );
};
export default function Onboardings({navigation}) {
  return (
    <Onboarding
      onSkip={() => navigation.replace('SignIn')}
      onDone={() => navigation.replace('SignIn')}
      DoneButtonComponent={Done}
      pages={[
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../assets/images/coffeetime.png')}
              resizeMode="contain"
              style={{height: 200}}
            />
          ),
          title: 'Connect and Thrive',
          subtitle:
            'Welcome to Pal, Where Socializing Meets Meaningful Connections',
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../assets/images/listening.png')}
              resizeMode="contain"
              style={{height: 200}}
            />
          ),
          title: 'Unleash Your Social Side',
          subtitle: 'Discover, Connect, and Share Moments with Pal',
        },
        {
          backgroundColor: '#fff',
          image: (
            <Image
              source={require('../assets/images/love.png')}
              resizeMode="contain"
              style={{height: 200}}
            />
          ),
          title: 'Your Social Hub Awaits',
          subtitle:
            'Join Pal and Dive into a World of Social Engagement and Community Building',
        },
      ]}
    />
  );
}
