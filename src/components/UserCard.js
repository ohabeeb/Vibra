/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {View, Text, Image, TouchableOpacity} from 'react-native';
import React from 'react';

export default function User({
  userImage,
  userName,
  messageText,
  messageTime,
  onPress,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{width: '100%', marginVertical: 10}}>
      <View style={{flexDirection: 'row', gap: 10}}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 25,
          }}>
          <Image
            source={userImage}
            resizeMode="cover"
            style={{width: '100%', height: '100%', borderRadius: 25}}
          />
        </View>
        <View
          style={{
            flex: 1,
            borderBottomWidth: 1,
            borderBottomColor: 'lightgray',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>{userName}</Text>
            <Text>{messageTime}</Text>
          </View>
          <Text numberOfLines={1}>{messageText}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
