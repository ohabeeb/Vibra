/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {UserCard} from '../components';
import {messages} from '../constants/messages';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

function renderSkeletonPlaceholder() {
  let i = [1, 2, 3];
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: '#F5F5F5'}}
      contentContainerStyle={{padding: 20}}>
      {i.map((item, index) => {
        return (
          <SkeletonPlaceholder key={index}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <View style={{width: 50, height: 50, borderRadius: 25}} />
              <View>
                <View
                  style={{
                    height: 20,
                    width: 150,
                    marginBottom: 5,
                    borderRadius: 4,
                  }}
                />
                <View style={{height: 20, width: 120}} />
              </View>
            </View>
            <View style={{marginTop: 5}}>
              <View style={{width: 300, height: 20, marginVertical: 5}} />
              <View
                style={{
                  width: '100%',
                  height: Dimensions.get('window').height / 3,
                }}
              />
            </View>
          </SkeletonPlaceholder>
        );
      })}
    </ScrollView>
  );
}

export default function Message({navigation}) {
  const [userMessages, setUserMessages] = React.useState(messages);

  function renderHeader() {
    return (
      <View
        style={{
          padding: 15,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          flexDirection: 'row',
          gap: 5,
        }}>
        <TouchableOpacity
          style={{paddingVertical: 5}}
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons name="west" size={25} color={'black'} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
              textAlign: 'center',
            }}>
            Messages
          </Text>
        </View>
      </View>
    );
  }
  function renderMessages() {
    return (
      <FlatList
        data={userMessages}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 10}}
        renderItem={({item, index}) => (
          <UserCard
            userImage={item?.profileImage}
            userName={item?.profileName}
            messageTime={item?.messageTime}
            messageText={item?.messageText}
            onPress={() =>
              navigation.navigate('Chat', {userName: item?.profileName})
            }
          />
        )}
      />
    );
  }
  return (
    <View style={{flex: 1, backgroundColor: '#FFF'}}>
      {renderHeader()}
      {renderMessages()}
      {/* <ScrollView style={{flex: 1, padding: 15}}>
        <User />
      </ScrollView> */}
    </View>
  );
}
