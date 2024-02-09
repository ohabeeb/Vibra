/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import ActionButton from 'react-native-action-button';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function AddPost({navigation}) {
  const [image, setImage] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [transferred, setTransferred] = React.useState(0);

  const [post, setPost] = React.useState(null);

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 1200,
      height: 780,
      cropping: true,
    })
      .then(result => {
        const imageUrl = Platform.OS === 'ios' ? result.sourceURL : result.path;
        setImage(imageUrl);
      })
      .catch(e => console.log(e));
  };
  const takePhotoFromGalary = () => {
    ImagePicker.openPicker({
      width: 1200,
      height: 780,
      cropping: true,
    })
      .then(result => {
        const imageUrl = Platform.OS === 'ios' ? result.sourceURL : result.path;
        setImage(imageUrl);
      })
      .catch(e => console.log(e));
  };

  async function handledPostImage() {
    if (image === null) {
      return null;
    }
    const uploadUrl = image;
    let fileName = uploadUrl.substring(uploadUrl.lastIndexOf('/') + 1);

    // Append Timestamp to File Name - Start
    const extention = fileName.split('.').pop();
    const name = fileName.split('.').slice(0, -1).join('.');
    fileName = name + Date.now() + '.' + extention;
    // Append Timestamp to File Name - End

    setUploading(true);
    setTransferred(0);

    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(uploadUrl);
    task.on('state_changed', taskSnapshot => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
      setTransferred(
        Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
          100,
      );
    });
    try {
      await task;
      const url = await storageRef.getDownloadURL();

      setUploading(false);
      // Alert.alert('Status', 'Post uploaded successfully.');
      setImage(null);
      console.log(url);
      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async function submitPost() {
    const imageUrl = await handledPostImage();
    firestore()
      .collection('Posts')
      .add({
        userId: auth().currentUser.uid,
        postBody: post,
        postedTime: firestore.Timestamp.fromDate(new Date()),
        postImage: imageUrl,
        likes: null,
        comments: null,
      })
      .then(() => {
        Alert.alert('Status', 'Post added successfully.');
        setPost(null);
      })
      .catch(e => {
        console.log(e);
      });
  }
  function renderHeader() {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: 10,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="west" size={24} color={'black'} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={submitPost}
          style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>
          <Text>Post</Text>
        </TouchableOpacity>
      </View>
    );
  }
  function renderBody() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {image !== null ? (
          <Image
            source={{uri: image}}
            style={{
              width: '100%',
              // height: Dimensions.get('window').width / 1.5,
            }}
          />
        ) : null}
        <TextInput
          placeholder="What's on your mind?"
          multiline={true}
          numberOfLines={4}
          style={{fontSize: 16}}
          value={post}
          onChangeText={value => setPost(value)}
        />
        {uploading ? (
          <View>
            <Text>{transferred} % completed</Text>
            <ActivityIndicator size={'large'} color={'maroon'} />
          </View>
        ) : null}
      </View>
    );
  }
  function renderActionsButton() {
    return (
      <View style={{flex: 0.2}}>
        {/* Rest of the app comes ABOVE the action button component !*/}
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#3498db"
            title="Choose Photo"
            onPress={() => {
              takePhotoFromGalary();
            }}>
            <MaterialIcons name="photo" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#1abc9c"
            title="Take Photo"
            onPress={() => {
              takePhotoFromCamera();
            }}>
            <MaterialIcons name="camera" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderBody()}
      {renderActionsButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});
