/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Card} from '../components';
// import {post} from '../constants/posts';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import moment from 'moment';

export default function Home({navigation}) {
  const [postData, setPostData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [deleted, setDeleted] = React.useState(false);

  const fetchData = async () => {
    try {
      const list = [];
      await firestore()
        .collection('Posts')
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
      // console.log(list);
      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, [postData]);

  React.useEffect(() => {
    fetchData();
    // setDeleted(false);
  }, [deleted]);

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

  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: 50,
          marginVertical: 10,
        }}>
        <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black'}}>
          Vibra
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('AddPost')}>
          <MaterialIcons name="add" size={30} color={'maroon'} />
        </TouchableOpacity>
      </View>
    );
  }
  function renderCard() {
    return loading ? (
      renderSkeletonPlaceholder()
    ) : (
      <FlatList
        data={postData}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({item, index}) => (
          <Card
            profileImage={item?.profileImage}
            profileName={item?.profileName}
            postedTime={item?.postedTime}
            postBody={item?.postBody}
            postImage={item?.postImage}
            numberOfLikes={item?.numberOfLikes}
            numberOfComments={item?.numberOfComments}
            userId={item?.userId}
            onDeleteIconPress={() => handleDelete(item?.id)}
            onUserProfilePressed={() => navigation.navigate('UserProfile', {userId: item?.userId})}
          />
        )}
      />
    );
  }
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
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
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
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderCard()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
  },
});
