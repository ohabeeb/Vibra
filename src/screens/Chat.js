/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Bubble, GiftedChat, Send} from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Chat({navigation, route}) {
  const [userName, setUserName] = React.useState('');
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          // avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  React.useEffect(() => {
    const {userName} = route.params;
    setUserName(userName);
  }, [route]);
  const onSend = React.useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
  }, []);

  function renderHeader() {
    return (
      <View
        style={{
          padding: 15,
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          flexDirection: 'row',
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="west" size={24} color={'black'} />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: 'black',
              textAlign: 'center',
            }}>
            {userName}
          </Text>
        </View>
      </View>
    );
  }
  const renderBubble = props => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'maroon',
          },
        }}
        textStyle={{right: {color: '#FFF'}}}
      />
    );
  };
  const renderSend = props => {
    return (
      <Send
        {...props}
        containerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 5,
        }}>
        <MaterialCommunityIcons name="send-circle" size={28} color="maroon" />
      </Send>
    );
  };
  function scrollToBottomComponent() {
    return (
      <View>
        <FontAwesome
          name="angle-double-down"
          size={28}
          color="maroon"
        />
      </View>
    );
  }
  function renderChat() {
    return (
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
      />
    );
  }
  return (
    <View style={{flex: 1}}>
      {renderHeader()}
      {renderChat()}
    </View>
  );
}
