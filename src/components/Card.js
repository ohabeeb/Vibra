/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import auth from '@react-native-firebase/auth';

export default function Card({
  profileImage,
  profileName,
  postedTime,
  postBody,
  postImage,
  numberOfLikes = 0,
  numberOfComments = 0,
  userId,
  onUserProfilePressed,
  onDeleteIconPress,
}) {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: '#F5F5F5',
        marginBottom: 10,
        borderRadius: 5,
        padding: 5,
        elevation: 1,
      }}>
      <View style={{flexDirection: 'row', gap: 10}}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F1F1F5',
          }}>
          <Image
            source={profileImage}
            resizeMode="cover"
            style={{width: 40, height: 40, borderRadius: 20}}
          />
        </View>
        <View style={{flex: 1}}>
          <TouchableOpacity onPress={onUserProfilePressed}>
            <Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
              {profileName}
            </Text>
          </TouchableOpacity>
          <Text>{postedTime.toString()}</Text>
        </View>
      </View>
      <View>
        <Text style={{marginTop: 10}}>{postBody}</Text>
        <View
          style={{
            width: '100%',
            marginVertical: 5,
          }}>
          {postImage === null && (
            <View
              style={{width: '100%', height: 2, backgroundColor: 'lightgray'}}
            />
          )}
          {postImage === null ? null : (
            <Image
              source={{uri: postImage}}
              style={{
                width: '100%',
                height: Dimensions.get('window').height / 3,
              }}
            />
          )}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            height: 30,
            width: '100%',
            marginTop: 10,
          }}>
          <TouchableOpacity style={{flexDirection: 'row', gap: 5}}>
            <MaterialIcons
              name="favorite"
              size={20}
              color={numberOfLikes <= 0 ? 'gray' : 'maroon'}
            />
            <Text>{numberOfLikes <= 0 ? '' : numberOfLikes} likes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row', gap: 5}}>
            <MaterialIcons name="comment" size={20} color="gray" />
            <Text>
              {numberOfComments <= 0 ? '' : numberOfComments} comments
            </Text>
          </TouchableOpacity>
          {auth().currentUser?.uid === userId ? (
            <TouchableOpacity
              onPress={onDeleteIconPress}
              style={{flexDirection: 'row', gap: 5}}>
              <MaterialIcons name="delete" size={20} color="gray" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}
