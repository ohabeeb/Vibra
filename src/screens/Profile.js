/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Alert,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Card} from '../components';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import moment from 'moment';

export default function Profile({navigation, route}) {
  const [postData, setPostData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [deleted, setDeleted] = React.useState(false);
  const [userData, setUserData] = React.useState(null);

  const fetchData = async () => {
    try {
      const list = [];
      await firestore()
        .collection('Posts')
        .where('userId', '==', auth().currentUser.uid)
        .orderBy('postedTime', 'desc')
        .get()
        .then(querySnapshot => {
          // console.log('Total posts ', querySnapshot.size);
          querySnapshot.forEach(doc => {
            const {postBody, postImage, postedTime, Likes, Comments, userId} =
              doc.data();
            list.push({
              id: doc.id,
              userId,
              profileImage: require('../assets/images/users/profile_2.jpg'),
              profileName: 'Test Name',
              postedTime: moment(postedTime.toDate()).fromNow(),
              postBody: postBody,
              postImage: postImage,
              numberOfLikes: Likes,
              numberOfComments: Comments,
            });
          });
        });
      setPostData(list);
      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchData();
    getUser();
    navigation.addListener('focus', () => {
      setLoading(!loading);
    });
  }, [postData, navigation, loading]);

  React.useEffect(() => {
    fetchData();

    // setDeleted(false);
  }, [deleted]);

  async function getUser() {
    const currentUser = await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  }
  function deletePost(postId) {
    firestore()
      .collection('Posts')
      .doc(postId)
      .get()
      .then(documentSnapshort => {
        if (documentSnapshort.exists) {
          const {postImage} = documentSnapshort.data();
          if (postImage !== null) {
            const storageRef = storage().refFromURL(postImage);
            const imageRef = storage().ref(storageRef.fullPath);
            imageRef
              .delete()
              .then(() => {
                console.log('Image Deleed Successfuly');
                deletePostFromFirestore(postId);
                setDeleted(true);
              })
              .catch(e => console.log(e));
          } else {
            deletePostFromFirestore(postId);
          }
        }
      });
  }
  const deletePostFromFirestore = postId => {
    firestore()
      .collection('Posts')
      .doc(postId)
      .delete()
      .then(() => {
        ToastAndroid.showWithGravity(
          'Post has been deleted',
          5000,
          ToastAndroid.TOP,
        );
        setDeleted(true);
      })
      .catch(e => console.log(e));
  };

  const handleDelete = postId => {
    Alert.alert(
      'Delete Post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            console.log('Cancle');
          },
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            deletePost(postId);
          },
          style: '',
        },
      ],
      {cancelable: false},
    );
  };
  async function SignOutUser() {
    await auth().signOut();
    navigation.replace('SignIn');
  }
  function renderHeader() {
    return (
      <View style={{flex: 0.7}}>
        <TouchableOpacity
          style={{paddingVertical: 5}}
          onPress={() => {
            navigation.goBack();
          }}>
          <MaterialIcons name="west" size={25} color={'maroon'} />
        </TouchableOpacity>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            marginTop: 20,
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
            }}>
            <Image
              source={{uri: userData?.profileImage}}
              resizeMode="cover"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 50,
              }}
            />
          </View>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#000',
              marginVertical: 10,
            }}>
            {userData?.firstName} {userData?.lastName}
          </Text>
          <Text style={{fontSize: 12, textAlign: 'justify'}}>
            {' '}
            {userData ? userData?.aboutMe : "Hey! I'm using Vibra"}{' '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              gap: 10,
              width: Dimensions.get('window').width / 2.5,
            }}>
            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 5,
                borderRadius: 5,
                borderColor: 'maroon',
              }}
              onPress={() => navigation.navigate('EditProfile')}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'maroon'}}>
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                borderWidth: 2,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 5,
                borderRadius: 5,
                borderColor: 'maroon',
              }}
              onPress={() => SignOutUser()}>
              <Text style={{fontSize: 16, fontWeight: 'bold', color: 'maroon'}}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
  function renderPostInfo() {
    return (
      <View
        style={{
          // flex: 0.5,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          marginVertical: 30,
        }}>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
            {postData.length}
          </Text>
          <Text>Posts</Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
            5308
          </Text>
          <Text>Followers</Text>
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#000'}}>
            508
          </Text>
          <Text>Followings</Text>
        </View>
      </View>
    );
  }

  function renderUserPost() {
    return postData.map(item => (
      <View style={{flex: 1}}>
        <Card
          key={item.id}
          profileImage={item?.profileImage}
          profileName={item?.profileName}
          postedTime={item?.postedTime}
          postBody={item?.postBody}
          postImage={item?.postImage}
          numberOfLikes={item?.numberOfLikes}
          numberOfComments={item?.numberOfComments}
          userId={item?.userId}
          onDeleteIconPress={() => handleDelete(item?.id)}
        />
      </View>
    ));
  }
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderPostInfo()}
      <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
        {renderUserPost()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
});
